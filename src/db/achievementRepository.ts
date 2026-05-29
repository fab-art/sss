import { db as defaultDb, type SssDatabase } from './schema';
import type { Achievement } from '../domain/types';
import {
  createRecord,
  deleteRecord,
  getAllRecords,
  getRecord,
  toDomainList,
  updateRecord,
} from './repositoryUtils';
import { failure, success, type PersistenceResult } from './errors';

export const createAchievementRepository = (database: SssDatabase = defaultDb) => ({
  create: (achievement: Achievement): Promise<PersistenceResult<Achievement>> =>
    createRecord(database.achievements, 'achievements', achievement),

  getById: (id: string): Promise<PersistenceResult<Achievement | undefined>> =>
    getRecord(database.achievements, 'achievements', id),

  getAll: (): Promise<PersistenceResult<Achievement[]>> =>
    getAllRecords(database.achievements, 'achievements'),

  update: (
    id: string,
    changes: Partial<Omit<Achievement, 'id'>>,
  ): Promise<PersistenceResult<Achievement | undefined>> =>
    updateRecord(database.achievements, 'achievements', id, changes),

  delete: (id: string): Promise<PersistenceResult<void>> =>
    deleteRecord(database.achievements, 'achievements', id),

  getByUserId: async (userId: string): Promise<PersistenceResult<Achievement[]>> => {
    try {
      return success(toDomainList(await database.achievements.where('userId').equals(userId).toArray()));
    } catch (error) {
      return failure('query', 'achievements', error);
    }
  },

  getUnlockedByUserId: async (userId: string): Promise<PersistenceResult<Achievement[]>> => {
    try {
      const achievements = await database.achievements
        .where('userId')
        .equals(userId)
        .filter((achievement) => achievement.unlockedAt !== undefined)
        .toArray();
      return success(toDomainList(achievements));
    } catch (error) {
      return failure('query', 'achievements', error);
    }
  },
});

export const achievementRepository = createAchievementRepository();
