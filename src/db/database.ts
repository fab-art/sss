import Dexie, { type Table } from 'dexie';
import type {
  ProgressionState,
  StreakState,
  UserAchievement,
  WorkoutRecord,
  FastingSession,
  Meal,
  NutritionProfile,
  FoodPreset
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

  // Nutrition & Fasting
  meals!: Table<Meal, string>;
  fastingSessions!: Table<FastingSession, string>;
  nutritionProfile!: Table<NutritionProfile, string>;
  foodPresets!: Table<FoodPreset, string>;

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
  }
}

export const db = new HeroPathDatabase();
