import { describe, expect, it } from 'vitest';
import {
  buildProgression,
  calculateConsistencyScore,
  calculateFatigueScore,
  HIGH_FATIGUE_THRESHOLD,
  type PerformanceEntry,
  type ProgressionInput
} from './progression.js';

const today = '2026-05-28T00:00:00.000Z';

function history(length: number, completionRate: number): PerformanceEntry[] {
  return Array.from({ length }, (_, index) => ({
    date: `2026-05-${String(index + 1).padStart(2, '0')}T00:00:00.000Z`,
    completionRate,
    completed: completionRate >= 0.9
  }));
}

function baseInput(overrides: Partial<ProgressionInput> = {}): ProgressionInput {
  return {
    today,
    completionRate: 0.95,
    currentStreak: 30,
    missedWorkoutCount: 0,
    recentPerformanceHistory: history(14, 0.95),
    currentDifficulty: { reps: 50, distanceMeters: 1_000 },
    currentRankTarget: { reps: 45, distanceMeters: 900 },
    nextRankTarget: { reps: 80, distanceMeters: 1_600 },
    currentRankStartedAt: '2026-04-20T00:00:00.000Z',
    ...overrides
  };
}

describe('progression engine', () => {
  it('progresses safely with high consistency and low fatigue', () => {
    const result = buildProgression(baseInput());

    expect(result.consistencyScore).toBeGreaterThanOrEqual(0.75);
    expect(result.fatigueScore).toBeLessThan(0.55);
    expect(result.recoveryRecommendation.action).toBe('progress');
    expect(result.nextWorkoutDifficulty.reps).toBeGreaterThan(50);
    expect(result.nextWorkoutDifficulty.distanceMeters).toBeGreaterThan(1_000);
    expect(result.nextWorkoutDifficulty.reps).toBeLessThan(80);
    expect(result.nextWorkoutDifficulty.distanceMeters).toBeLessThan(1_600);
  });

  it('deloads and refuses escalation when fatigue is high', () => {
    const currentDifficulty = { reps: 60, distanceMeters: 1_200 };
    const result = buildProgression(
      baseInput({
        completionRate: 0.2,
        currentStreak: 0,
        missedWorkoutCount: 5,
        recentPerformanceHistory: history(8, 0.2),
        currentDifficulty
      })
    );

    expect(result.fatigueScore).toBeGreaterThanOrEqual(HIGH_FATIGUE_THRESHOLD);
    expect(result.recoveryRecommendation.action).toBe('deload');
    expect(result.recoveryRecommendation.reason).toContain('blocks escalation');
    expect(result.nextWorkoutDifficulty.reps).toBeLessThan(currentDifficulty.reps);
    expect(result.nextWorkoutDifficulty.distanceMeters).toBeLessThan(
      currentDifficulty.distanceMeters
    );
    expect(result.advancesRank).toBe(false);
  });

  it('does not advance rank when consistency is low', () => {
    const result = buildProgression(
      baseInput({
        completionRate: 0.4,
        currentStreak: 2,
        missedWorkoutCount: 3,
        recentPerformanceHistory: history(14, 0.45),
        currentDifficulty: { reps: 79, distanceMeters: 1_580 }
      })
    );

    expect(result.consistencyScore).toBeLessThanOrEqual(0.6);
    expect(result.recoveryRecommendation.action).not.toBe('progress');
    expect(result.advancesRank).toBe(false);
  });

  it('bounds smooth progression so it never exceeds the next rank target prematurely', () => {
    const result = buildProgression(
      baseInput({
        currentDifficulty: { reps: 79.8, distanceMeters: 1_599 },
        currentStreak: 10,
        currentRankStartedAt: '2026-05-20T00:00:00.000Z'
      })
    );

    expect(result.recoveryRecommendation.action).toBe('progress');
    expect(result.nextWorkoutDifficulty.reps).toBeLessThanOrEqual(80);
    expect(result.nextWorkoutDifficulty.distanceMeters).toBeLessThanOrEqual(1_600);
    expect(result.nextWorkoutDifficulty.reps).toBeGreaterThan(79.8);
    expect(result.nextWorkoutDifficulty.distanceMeters).toBeGreaterThan(1_599);
    expect(result.advancesRank).toBe(false);
  });

  it('keeps score helpers bounded between zero and one', () => {
    const pathologicalInput = baseInput({
      completionRate: 2,
      currentStreak: 100,
      missedWorkoutCount: -5,
      recentPerformanceHistory: history(3, 1.5)
    });

    expect(calculateConsistencyScore(pathologicalInput)).toBeGreaterThanOrEqual(0);
    expect(calculateConsistencyScore(pathologicalInput)).toBeLessThanOrEqual(1);
    expect(calculateFatigueScore(pathologicalInput)).toBeGreaterThanOrEqual(0);
    expect(calculateFatigueScore(pathologicalInput)).toBeLessThanOrEqual(1);
  });
});
