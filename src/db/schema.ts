import Dexie, { type Table } from 'dexie';
import type { Achievement, Progression, User, Workout } from '../domain/types';

export type UserRow = User;
export type WorkoutRow = Workout;
export type AchievementRow = Achievement;
export type ProgressionRow = Progression;

export const CURRENT_DB_VERSION = 1;

const applyVersionedSchema = (database: Dexie): void => {
  database.version(CURRENT_DB_VERSION).stores({
    users: '&id, username, createdAt, updatedAt',
    workouts: '&id, userId, date, type, [userId+date], createdAt, updatedAt',
    achievements: '&id, userId, key, [userId+key], unlockedAt, createdAt, updatedAt',
    progression: '&id, userId, date, [userId+date], level, createdAt, updatedAt',
  });
};

export class SssDatabase extends Dexie {
  users!: Table<UserRow, string>;
  workouts!: Table<WorkoutRow, string>;
  achievements!: Table<AchievementRow, string>;
  progression!: Table<ProgressionRow, string>;

  constructor(databaseName = 'ssswork') {
    super(databaseName);

    applyVersionedSchema(this);
  }
}

export const db = new SssDatabase();

export const createDatabase = (databaseName?: string): SssDatabase => new SssDatabase(databaseName);
