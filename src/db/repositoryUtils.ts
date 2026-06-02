import type { Table, UpdateSpec } from 'dexie';
import { failure, success, type PersistenceResult } from './errors';

export type RepositoryTableName = 'users' | 'workouts' | 'achievements' | 'progression';

export const toDomain = <T>(row: T | undefined): T | undefined => {
  if (row === undefined) {
    return undefined;
  }

  return structuredClone(row);
};

export const toDomainList = <T>(rows: T[]): T[] => rows.map((row) => structuredClone(row));

export const createRecord = async <T extends { id: string }>(
  table: Table<T, string>,
  tableName: RepositoryTableName,
  record: T
): Promise<PersistenceResult<T>> => {
  try {
    await table.add(structuredClone(record));
    return success(toDomain(record) as T);
  } catch (error) {
    return failure('create', tableName, error);
  }
};

export const getRecord = async <T extends { id: string }>(
  table: Table<T, string>,
  tableName: RepositoryTableName,
  id: string
): Promise<PersistenceResult<T | undefined>> => {
  try {
    return success(toDomain(await table.get(id)));
  } catch (error) {
    return failure('read', tableName, error);
  }
};

export const getAllRecords = async <T extends { id: string }>(
  table: Table<T, string>,
  tableName: RepositoryTableName
): Promise<PersistenceResult<T[]>> => {
  try {
    return success(toDomainList(await table.toArray()));
  } catch (error) {
    return failure('read', tableName, error);
  }
};

export const updateRecord = async <T extends { id: string }>(
  table: Table<T, string>,
  tableName: RepositoryTableName,
  id: string,
  changes: Partial<Omit<T, 'id'>>
): Promise<PersistenceResult<T | undefined>> => {
  try {
    await table.update(id, structuredClone(changes) as unknown as UpdateSpec<T>);
    return success(toDomain(await table.get(id)));
  } catch (error) {
    return failure('update', tableName, error);
  }
};

export const deleteRecord = async <T extends { id: string }>(
  table: Table<T, string>,
  tableName: RepositoryTableName,
  id: string
): Promise<PersistenceResult<void>> => {
  try {
    await table.delete(id);
    return success(undefined);
  } catch (error) {
    return failure('delete', tableName, error);
  }
};
