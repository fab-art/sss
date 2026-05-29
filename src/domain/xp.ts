export const XP_SOURCES = {
  workoutCompletionBase: 'workout_completion_base',
  perfectCompletionBonus: 'perfect_completion_bonus',
  streakMilestoneBonus: 'streak_milestone_bonus',
  achievementUnlockBonus: 'achievement_unlock_bonus',
} as const;

export type XpSource = (typeof XP_SOURCES)[keyof typeof XP_SOURCES];

export interface WorkoutSet {
  reps?: number;
  weight?: number;
  durationSeconds?: number;
  distanceMeters?: number;
  completed?: boolean;
}

export interface WorkoutExercise {
  id?: string;
  name?: string;
  sets?: WorkoutSet[];
  completed?: boolean;
}

export interface Workout {
  exercises?: WorkoutExercise[];
  completed?: boolean;
}

export interface StreakMilestoneXp {
  days: number;
  xp: number;
  label?: string;
}

export interface AchievementUnlockXp {
  id: string;
  name: string;
  xp: number;
}

export interface CalculateWorkoutXpOptions {
  baseWorkoutXp?: number;
  perfectBonusXp?: number;
  streakMilestones?: StreakMilestoneXp[];
  achievementUnlocks?: AchievementUnlockXp[];
}

export interface XpBreakdownItem {
  source: XpSource;
  label: string;
  xp: number;
  meta?: Record<string, string | number | boolean>;
}

export interface XpBreakdown {
  total: number;
  base: XpBreakdownItem;
  bonuses: XpBreakdownItem[];
  items: XpBreakdownItem[];
  completionRatio: number;
  isPerfectCompletion: boolean;
}

const DEFAULT_BASE_WORKOUT_XP = 100;
const DEFAULT_PERFECT_BONUS_XP = 25;
const EPSILON = 0.000_001;
const SET_METRICS = ['reps', 'weight', 'durationSeconds', 'distanceMeters'] as const;

type SetMetric = (typeof SET_METRICS)[number];

export function calculateWorkoutXp(
  workout: Workout,
  targetWorkout: Workout,
  options: CalculateWorkoutXpOptions = {},
): XpBreakdown {
  const completionRatio = calculateCompletionRatio(workout, targetWorkout);
  const isPerfectCompletion = completionRatio >= 1 - EPSILON;
  const baseXp = Math.round((options.baseWorkoutXp ?? DEFAULT_BASE_WORKOUT_XP) * completionRatio);

  const base: XpBreakdownItem = {
    source: XP_SOURCES.workoutCompletionBase,
    label: 'Workout completion',
    xp: baseXp,
    meta: { completionRatio },
  };

  const bonuses: XpBreakdownItem[] = [];

  if (isPerfectCompletion) {
    bonuses.push({
      source: XP_SOURCES.perfectCompletionBonus,
      label: 'Perfect completion',
      xp: Math.round(options.perfectBonusXp ?? DEFAULT_PERFECT_BONUS_XP),
      meta: { hitAllTargets: true },
    });
  }

  for (const milestone of options.streakMilestones ?? []) {
    bonuses.push({
      source: XP_SOURCES.streakMilestoneBonus,
      label: milestone.label ?? `${milestone.days}-day streak`,
      xp: Math.round(milestone.xp),
      meta: { days: milestone.days },
    });
  }

  for (const achievement of options.achievementUnlocks ?? []) {
    bonuses.push({
      source: XP_SOURCES.achievementUnlockBonus,
      label: achievement.name,
      xp: Math.round(achievement.xp),
      meta: { achievementId: achievement.id },
    });
  }

  const items = [base, ...bonuses];

  return {
    total: items.reduce((sum, item) => sum + item.xp, 0),
    base,
    bonuses,
    items,
    completionRatio,
    isPerfectCompletion,
  };
}

export function calculateCompletionRatio(workout: Workout, targetWorkout: Workout): number {
  const targetExercises = targetWorkout.exercises ?? [];

  if (targetExercises.length === 0) {
    return workout.completed ? 1 : 0;
  }

  const actualExercises = workout.exercises ?? [];
  const exerciseScores = targetExercises.map((targetExercise, index) => {
    const actualExercise = findMatchingExercise(actualExercises, targetExercise, index);
    return scoreExercise(actualExercise, targetExercise);
  });

  return clamp01(average(exerciseScores));
}

function findMatchingExercise(
  actualExercises: WorkoutExercise[],
  targetExercise: WorkoutExercise,
  targetIndex: number,
): WorkoutExercise | undefined {
  if (targetExercise.id) {
    const byId = actualExercises.find((exercise) => exercise.id === targetExercise.id);
    if (byId) return byId;
  }

  if (targetExercise.name) {
    const byName = actualExercises.find((exercise) => exercise.name === targetExercise.name);
    if (byName) return byName;
  }

  return actualExercises[targetIndex];
}

function scoreExercise(actualExercise: WorkoutExercise | undefined, targetExercise: WorkoutExercise): number {
  if (!actualExercise) return 0;

  const targetSets = targetExercise.sets ?? [];
  if (targetSets.length === 0) {
    return actualExercise.completed ? 1 : 0;
  }

  const actualSets = actualExercise.sets ?? [];
  const setScores = targetSets.map((targetSet, index) => scoreSet(actualSets[index], targetSet));

  return clamp01(average(setScores));
}

function scoreSet(actualSet: WorkoutSet | undefined, targetSet: WorkoutSet): number {
  if (!actualSet) return 0;

  const metricScores = SET_METRICS.flatMap((metric) => {
    const targetValue = targetSet[metric];
    if (targetValue === undefined) return [];
    return [scoreMetric(actualSet[metric], targetValue, metric)];
  });

  if (metricScores.length === 0) {
    return actualSet.completed ? 1 : 0;
  }

  return clamp01(average(metricScores));
}

function scoreMetric(actualValue: number | undefined, targetValue: number, metric: SetMetric): number {
  // Bodyweight workouts often omit weight from completed sets. Treat an omitted zero-weight target as hit,
  // but still require explicit values for positive targets.
  if (metric === 'weight' && targetValue === 0) return 1;
  if (targetValue <= 0) return actualValue !== undefined && actualValue >= targetValue ? 1 : 0;
  if (actualValue === undefined) return 0;

  return clamp01(actualValue / targetValue);
}

/**
 * Total XP required to reach a level.
 *
 * Curve: floor(75 * (level - 1)^1.7 + 25 * (level - 1)). Level 1 starts at 0 XP.
 * The linear term keeps levels 2-4 close together for frequent early micro-rewards, while the
 * exponent below 2 creates a smooth deterministic escalation that slows later leveling without
 * producing abrupt jumps between adjacent levels.
 */
export function xpForLevel(level: number): number {
  if (!Number.isInteger(level) || level < 1) {
    throw new RangeError('level must be a positive integer');
  }

  const completedLevels = level - 1;
  return Math.floor(75 * completedLevels ** 1.7 + 25 * completedLevels);
}

export function levelFromTotalXp(totalXp: number): number {
  if (!Number.isFinite(totalXp) || totalXp < 0) {
    throw new RangeError('totalXp must be a non-negative finite number');
  }

  let low = 1;
  let high = 2;

  while (xpForLevel(high) <= totalXp) {
    high *= 2;
  }

  while (low + 1 < high) {
    const mid = Math.floor((low + high) / 2);
    if (xpForLevel(mid) <= totalXp) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return low;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clamp01(value: number): number {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}
