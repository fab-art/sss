declare module 'vitest' {
  type TestFunction = {
    (name: string, fn: () => void): void;
    each<T extends readonly unknown[]>(cases: T): (name: string, fn: (item: T[number]) => void) => void;
  };

  export const describe: (name: string, fn: () => void) => void;
  export const it: TestFunction;
  export const expect: (actual: unknown) => {
    toBe(expected: unknown): void;
    toBeNull(): void;
    toEqual(expected: unknown): void;
    toHaveLength(expected: number): void;
  };
}
