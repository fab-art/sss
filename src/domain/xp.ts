import type { WorkoutInput } from './types';

const BASE_COMPLETION_XP = 25;
const MINUTE_XP = 3;
const EXERCISE_XP = 8;
const INTENSITY_MULTIPLIER = 0.15;
const LEVEL_XP_SPAN = 250;

export function calculateWorkoutXp(workout: WorkoutInput): number {
  const durationXp = Math.max(0, workout.durationMinutes) * MINUTE_XP;
  const exerciseXp = Math.max(0, workout.completedExercises) * EXERCISE_XP;
  const intensityBonus = 1 + workout.intensity * INTENSITY_MULTIPLIER;

  return Math.round((BASE_COMPLETION_XP + durationXp + exerciseXp) * intensityBonus);
}

export function getLevelForXp(totalXp: number): number {
  return Math.floor(Math.max(0, totalXp) / LEVEL_XP_SPAN) + 1;
}

export function getXpIntoLevel(totalXp: number): number {
  return Math.max(0, totalXp) % LEVEL_XP_SPAN;
}

export function getXpRequiredForNextLevel(): number {
  return LEVEL_XP_SPAN;
}
