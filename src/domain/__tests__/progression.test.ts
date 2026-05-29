import { describe, expect, it } from 'vitest';
import { evaluateAchievements, getAchievementRewardXp } from '../achievements';
import { completeWorkoutProgression, initialProgression } from '../progression';
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
      progression: { totalXp: 170, level: 1, rankId: 'initiate', workoutsCompleted: 1 },
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
