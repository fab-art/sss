export type PersistenceOperation =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'query'
  | 'preferences';

export interface PersistenceError {
  type: 'PersistenceError';
  operation: PersistenceOperation;
  table?: string;
  message: string;
  cause?: unknown;
}

export type PersistenceResult<T> = { ok: true; data: T } | { ok: false; error: PersistenceError };

export const success = <T>(data: T): PersistenceResult<T> => ({ ok: true, data });

export const failure = (
  operation: PersistenceOperation,
  table: string | undefined,
  error: unknown
): PersistenceResult<never> => ({
  ok: false,
  error: {
    type: 'PersistenceError',
    operation,
    table,
    message: error instanceof Error ? error.message : 'Unknown persistence error',
    cause: error
  }
});
