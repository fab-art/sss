import type { ISODateString, StreakState } from './types';

const DAY_MS = 24 * 60 * 60 * 1000;

export function toDateKey(value: ISODateString | Date): ISODateString {
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().slice(0, 10);
}

function daysBetween(previous: ISODateString, next: ISODateString): number {
  const previousMs = Date.parse(`${toDateKey(previous)}T00:00:00.000Z`);
  const nextMs = Date.parse(`${toDateKey(next)}T00:00:00.000Z`);
  return Math.round((nextMs - previousMs) / DAY_MS);
}

export function applyWorkoutToStreak(state: StreakState, completedAt: ISODateString): StreakState {
  const workoutDate = toDateKey(completedAt);

  if (!state.lastWorkoutDate) {
    return { current: 1, longest: Math.max(1, state.longest), lastWorkoutDate: workoutDate };
  }

  const gap = daysBetween(state.lastWorkoutDate, workoutDate);

  if (gap === 0) {
    return state;
  }

  const current = gap === 1 ? state.current + 1 : 1;

  return {
    current,
    longest: Math.max(state.longest, current),
    lastWorkoutDate: workoutDate
  };
}
