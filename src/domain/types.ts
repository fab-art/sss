export type ISODateString = string;

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
export type NutritionGoal = 'weightLoss' | 'muscleGain' | 'maintenance';

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
  quests: DailyQuest[];
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

// --- NEW V2 TYPES ---

export type ExerciseType =
  | 'push-ups'
  | 'sit-ups'
  | 'squats'
  | 'light-run'
  | 'walking'
  | 'footsteps';

export interface MuscleGroupImpact {
  name: keyof MuscleGrowth;
  intensity: 'primary' | 'secondary' | 'support';
  growthPercentage: number;
}

export interface ExerciseInstance {
  id: string;
  questId: string;
  exerciseType: ExerciseType;
  targetReps?: number;
  targetDistance?: number; // meters
  targetDuration?: number; // minutes
  repsLogged?: number;
  distanceLogged?: number; // meters
  durationLogged?: number; // minutes
  completedAt?: string;
  muscleGroups: MuscleGroupImpact[];
  xpContribution: number;
  state: 'locked' | 'in-progress' | 'completed';
}

export interface DailyQuest {
  id: string;
  date: string; // YYYY-MM-DD
  userId: string;
  rank: number;
  questName: string;
  exercises: ExerciseInstance[];
  completedAt?: string;
  xpReward: number;
  isCompleted: boolean;
}

export interface RunningProgress {
  userId: string;
  phase: 1 | 2 | 3; // 1: Footsteps, 2: Light Runs, 3: Walking
  stepGoal?: number;
  lightRunMeters?: number;
  walkingKm?: number;
  daysInPhase: number;
  readyForNextPhase: boolean;
  lastUpdated: string;
}

export type FoodCategory = 'staple' | 'protein' | 'vegetable' | 'fruit' | 'drink';

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  calories: number;
  portion: string;
  isRwandanFood: boolean;
}

export interface MealEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  timestamp: string; // HH:mm:ss
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: FoodItem[];
  totalCalories: number;
  withinFastingWindow: boolean;
}

export interface RwandanFoodPreset {
  id: string;
  name: string;
  category: FoodCategory;
  calories: number;
  portion: string;
  localLanguage?: string;
  createdAt: string;
}

export type FastingProtocolType = 'none' | '16:8' | '14:10' | '18:6' | 'custom';

export interface FastingProtocol {
  userId: string;
  protocolType: FastingProtocolType;
  customFastingHours?: number;
  eatingWindowStart: string; // HH:mm
  eatingWindowEnd: string; // HH:mm
  createdAt: string;
  lastModified: string;
}

export interface DailyNutritionSummary {
  date: string;
  userId: string;
  mealEntries: MealEntry[];
  totalCaloriesConsumed: number;
  dailyGoal: number;
  workoutCaloriesBurned: number;
  totalAllowance: number;
  remainingCalories: number;
  deficit: number;
  fastingWindow: {
    startTime: string;
    endTime: string;
    adherence: boolean;
  };
}

// Keep legacy for compatibility if needed, but we'll migrate
export type FastingSession = {
  id: string;
  date: string;
  protocolType: string;
  fastingStartTime: string;
  eatingWindowStart: string;
  eatingWindowEnd: string;
  totalFastingHours: number;
  completedSuccessfully: boolean;
};

export type Meal = {
  id: string;
  date: string;
  timestamp: string;
  foodName: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foodCategory: string;
};

export type NutritionProfile = {
  userId: string;
  weight: number;
  goal: string;
  deficit: number;
  activityLevel: string;
  preferredIfProtocol: FastingProtocolType;
  eatingWindowStart: string;
  eatingWindowEnd: string;
};
