import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HeroPathDatabase } from '../../src/db/database';
import {
  getProgression,
  saveProgression,
  getStreak,
  saveStreak,
  listAchievements,
  saveAchievements
} from '../../src/db/repositories/progressionRepository';
import {
  listWorkouts,
  saveWorkout
} from '../../src/db/repositories/workoutRepository';
import type { ProgressionState, StreakState, UserAchievement, WorkoutRecord } from '../../src/domain/types';

describe('HeroPath Persistence', () => {
  let db: HeroPathDatabase;

  beforeEach(async () => {
    // Note: repositories currently use the global exported 'db' instance.
    // For proper isolation in tests, we might want to inject the DB,
    // but here we'll just clear the global one if possible or rely on unique DB names if HeroPathDatabase allowed it.
    // Since HeroPathDatabase is hardcoded to 'heropath', we clear it.
    db = new HeroPathDatabase();
    await db.workouts.clear();
    await db.progression.clear();
    await db.streak.clear();
    await db.achievements.clear();
  });

  afterEach(async () => {
    await db.close();
  });

  it('round-trips progression state', async () => {
    const state: ProgressionState = {
      totalXp: 1000,
      level: 5,
      rankId: 'squire',
      workoutsCompleted: 10
    };

    await saveProgression(state);
    const saved = await getProgression();
    expect(saved).toEqual(state);
  });

  it('round-trips streak state', async () => {
    const state: StreakState = {
      current: 5,
      longest: 10,
      lastWorkoutDate: '2026-05-28'
    };

    await saveStreak(state);
    const saved = await getStreak();
    expect(saved).toEqual(state);
  });

  it('round-trips achievements', async () => {
    const achievements: UserAchievement[] = [
      { id: 'first-quest', unlockedAt: '2026-05-28', xpReward: 50 }
    ];

    await saveAchievements(achievements);
    const saved = await listAchievements();
    expect(saved).toEqual(achievements);
  });

  it('round-trips workouts', async () => {
    const workout: WorkoutRecord = {
      id: 'w1',
      completedAt: '2026-05-28T12:00:00Z',
      durationMinutes: 30,
      intensity: 3,
      exercisesCompleted: 5,
      xpAwarded: 225
    };

    await saveWorkout(workout);
    const workouts = await listWorkouts();
    expect(workouts).toContainEqual(workout);
  });
});
