import { db as defaultDb, type SssDatabase } from './schema';
import type { User } from '../domain/types';
import {
  createRecord,
  deleteRecord,
  getAllRecords,
  getRecord,
  updateRecord,
} from './repositoryUtils';
import { failure, success, type PersistenceResult } from './errors';

export const createUserRepository = (database: SssDatabase = defaultDb) => ({
  create: (user: User): Promise<PersistenceResult<User>> =>
    createRecord(database.users, 'users', user),

  getById: (id: string): Promise<PersistenceResult<User | undefined>> =>
    getRecord(database.users, 'users', id),

  getAll: (): Promise<PersistenceResult<User[]>> => getAllRecords(database.users, 'users'),

  update: (id: string, changes: Partial<Omit<User, 'id'>>): Promise<PersistenceResult<User | undefined>> =>
    updateRecord(database.users, 'users', id, changes),

  delete: (id: string): Promise<PersistenceResult<void>> => deleteRecord(database.users, 'users', id),

  getByUsername: async (username: string): Promise<PersistenceResult<User | undefined>> => {
    try {
      const user = await database.users.where('username').equals(username).first();
      return success(user ? structuredClone(user) : undefined);
    } catch (error) {
      return failure('query', 'users', error);
    }
  },
});

export const userRepository = createUserRepository();
