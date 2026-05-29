import { describe, expect, it } from 'vitest';
import {
  XP_SOURCES,
  calculateWorkoutXp,
  levelFromTotalXp,
  xpForLevel,
  type Workout,
} from '../../src/domain/xp.js';

const targetWorkout: Workout = {
  exercises: [
    {
      id: 'squat',
      name: 'Squat',
      sets: [
        { reps: 10, weight: 100 },
        { reps: 10, weight: 100 },
      ],
    },
    {
      id: 'run',
      name: 'Run',
      sets: [{ durationSeconds: 600, distanceMeters: 2_000 }],
    },
  ],
};

const perfectWorkout: Workout = {
  exercises: [
    {
      id: 'squat',
      name: 'Squat',
      sets: [
        { reps: 10, weight: 100 },
        { reps: 12, weight: 100 },
      ],
    },
    {
      id: 'run',
      name: 'Run',
      sets: [{ durationSeconds: 700, distanceMeters: 2_100 }],
    },
  ],
};

describe('xpForLevel', () => {
  it('is monotonic and strictly increases for adjacent levels', () => {
    let previous = xpForLevel(1);
    expect(previous).toBe(0);

    for (let level = 2; level <= 250; level += 1) {
      const current = xpForLevel(level);
      expect(current).toBeGreaterThan(previous);
      previous = current;
    }
  });

  it('uses stable early boundaries for frequent micro-rewards', () => {
    expect(xpForLevel(1)).toBe(0);
    expect(xpForLevel(2)).toBe(100);
    expect(xpForLevel(3)).toBe(293);
    expect(xpForLevel(4)).toBe(560);
    expect(xpForLevel(5)).toBe(891);
  });

  it('rejects invalid levels', () => {
    expect(() => xpForLevel(0)).toThrow(RangeError);
    expect(() => xpForLevel(1.5)).toThrow(RangeError);
  });
});

describe('levelFromTotalXp', () => {
  it('returns the exact level on each boundary and the prior level before the next boundary', () => {
    for (let level = 1; level <= 100; level += 1) {
      expect(levelFromTotalXp(xpForLevel(level))).toBe(level);

      const nextBoundary = xpForLevel(level + 1);
      expect(levelFromTotalXp(nextBoundary - 1)).toBe(level);
    }
  });

  it('rejects invalid total XP values', () => {
    expect(() => levelFromTotalXp(-1)).toThrow(RangeError);
    expect(() => levelFromTotalXp(Number.NaN)).toThrow(RangeError);
  });
});

describe('calculateWorkoutXp', () => {
  it('returns an itemized perfect-completion bonus when all targets are hit', () => {
    const breakdown = calculateWorkoutXp(perfectWorkout, targetWorkout, {
      baseWorkoutXp: 120,
      perfectBonusXp: 40,
      streakMilestones: [{ days: 7, xp: 70, label: 'Weekly streak' }],
      achievementUnlocks: [{ id: 'first-perfect', name: 'First perfect workout', xp: 50 }],
    });

    expect(breakdown.completionRatio).toBe(1);
    expect(breakdown.isPerfectCompletion).toBe(true);
    expect(breakdown.base).toMatchObject({
      source: XP_SOURCES.workoutCompletionBase,
      xp: 120,
    });
    expect(breakdown.bonuses).toEqual([
      expect.objectContaining({ source: XP_SOURCES.perfectCompletionBonus, xp: 40 }),
      expect.objectContaining({ source: XP_SOURCES.streakMilestoneBonus, xp: 70 }),
      expect.objectContaining({ source: XP_SOURCES.achievementUnlockBonus, xp: 50 }),
    ]);
    expect(breakdown.items.map((item) => item.source)).toEqual([
      XP_SOURCES.workoutCompletionBase,
      XP_SOURCES.perfectCompletionBonus,
      XP_SOURCES.streakMilestoneBonus,
      XP_SOURCES.achievementUnlockBonus,
    ]);
    expect(breakdown.total).toBe(280);
  });

  it('grants partial base XP without the perfect bonus for partial completion', () => {
    const partialWorkout: Workout = {
      exercises: [
        {
          id: 'squat',
          sets: [
            { reps: 5, weight: 50 },
            { reps: 5, weight: 50 },
          ],
        },
        {
          id: 'run',
          sets: [{ durationSeconds: 300, distanceMeters: 1_000 }],
        },
      ],
    };

    const breakdown = calculateWorkoutXp(partialWorkout, targetWorkout, {
      baseWorkoutXp: 100,
      perfectBonusXp: 25,
    });

    expect(breakdown.completionRatio).toBe(0.5);
    expect(breakdown.base.xp).toBe(50);
    expect(breakdown.total).toBe(50);
    expect(breakdown.isPerfectCompletion).toBe(false);
    expect(breakdown.items).toEqual([
      expect.objectContaining({ source: XP_SOURCES.workoutCompletionBase, xp: 50 }),
    ]);
  });

  it('caps over-target work at the base XP maximum while still detecting perfection', () => {
    const breakdown = calculateWorkoutXp(perfectWorkout, targetWorkout, { baseWorkoutXp: 100 });

    expect(breakdown.completionRatio).toBe(1);
    expect(breakdown.base.xp).toBe(100);
    expect(breakdown.total).toBe(125);
  });
});
