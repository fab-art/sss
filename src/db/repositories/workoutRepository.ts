import { db } from '../database';
import type { WorkoutRecord } from '../../domain/types';

export async function listWorkouts(): Promise<WorkoutRecord[]> {
  return db.workouts.orderBy('completedAt').reverse().toArray();
}

export async function saveWorkout(workout: WorkoutRecord): Promise<void> {
  await db.workouts.put(workout);
}
