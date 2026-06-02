export type WorkoutTarget = Readonly<{
  pushups: number;
  squats: number;
  situps: number;
  cardioDistanceKm: number;
}>;

export type RankNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Rank = Readonly<{
  rankNumber: RankNumber;
  name: string;
  targetWorkout: WorkoutTarget;
}>;

export type User = Readonly<{
  id: string;
  displayName: string;
  createdAt: Date;
  currentRank: RankNumber;
}>;

export type WorkoutExercise = Readonly<{
  id: string;
  workoutId: string;
  name: 'pushups' | 'squats' | 'situps' | 'cardio';
  reps?: number;
  distanceKm?: number;
}>;

export type Workout = Readonly<{
  id: string;
  userId: string;
  completedAt: Date;
  exercises: readonly WorkoutExercise[];
}>;

export type Achievement = Readonly<{
  id: string;
  userId: string;
  name: string;
  description: string;
  achievedAt: Date;
}>;

export type Progression = Readonly<{
  userId: string;
  fromRank: RankNumber | null;
  toRank: RankNumber;
  progressedAt: Date;
}>;

const createRank = (rankNumber: RankNumber, name: string, targetWorkout: WorkoutTarget): Rank =>
  Object.freeze({
    rankNumber,
    name,
    targetWorkout: Object.freeze({ ...targetWorkout })
  });

export const RANKS = Object.freeze([
  createRank(1, 'Civilian', { pushups: 5, squats: 5, situps: 5, cardioDistanceKm: 0.5 }),
  createRank(2, 'Trainee', { pushups: 10, squats: 10, situps: 10, cardioDistanceKm: 1 }),
  createRank(3, 'Fighter', { pushups: 20, squats: 20, situps: 20, cardioDistanceKm: 2 }),
  createRank(4, 'Hunter', { pushups: 35, squats: 35, situps: 35, cardioDistanceKm: 3 }),
  createRank(5, 'Elite', { pushups: 50, squats: 50, situps: 50, cardioDistanceKm: 5 }),
  createRank(6, 'Hero Candidate', { pushups: 70, squats: 70, situps: 70, cardioDistanceKm: 7 }),
  createRank(7, 'Hero', { pushups: 85, squats: 85, situps: 85, cardioDistanceKm: 8.5 }),
  createRank(8, 'Caped Baldy', { pushups: 100, squats: 100, situps: 100, cardioDistanceKm: 10 })
] as const);

export const getRankByNumber = (rankNumber: number): Rank | null =>
  RANKS.find((rank) => rank.rankNumber === rankNumber) ?? null;

export const getNextRank = (rankNumber: number): Rank | null => getRankByNumber(rankNumber + 1);

export const getRankWorkout = (rankNumber: number): WorkoutTarget | null =>
  getRankByNumber(rankNumber)?.targetWorkout ?? null;
