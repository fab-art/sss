import Dexie, { type Table } from 'dexie';
import type {
  ProgressionState,
  StreakState,
  UserAchievement,
  WorkoutRecord,
  DailyQuest,
  RunningProgress,
  RwandanFoodPreset,
  MealEntry,
  FastingProtocol
} from '../domain/types';

export type SingletonRecord<T> = {
  id: 'current';
  value: T;
};

export class HeroPathDatabase extends Dexie {
  workouts!: Table<WorkoutRecord, string>;
  progression!: Table<SingletonRecord<ProgressionState>, 'current'>;
  streak!: Table<SingletonRecord<StreakState>, 'current'>;
  achievements!: Table<UserAchievement, string>;

  // V2 Tables
  dailyQuests!: Table<DailyQuest, string>;
  runningProgress!: Table<RunningProgress, string>;
  rwandanFoodPresets!: Table<RwandanFoodPreset, string>;
  mealEntries!: Table<MealEntry, string>;
  fastingProtocols!: Table<FastingProtocol, string>;

  constructor() {
    super('heropath');

    this.version(1).stores({
      workouts: 'id, completedAt',
      progression: 'id',
      streak: 'id',
      achievements: 'id, unlockedAt'
    });

    this.version(2).stores({
      meals: 'id, date',
      fastingSessions: 'date',
      nutritionProfile: 'userId',
      foodPresets: 'id, name'
    });

    this.version(3).stores({
      dailyQuests: 'id, date, userId',
      runningProgress: 'userId',
      rwandanFoodPresets: 'id, name, category',
      mealEntries: 'id, date, userId',
      fastingProtocols: 'userId'
    });
  }
}

export const db = new HeroPathDatabase();
