import { describe, expect, it } from 'vitest';
import { evaluateAchievements, getAchievementRewardXp } from '../achievements';
import {
  buildProgression,
  calculateConsistencyScore,
  calculateFatigueScore,
  completeWorkoutProgression,
  HIGH_FATIGUE_THRESHOLD,
  initialProgression,
  type PerformanceEntry,
  type ProgressionInput
} from '../progression';
import { getRankForXp } from '../ranks';
import { applyWorkoutToStreak } from '../streak';
import { calculateWorkoutXp, getLevelForXp } from '../xp';
import type { WorkoutRecord } from '../types';

describe('HeroPath domain rules', () => {
  it('calculates deterministic XP from workout inputs', () => {
    expect(
      calculateWorkoutXp({
        completedAt: '2026-05-28T12:00:00.000Z',
        durationMinutes: 30,
        intensity: 4,
        exercisesCompleted: 6
      })
    ).toBe(261);
  });

  it('levels and ranks are derived from total XP', () => {
    expect(getLevelForXp(0)).toBe(1);
    expect(getLevelForXp(499)).toBe(2);
    expect(getRankForXp(1_500).id).toBe('guardian');
  });

  it('increments workout count while applying XP', () => {
    const next = completeWorkoutProgression(initialProgression, 500);

    expect(next).toMatchObject({ totalXp: 500, level: 3, rankId: 'squire', workoutsCompleted: 1 });
  });

  it('updates streaks once per UTC day', () => {
    const dayOne = applyWorkoutToStreak({ current: 0, longest: 0 }, '2026-05-26T08:00:00.000Z');
    const duplicateDay = applyWorkoutToStreak(dayOne, '2026-05-26T18:00:00.000Z');
    const dayTwo = applyWorkoutToStreak(duplicateDay, '2026-05-27T08:00:00.000Z');
    const missedDay = applyWorkoutToStreak(dayTwo, '2026-05-29T08:00:00.000Z');

    expect(duplicateDay.current).toBe(1);
    expect(dayTwo.current).toBe(2);
    expect(missedDay).toMatchObject({ current: 1, longest: 2, lastWorkoutDate: '2026-05-29' });
  });

  it('evaluates achievements without duplicating existing unlocks', () => {
    const workouts: WorkoutRecord[] = [
      {
        id: 'workout-1',
        completedAt: '2026-05-28T12:00:00.000Z',
        durationMinutes: 20,
        intensity: 3,
        exercisesCompleted: 4,
        xpAwarded: 170
      }
    ];
    const snapshot = {
      progression: {
        totalXp: 170,
        level: 1,
        rankId: 'initiate',
        workoutsCompleted: 1,
        muscleGrowth: initialProgression.muscleGrowth
      },
      streak: { current: 1, longest: 1, lastWorkoutDate: '2026-05-28' },
      workouts
    };

    const unlocked = evaluateAchievements(snapshot, [], '2026-05-28T12:00:00.000Z');
    const secondPass = evaluateAchievements(snapshot, unlocked, '2026-05-28T12:01:00.000Z');

    expect(unlocked.map((achievement) => achievement.id)).toEqual(['first-quest']);
    expect(getAchievementRewardXp([], unlocked)).toBe(50);
    expect(secondPass).toHaveLength(1);
  });
});

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
