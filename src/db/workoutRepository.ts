import { db as defaultDb, type SssDatabase } from './schema';
import type { Workout } from '../domain/types';
import {
  createRecord,
  deleteRecord,
  getAllRecords,
  getRecord,
  toDomainList,
  updateRecord,
} from './repositoryUtils';
import { failure, success, type PersistenceResult } from './errors';

export const createWorkoutRepository = (database: SssDatabase = defaultDb) => ({
  create: (workout: Workout): Promise<PersistenceResult<Workout>> =>
    createRecord(database.workouts, 'workouts', workout),

  getById: (id: string): Promise<PersistenceResult<Workout | undefined>> =>
    getRecord(database.workouts, 'workouts', id),

  getAll: (): Promise<PersistenceResult<Workout[]>> => getAllRecords(database.workouts, 'workouts'),

  update: (
    id: string,
    changes: Partial<Omit<Workout, 'id'>>,
  ): Promise<PersistenceResult<Workout | undefined>> =>
    updateRecord(database.workouts, 'workouts', id, changes),

  delete: (id: string): Promise<PersistenceResult<void>> => deleteRecord(database.workouts, 'workouts', id),

  getWorkoutsByDateRange: async (
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<PersistenceResult<Workout[]>> => {
    try {
      const rows = await database.workouts
        .where('[userId+date]')
        .between([userId, startDate], [userId, endDate], true, true)
        .sortBy('date');

      return success(toDomainList(rows));
    } catch (error) {
      return failure('query', 'workouts', error);
    }
  },

  getTotalPushups: async (userId: string): Promise<PersistenceResult<number>> => {
    try {
      const workouts = await database.workouts.where('userId').equals(userId).toArray();
      return success(workouts.reduce((total, workout) => total + workout.pushups, 0));
    } catch (error) {
      return failure('query', 'workouts', error);
    }
  },
});

export const workoutRepository = createWorkoutRepository();
