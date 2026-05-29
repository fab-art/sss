import Dexie, { type Table } from 'dexie';
import type { ProgressionState, StreakState, UserAchievement, WorkoutRecord } from '../domain/types';

export type SingletonRecord<T> = {
  id: 'current';
  value: T;
};

export class HeroPathDatabase extends Dexie {
  workouts!: Table<WorkoutRecord, string>;
  progression!: Table<SingletonRecord<ProgressionState>, 'current'>;
  streak!: Table<SingletonRecord<StreakState>, 'current'>;
  achievements!: Table<UserAchievement, string>;

  constructor() {
    super('heropath');
    this.version(1).stores({
      workouts: 'id, completedAt',
      progression: 'id',
      streak: 'id',
      achievements: 'id, unlockedAt'
    });
  }
}

export const db = new HeroPathDatabase();
