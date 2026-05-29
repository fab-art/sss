export type ID = string;
export type ISODateString = string;
export type ISODateTimeString = string;

export type WorkoutType = 'pushups' | 'situps' | 'squats' | 'cardio' | 'custom';

export interface User {
  id: ID;
  username: string;
  displayName?: string;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
}

export interface Workout {
  id: ID;
  userId: ID;
  type: WorkoutType;
  date: ISODateString;
  pushups: number;
  sets: number;
  reps: number;
  durationSeconds?: number;
  notes?: string;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
}

export interface Achievement {
  id: ID;
  userId: ID;
  key: string;
  title: string;
  description: string;
  unlockedAt?: ISODateTimeString;
  progress: number;
  goal: number;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
}

export interface Progression {
  id: ID;
  userId: ID;
  date: ISODateString;
  totalPushups: number;
  streakDays: number;
  level: number;
  experience: number;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
}
