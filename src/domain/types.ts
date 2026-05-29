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
