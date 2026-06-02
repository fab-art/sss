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

export type ProgressionState = {
  totalXp: number;
  level: number;
  rankId: string;
  workoutsCompleted: number;
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
  createdAt: ISODateString;
  updatedAt: ISODateString;
};
