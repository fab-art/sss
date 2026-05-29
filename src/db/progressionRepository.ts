import { db as defaultDb, type SssDatabase } from './schema';
import type { Progression } from '../domain/types';
import {
  createRecord,
  deleteRecord,
  getAllRecords,
  getRecord,
  toDomainList,
  updateRecord,
} from './repositoryUtils';
import { failure, success, type PersistenceResult } from './errors';

export const createProgressionRepository = (database: SssDatabase = defaultDb) => ({
  create: (progression: Progression): Promise<PersistenceResult<Progression>> =>
    createRecord(database.progression, 'progression', progression),

  getById: (id: string): Promise<PersistenceResult<Progression | undefined>> =>
    getRecord(database.progression, 'progression', id),

  getAll: (): Promise<PersistenceResult<Progression[]>> =>
    getAllRecords(database.progression, 'progression'),

  update: (
    id: string,
    changes: Partial<Omit<Progression, 'id'>>,
  ): Promise<PersistenceResult<Progression | undefined>> =>
    updateRecord(database.progression, 'progression', id, changes),

  delete: (id: string): Promise<PersistenceResult<void>> =>
    deleteRecord(database.progression, 'progression', id),

  getByUserId: async (userId: string): Promise<PersistenceResult<Progression[]>> => {
    try {
      const rows = await database.progression.where('userId').equals(userId).sortBy('date');
      return success(toDomainList(rows));
    } catch (error) {
      return failure('query', 'progression', error);
    }
  },

  getByDateRange: async (
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<PersistenceResult<Progression[]>> => {
    try {
      const rows = await database.progression
        .where('[userId+date]')
        .between([userId, startDate], [userId, endDate], true, true)
        .sortBy('date');
      return success(toDomainList(rows));
    } catch (error) {
      return failure('query', 'progression', error);
    }
  },
});

export const progressionRepository = createProgressionRepository();
