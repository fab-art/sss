export type ISODateString = string;

export type Rank = {
  id: string;
  title: string;
  minXp: number;
  emblem: string;
};

export type WorkoutInput = {
  completedAt: ISODateString;
  durationMinutes: number;
  intensity: 1 | 2 | 3 | 4 | 5;
  exercisesCompleted: number;
};

export type WorkoutRecord = WorkoutInput & {
  id: string;
  xpAwarded: number;
};

export type MuscleGrowth = {
  chest: number;
  core: number;
  legs: number;
  shoulders: number;
  back: number;
  cardio: number;
};

export type ProgressionState = {
  totalXp: number;
  level: number;
  rankId: string;
  workoutsCompleted: number;
  muscleGrowth: MuscleGrowth;
};

export type StreakState = {
  current: number;
  longest: number;
  lastWorkoutDate?: ISODateString;
};

export type AchievementDefinition = {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  isUnlocked: (snapshot: AchievementSnapshot) => boolean;
};

export type AchievementSnapshot = {
  progression: ProgressionState;
  streak: StreakState;
  workouts: WorkoutRecord[];
};

export type UserAchievement = {
  id: string;
  unlockedAt: ISODateString;
  xpReward: number;
};

export type User = {
  id: string;
  username: string;
  displayName: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type FastingProtocolType = 'custom' | '16:8' | '14:10' | '18:6' | '20:4';

export interface FastingSession {
  id: string;
  date: string; // YYYY-MM-DD
  protocolType: FastingProtocolType;
  fastingStartTime: string; // HH:mm
  eatingWindowStart: string; // HH:mm
  eatingWindowEnd: string; // HH:mm
  totalFastingHours: number;
  completedSuccessfully: boolean;
  notes?: string;
}

export type FoodCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'drink';

export interface Meal {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: string; // HH:mm:ss
  foodName: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  foodCategory: FoodCategory;
  source: 'preset' | 'barcode' | 'manual';
  mealNutritionId?: string;
}

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
export type NutritionGoal = 'weightLoss' | 'muscleGain' | 'maintenance';

export interface NutritionProfile {
  userId: string;
  age: number;
  weight: number; // lbs
  height: number; // inches
  activityLevel: ActivityLevel;
  goal: NutritionGoal;
  deficit: 300 | 500 | 750;
  preferredIfProtocol: FastingProtocolType;
  customFastingHours?: number;
  eatingWindowStart?: string; // HH:mm
  eatingWindowEnd?: string; // HH:mm
  macroRatio: { protein: number; carbs: number; fat: number };
  trackWeightOptional: boolean;
  lastUpdated: string;
}

export interface DailyNutritionSummary {
  date: string;
  userId: string;
  caloriesConsumed: number;
  caloriesBurned: number;
  calorieDeficit: number;
  proteinConsumed: number;
  carbsConsumed: number;
  fatConsumed: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  mealsLogged: number;
  fastingAdherence: boolean;
  weight?: number;
  notes?: string;
}

export interface FoodPreset {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  category: FoodCategory;
  servingSize: string;
  verified: boolean;
  createdAt: string;
  createdBy: 'system' | 'user';
}

export type Workout = {
  id: string;
  userId: string;
  type: 'pushups' | 'squats' | 'situps' | 'cardio' | string;
  date: string;
  pushups: number;
  sets: number;
  reps: number;
  notes?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type Achievement = {
  id: string;
  userId: string;
  key: string;
  title: string;
  description: string;
  unlockedAt?: ISODateString;
  progress: number;
  goal: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type Progression = {
  id: string;
  userId: string;
  date: string;
  totalPushups: number;
  streakDays: number;
  level: number;
  experience: number;
  muscleGrowth: MuscleGrowth;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};
