import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  createAchievementRepository,
  createDatabase,
  createPreferences,
  createProgressionRepository,
  createUserRepository,
  createWorkoutRepository,
  type SssDatabase
} from '../../src/db';
import type { Achievement, Progression, User, Workout } from '../../src/domain/types';

const now = '2026-05-28T00:00:00.000Z';

const expectOk = <T>(result: { ok: true; data: T } | { ok: false; error: unknown }): T => {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error('Expected persistence result to be ok');
  }
  return result.data;
};

describe('Dexie persistence repositories', () => {
  let database: SssDatabase;

  beforeEach(async () => {
    database = createDatabase(`ssswork-test-${crypto.randomUUID()}`);
    await database.open();
  });

  afterEach(async () => {
    await database.delete();
  });

  it('round-trips users, achievements, progression, and workouts as domain records', async () => {
    const users = createUserRepository(database);
    const achievements = createAchievementRepository(database);
    const progression = createProgressionRepository(database);
    const workouts = createWorkoutRepository(database);

    const user: User = {
      id: 'user-1',
      username: 'sam',
      displayName: 'Sam Strong',
      createdAt: now,
      updatedAt: now
    };
    const achievement: Achievement = {
      id: 'achievement-1',
      userId: user.id,
      key: 'first-100',
      title: 'First 100',
      description: 'Complete 100 pushups.',
      unlockedAt: now,
      progress: 100,
      goal: 100,
      createdAt: now,
      updatedAt: now
    };
    const progressionRecord: Progression = {
      id: 'progression-1',
      userId: user.id,
      date: '2026-05-28',
      totalPushups: 75,
      streakDays: 3,
      level: 2,
      experience: 275,
      createdAt: now,
      updatedAt: now
    };
    const workout: Workout = {
      id: 'workout-1',
      userId: user.id,
      type: 'pushups',
      date: '2026-05-28',
      pushups: 75,
      sets: 5,
      reps: 15,
      notes: 'Felt strong.',
      createdAt: now,
      updatedAt: now
    };

    expectOk(await users.create(user));
    expectOk(await achievements.create(achievement));
    expectOk(await progression.create(progressionRecord));
    expectOk(await workouts.create(workout));

    expect(expectOk(await users.getById(user.id))).toEqual(user);
    expect(expectOk(await achievements.getById(achievement.id))).toEqual(achievement);
    expect(expectOk(await progression.getById(progressionRecord.id))).toEqual(progressionRecord);
    expect(expectOk(await workouts.getById(workout.id))).toEqual(workout);
  });

  it('calculates aggregate pushups and filters workouts by date range', async () => {
    const workouts = createWorkoutRepository(database);
    const userId = 'user-1';
    const records: Workout[] = [
      {
        id: 'outside-before',
        userId,
        type: 'pushups',
        date: '2026-05-01',
        pushups: 10,
        sets: 1,
        reps: 10,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'inside-one',
        userId,
        type: 'pushups',
        date: '2026-05-10',
        pushups: 25,
        sets: 5,
        reps: 5,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'inside-two',
        userId,
        type: 'pushups',
        date: '2026-05-20',
        pushups: 40,
        sets: 4,
        reps: 10,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'other-user',
        userId: 'user-2',
        type: 'pushups',
        date: '2026-05-15',
        pushups: 999,
        sets: 1,
        reps: 999,
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const record of records) {
      expectOk(await workouts.create(record));
    }

    expect(expectOk(await workouts.getTotalPushups(userId))).toBe(75);
    expect(
      expectOk(await workouts.getWorkoutsByDateRange(userId, '2026-05-10', '2026-05-20'))
    ).toEqual([records[1], records[2]]);
  });

  it('surfaces typed errors instead of throwing when IndexedDB operations fail', async () => {
    const users = createUserRepository(database);
    database.close();
    await database.delete();

    const result = await users.getById('missing-user');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('PersistenceError');
      expect(result.error.operation).toBe('read');
      expect(result.error.table).toBe('users');
    }
  });
});

describe('localStorage preferences', () => {
  it('stores only lightweight theme, onboarding, and username preferences', () => {
    const storage = new Map<string, string>();
    const preferences = createPreferences({
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key)
    });

    expectOk(preferences.setTheme('dark'));
    expectOk(preferences.setOnboardingComplete(true));
    expectOk(preferences.setUsername('sam'));

    expect(expectOk(preferences.getTheme())).toBe('dark');
    expect(expectOk(preferences.getOnboardingComplete())).toBe(true);
    expect(expectOk(preferences.getUsername())).toBe('sam');
    expect([...storage.keys()].sort()).toEqual([
      'ssswork:onboardingComplete',
      'ssswork:theme',
      'ssswork:username'
    ]);
  });
});
