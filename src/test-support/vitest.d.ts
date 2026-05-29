declare module "vitest" {
  export function describe(name: string, fn: () => void): void;
  export function it(name: string, fn: () => void | Promise<void>): void;

  interface Matchers<T> {
    toBe(expected: T): void;
    toBeGreaterThan(expected: number): void;
    toBeGreaterThanOrEqual(expected: number): void;
    toBeLessThan(expected: number): void;
    toBeLessThanOrEqual(expected: number): void;
    toContain(expected: string): void;
    readonly not: Matchers<T>;
  }

  export function expect<T>(actual: T): Matchers<T>;
}
