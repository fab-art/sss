import { getRankForXp } from './ranks';
import { getLevelForXp } from './xp';
import type { ProgressionState, WorkoutInput, DailyQuest, RunningProgress } from './types';

export const initialProgression: ProgressionState = {
  totalXp: 0,
  level: 1,
  rankId: 'initiate',
  workoutsCompleted: 0,
  muscleGrowth: {
    chest: 0,
    core: 0,
    legs: 0,
    shoulders: 0,
    back: 0,
    cardio: 0
  }
};

export const initialRunningProgress: RunningProgress = {
  userId: 'default',
  phase: 1,
  stepGoal: 5000,
  daysInPhase: 0,
  readyForNextPhase: false,
  lastUpdated: new Date().toISOString()
};

export function applyXp(state: ProgressionState, xpAwarded: number): ProgressionState {
  const totalXp = Math.max(0, state.totalXp + xpAwarded);
  const rank = getRankForXp(totalXp);

  return {
    ...state,
    totalXp,
    level: getLevelForXp(totalXp),
    rankId: rank.id
  };
}

/**
 * Checks if all exercises in a quest are completed.
 */
export function checkQuestCompletion(quest: DailyQuest): boolean {
  return quest.exercises.every((ex) => ex.state === 'completed');
}

/**
 * Applies rewards (XP and Muscle Growth) from a completed quest.
 */
export function applyQuestRewards(state: ProgressionState, quest: DailyQuest): ProgressionState {
  if (!quest.isCompleted) return state;

  const stateWithXp = applyXp(state, quest.xpReward);
  const nextState = {
    ...stateWithXp,
    workoutsCompleted: stateWithXp.workoutsCompleted + 1
  };

  const muscleGrowth = { ...nextState.muscleGrowth };

  quest.exercises.forEach((ex) => {
    ex.muscleGroups.forEach((mg) => {
      muscleGrowth[mg.name] = Math.min(100, (muscleGrowth[mg.name] || 0) + mg.growthPercentage);
    });
  });

  return {
    ...nextState,
    muscleGrowth
  };
}

/**
 * Logic for the 3-Phase Walking Evolution.
 */
export function evaluateRunningPhaseProgression(
  current: RunningProgress,
  completedTargetToday: boolean
): RunningProgress {
  const daysInPhase = completedTargetToday ? current.daysInPhase + 1 : 0;
  let phase = current.phase;
  let readyForNextPhase = false;
  let stepGoal = current.stepGoal;
  let lightRunMeters = current.lightRunMeters;
  let walkingKm = current.walkingKm;

  // Phase transition rules
  if (daysInPhase >= 7) {
    if (phase === 1) {
      phase = 2;
      stepGoal = 10000;
      lightRunMeters = 500;
      readyForNextPhase = true;
    } else if (phase === 2) {
      phase = 3;
      walkingKm = 1.0;
      readyForNextPhase = true;
    }
  }

  // Phase 3 auto-progression: +0.25km every 14 days of consistency
  if (phase === 3 && daysInPhase > 0 && daysInPhase % 14 === 0) {
    walkingKm = (walkingKm || 1.0) + 0.25;
    if (walkingKm > 5.0) walkingKm = 5.0; // Cap at 5km
  }

  return {
    ...current,
    phase,
    daysInPhase,
    readyForNextPhase,
    stepGoal,
    lightRunMeters,
    walkingKm,
    lastUpdated: new Date().toISOString()
  };
}

// Legacy support for simple workout logging if needed
export function completeWorkoutProgression(
  state: ProgressionState,
  xpAwarded: number,
  workout?: WorkoutInput
): ProgressionState {
  const nextState = {
    ...applyXp(state, xpAwarded),
    workoutsCompleted: state.workoutsCompleted + 1
  };

  if (!workout) return nextState;

  const muscleGrowth = { ...state.muscleGrowth };
  const intensityFactor = 1 + (workout.intensity - 3) * 0.1;

  if (workout.exercisesCompleted > 0) {
    const growthPerExercise = (workout.exercisesCompleted / 4) * intensityFactor;

    muscleGrowth.chest = Math.min(100, muscleGrowth.chest + growthPerExercise * 3.0);
    muscleGrowth.core = Math.min(100, muscleGrowth.core + growthPerExercise * 3.5);
    muscleGrowth.legs = Math.min(100, muscleGrowth.legs + growthPerExercise * 3.0);
    muscleGrowth.shoulders = Math.min(100, muscleGrowth.shoulders + growthPerExercise * 1.5);
    muscleGrowth.cardio = Math.min(100, muscleGrowth.cardio + growthPerExercise * 4.0);
  }

  return {
    ...nextState,
    muscleGrowth
  };
}

// Keep the advanced progression engine for potential use in Phase 3 adaptive difficulty
export type PerformanceEntry = Readonly<{
  date: string;
  completionRate: number;
  completed: boolean;
}>;

export type DifficultyTarget = Readonly<{
  reps: number;
  distanceMeters: number;
}>;

export type ProgressionInput = Readonly<{
  today: string;
  completionRate: number;
  currentStreak: number;
  missedWorkoutCount: number;
  recentPerformanceHistory: readonly PerformanceEntry[];
  currentDifficulty: DifficultyTarget;
  currentRankTarget: DifficultyTarget;
  nextRankTarget: DifficultyTarget;
  currentRankStartedAt: string;
}>;

export type RecoveryAction = 'progress' | 'hold' | 'deload';

export type RecoveryRecommendation = Readonly<{
  action: RecoveryAction;
  reason: string;
}>;

export type ProgressionResult = Readonly<{
  consistencyScore: number;
  fatigueScore: number;
  nextWorkoutDifficulty: DifficultyTarget;
  recoveryRecommendation: RecoveryRecommendation;
  advancesRank: boolean;
}>;

export const HIGH_FATIGUE_THRESHOLD = 0.65;
export const LOW_CONSISTENCY_THRESHOLD = 0.6;
export const ADVANCEMENT_CONSISTENCY_THRESHOLD = 0.85;
export const MIN_ADVANCEMENT_STREAK_DAYS = 21;
export const MIN_ADVANCEMENT_DAYS_AT_RANK = 14;
export const PROGRESSION_SNAP_THRESHOLD = 0.5;

const clamp = (value: number, min = 0, max = 1): number => Math.min(max, Math.max(min, value));

const average = (values: readonly number[], fallback: number): number => {
  if (values.length === 0) {
    return fallback;
  }
  return values.reduce((total, value) => total + value, 0) / values.length;
};

const dayKey = (value: string): string => value.slice(0, 10);

const daysBetween = (start: string, end: string): number => {
  const startMs = Date.parse(`${dayKey(start)}T00:00:00.000Z`);
  const endMs = Date.parse(`${dayKey(end)}T00:00:00.000Z`);
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) return 0;
  return Math.max(0, Math.round((endMs - startMs) / 86_400_000));
};

export function calculateConsistencyScore(input: ProgressionInput): number {
  const directCompletion = clamp(input.completionRate);
  const historyCompletion = average(
    input.recentPerformanceHistory.map((entry) => clamp(entry.completionRate)),
    directCompletion
  );
  const completedRatio = average(
    input.recentPerformanceHistory.map((entry) => (entry.completed ? 1 : 0)),
    directCompletion
  );
  const streakContribution = clamp(input.currentStreak / MIN_ADVANCEMENT_STREAK_DAYS);
  const missPenalty = clamp(Math.max(0, input.missedWorkoutCount) / 6);

  return clamp(
    directCompletion * 0.3 +
      historyCompletion * 0.3 +
      completedRatio * 0.25 +
      streakContribution * 0.15 -
      missPenalty * 0.25
  );
}

export function calculateFatigueScore(input: ProgressionInput): number {
  const missedPressure = clamp(Math.max(0, input.missedWorkoutCount) / 5);
  const recentUnderCompletion =
    1 -
    average(
      input.recentPerformanceHistory.map((entry) => clamp(entry.completionRate)),
      clamp(input.completionRate)
    );
  const currentUnderCompletion = 1 - clamp(input.completionRate);
  const streakProtection = clamp(input.currentStreak / 14) * 0.15;

  return clamp(
    missedPressure * 0.45 +
      recentUnderCompletion * 0.35 +
      currentUnderCompletion * 0.35 -
      streakProtection
  );
}

const scaleToward = (current: number, target: number, fraction: number): number => {
  const boundedCurrent = Math.min(current, target);
  const scaled = boundedCurrent + (target - boundedCurrent) * fraction;
  const gap = target - scaled;
  return gap > 0 && gap <= PROGRESSION_SNAP_THRESHOLD ? target : scaled;
};

const deload = (input: ProgressionInput): DifficultyTarget => ({
  reps: Math.min(
    input.currentDifficulty.reps,
    Math.max(input.currentRankTarget.reps, Math.floor(input.currentDifficulty.reps * 0.85))
  ),
  distanceMeters: Math.min(
    input.currentDifficulty.distanceMeters,
    Math.max(
      input.currentRankTarget.distanceMeters,
      Math.floor(input.currentDifficulty.distanceMeters * 0.85)
    )
  )
});

const hold = (input: ProgressionInput): DifficultyTarget => ({
  reps: Math.min(input.currentDifficulty.reps, input.nextRankTarget.reps),
  distanceMeters: Math.min(
    input.currentDifficulty.distanceMeters,
    input.nextRankTarget.distanceMeters
  )
});

const progress = (input: ProgressionInput, consistencyScore: number): DifficultyTarget => {
  const fraction = 0.08 + consistencyScore * 0.12;
  return {
    reps: scaleToward(input.currentDifficulty.reps, input.nextRankTarget.reps, fraction),
    distanceMeters: scaleToward(
      input.currentDifficulty.distanceMeters,
      input.nextRankTarget.distanceMeters,
      fraction
    )
  };
};

const hasReachedTarget = (difficulty: DifficultyTarget, target: DifficultyTarget): boolean =>
  difficulty.reps >= target.reps && difficulty.distanceMeters >= target.distanceMeters;

export function buildProgression(input: ProgressionInput): ProgressionResult {
  const consistencyScore = calculateConsistencyScore(input);
  const fatigueScore = calculateFatigueScore(input);

  if (fatigueScore >= HIGH_FATIGUE_THRESHOLD) {
    return {
      consistencyScore,
      fatigueScore,
      nextWorkoutDifficulty: deload(input),
      recoveryRecommendation: {
        action: 'deload',
        reason: 'High fatigue blocks escalation; deload to protect consistency.'
      },
      advancesRank: false
    };
  }

  if (consistencyScore <= LOW_CONSISTENCY_THRESHOLD) {
    return {
      consistencyScore,
      fatigueScore,
      nextWorkoutDifficulty: hold(input),
      recoveryRecommendation: {
        action: 'hold',
        reason: 'Consistency is still building, so hold difficulty before increasing intensity.'
      },
      advancesRank: false
    };
  }

  const nextWorkoutDifficulty = progress(input, consistencyScore);
  const daysAtRank = daysBetween(input.currentRankStartedAt, input.today);
  const advancesRank =
    consistencyScore >= ADVANCEMENT_CONSISTENCY_THRESHOLD &&
    input.currentStreak >= MIN_ADVANCEMENT_STREAK_DAYS &&
    daysAtRank >= MIN_ADVANCEMENT_DAYS_AT_RANK &&
    hasReachedTarget(input.currentDifficulty, input.nextRankTarget);

  return {
    consistencyScore,
    fatigueScore,
    nextWorkoutDifficulty,
    recoveryRecommendation: {
      action: 'progress',
      reason: 'Consistent completion and manageable fatigue allow a small bounded increase.'
    },
    advancesRank
  };
}
