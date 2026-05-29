export type RecoveryAction = "progress" | "hold" | "deload";

export interface WorkoutDifficulty {
  reps: number;
  distanceMeters: number;
}

export interface PerformanceEntry {
  date: Date | string;
  completionRate: number;
  completed: boolean;
}

export interface ProgressionInput {
  today: Date | string;
  completionRate: number;
  currentStreak: number;
  missedWorkoutCount: number;
  recentPerformanceHistory: PerformanceEntry[];
  currentDifficulty: WorkoutDifficulty;
  currentRankTarget: WorkoutDifficulty;
  nextRankTarget: WorkoutDifficulty;
  currentRankStartedAt?: Date | string;
}

export interface RecoveryRecommendation {
  action: RecoveryAction;
  suggestedRestDays: number;
  intensityMultiplier: number;
  reason: string;
}

export interface ProgressionOutput {
  nextWorkoutDifficulty: WorkoutDifficulty;
  recoveryRecommendation: RecoveryRecommendation;
  advancesRank: boolean;
  consistencyScore: number;
  fatigueScore: number;
}

export const HIGH_FATIGUE_THRESHOLD = 0.7;
export const LOW_CONSISTENCY_THRESHOLD = 0.6;
export const SAFE_PROGRESSION_CONSISTENCY_THRESHOLD = 0.75;
export const SAFE_PROGRESSION_FATIGUE_THRESHOLD = 0.55;
export const ADVANCEMENT_CONSISTENCY_THRESHOLD = 0.85;
export const ADVANCEMENT_FATIGUE_THRESHOLD = 0.5;
export const ADVANCEMENT_MIN_STREAK_DAYS = 21;
export const ADVANCEMENT_MIN_HISTORY_ITEMS = 10;
export const ADVANCEMENT_MIN_DAYS_AT_RANK = 21;
export const ADVANCEMENT_TARGET_PROXIMITY = 0.98;

const PROGRESSION_STEP_MIN = 0.04;
const PROGRESSION_STEP_MAX = 0.16;
const DELOAD_MULTIPLIER = 0.88;
const DELOAD_FLOOR_MULTIPLIER = 0.7;

export function buildProgression(input: ProgressionInput): ProgressionOutput {
  const consistencyScore = calculateConsistencyScore(input);
  const fatigueScore = calculateFatigueScore(input);

  const action = chooseAction(consistencyScore, fatigueScore);
  const nextWorkoutDifficulty = scaleDifficulty(input, action, consistencyScore, fatigueScore);
  const advancesRank = shouldAdvanceRank(input, nextWorkoutDifficulty, consistencyScore, fatigueScore);

  return {
    nextWorkoutDifficulty,
    recoveryRecommendation: buildRecoveryRecommendation(action, consistencyScore, fatigueScore),
    advancesRank,
    consistencyScore,
    fatigueScore,
  };
}

export function calculateConsistencyScore(input: Pick<ProgressionInput, "completionRate" | "currentStreak" | "missedWorkoutCount" | "recentPerformanceHistory">): number {
  const completionScore = clamp01(input.completionRate);
  const streakScore = 1 - Math.exp(-Math.max(0, input.currentStreak) / 14);
  const missedScore = 1 - clamp01(input.missedWorkoutCount / 4);
  const historyScore = recentCompletionAverage(input.recentPerformanceHistory);

  return roundScore(
    completionScore * 0.4
    + streakScore * 0.25
    + missedScore * 0.2
    + historyScore * 0.15,
  );
}

export function calculateFatigueScore(input: Pick<ProgressionInput, "completionRate" | "missedWorkoutCount" | "recentPerformanceHistory">): number {
  const missedLoad = clamp01(input.missedWorkoutCount / 4);
  const currentStrain = 1 - clamp01(input.completionRate);
  const recentMissLoad = 1 - recentCompletionAverage(input.recentPerformanceHistory.slice(-5));
  const trendLoad = negativeTrendLoad(input.recentPerformanceHistory);

  return roundScore(
    missedLoad * 0.35
    + currentStrain * 0.25
    + recentMissLoad * 0.25
    + trendLoad * 0.15,
  );
}

function chooseAction(consistencyScore: number, fatigueScore: number): RecoveryAction {
  if (fatigueScore >= HIGH_FATIGUE_THRESHOLD) {
    return "deload";
  }

  if (consistencyScore <= LOW_CONSISTENCY_THRESHOLD) {
    return "hold";
  }

  if (consistencyScore >= SAFE_PROGRESSION_CONSISTENCY_THRESHOLD && fatigueScore < SAFE_PROGRESSION_FATIGUE_THRESHOLD) {
    return "progress";
  }

  return "hold";
}

function scaleDifficulty(input: ProgressionInput, action: RecoveryAction, consistencyScore: number, fatigueScore: number): WorkoutDifficulty {
  if (action === "deload") {
    return {
      reps: deloadDimension(input.currentDifficulty.reps, input.currentRankTarget.reps),
      distanceMeters: deloadDimension(input.currentDifficulty.distanceMeters, input.currentRankTarget.distanceMeters),
    };
  }

  if (action === "hold") {
    return boundDifficulty(input.currentDifficulty, input.nextRankTarget);
  }

  const safetyMargin = clamp01((SAFE_PROGRESSION_FATIGUE_THRESHOLD - fatigueScore) / SAFE_PROGRESSION_FATIGUE_THRESHOLD);
  const consistencyMargin = clamp01((consistencyScore - SAFE_PROGRESSION_CONSISTENCY_THRESHOLD) / (1 - SAFE_PROGRESSION_CONSISTENCY_THRESHOLD));
  const step = PROGRESSION_STEP_MIN + (PROGRESSION_STEP_MAX - PROGRESSION_STEP_MIN) * ((safetyMargin + consistencyMargin) / 2);

  return {
    reps: asymptoticStep(input.currentDifficulty.reps, input.nextRankTarget.reps, step),
    distanceMeters: asymptoticStep(input.currentDifficulty.distanceMeters, input.nextRankTarget.distanceMeters, step),
  };
}

function buildRecoveryRecommendation(action: RecoveryAction, consistencyScore: number, fatigueScore: number): RecoveryRecommendation {
  if (action === "deload") {
    return {
      action,
      suggestedRestDays: fatigueScore >= 0.85 ? 2 : 1,
      intensityMultiplier: DELOAD_MULTIPLIER,
      reason: "High fatigue explicitly blocks escalation; deload to protect recovery.",
    };
  }

  if (action === "hold") {
    return {
      action,
      suggestedRestDays: fatigueScore >= SAFE_PROGRESSION_FATIGUE_THRESHOLD || consistencyScore <= LOW_CONSISTENCY_THRESHOLD ? 1 : 0,
      intensityMultiplier: 1,
      reason: "Consistency or fatigue is not yet in the safe progression range, so difficulty is held.",
    };
  }

  return {
    action,
    suggestedRestDays: 0,
    intensityMultiplier: 1,
    reason: "Consistent completion with low fatigue allows a small bounded progression step.",
  };
}

function shouldAdvanceRank(
  input: ProgressionInput,
  nextWorkoutDifficulty: WorkoutDifficulty,
  consistencyScore: number,
  fatigueScore: number,
): boolean {
  const history = input.recentPerformanceHistory;
  const sustainedHistory = history.length >= ADVANCEMENT_MIN_HISTORY_ITEMS
    && recentCompletionAverage(history.slice(-ADVANCEMENT_MIN_HISTORY_ITEMS)) >= 0.9;

  return consistencyScore >= ADVANCEMENT_CONSISTENCY_THRESHOLD
    && fatigueScore < ADVANCEMENT_FATIGUE_THRESHOLD
    && input.currentStreak >= ADVANCEMENT_MIN_STREAK_DAYS
    && input.missedWorkoutCount <= 1
    && sustainedHistory
    && daysAtRank(input.today, input.currentRankStartedAt) >= ADVANCEMENT_MIN_DAYS_AT_RANK
    && isAtTargetProximity(nextWorkoutDifficulty, input.nextRankTarget, ADVANCEMENT_TARGET_PROXIMITY);
}

function asymptoticStep(current: number, target: number, step: number): number {
  const boundedCurrent = Math.min(nonNegative(current), nonNegative(target));
  const targetValue = nonNegative(target);
  const next = boundedCurrent + (targetValue - boundedCurrent) * clamp01(step);
  const rounded = roundDifficultyDown(next);

  return boundedCurrent < targetValue
    ? Math.min(Math.max(boundedCurrent, rounded), targetValue)
    : Math.min(roundDifficulty(next), targetValue);
}

function deloadDimension(current: number, currentRankTarget: number): number {
  const floor = nonNegative(currentRankTarget) * DELOAD_FLOOR_MULTIPLIER;
  return roundDifficulty(Math.max(floor, nonNegative(current) * DELOAD_MULTIPLIER));
}

function boundDifficulty(current: WorkoutDifficulty, target: WorkoutDifficulty): WorkoutDifficulty {
  return {
    reps: Math.min(roundDifficulty(nonNegative(current.reps)), nonNegative(target.reps)),
    distanceMeters: Math.min(roundDifficulty(nonNegative(current.distanceMeters)), nonNegative(target.distanceMeters)),
  };
}

function recentCompletionAverage(history: PerformanceEntry[]): number {
  if (history.length === 0) {
    return 0.5;
  }

  const sum = history.reduce((total, entry) => total + clamp01(entry.completionRate), 0);
  return clamp01(sum / history.length);
}

function negativeTrendLoad(history: PerformanceEntry[]): number {
  if (history.length < 4) {
    return 0;
  }

  const midpoint = Math.floor(history.length / 2);
  const earlier = recentCompletionAverage(history.slice(0, midpoint));
  const later = recentCompletionAverage(history.slice(midpoint));
  return clamp01(earlier - later);
}

function isAtTargetProximity(difficulty: WorkoutDifficulty, target: WorkoutDifficulty, proximity: number): boolean {
  return dimensionProximity(difficulty.reps, target.reps) >= proximity
    && dimensionProximity(difficulty.distanceMeters, target.distanceMeters) >= proximity;
}

function dimensionProximity(value: number, target: number): number {
  if (target <= 0) {
    return 1;
  }

  return clamp01(value / target);
}

function daysAtRank(today: Date | string, currentRankStartedAt: Date | string | undefined): number {
  if (!currentRankStartedAt) {
    return 0;
  }

  const todayMs = toTime(today);
  const startMs = toTime(currentRankStartedAt);
  if (!Number.isFinite(todayMs) || !Number.isFinite(startMs) || todayMs < startMs) {
    return 0;
  }

  return Math.floor((todayMs - startMs) / 86_400_000);
}

function toTime(value: Date | string): number {
  return value instanceof Date ? value.getTime() : new Date(value).getTime();
}

function nonNegative(value: number): number {
  return Math.max(0, value);
}

function clamp01(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

function roundScore(value: number): number {
  return Math.round(clamp01(value) * 1_000) / 1_000;
}

function roundDifficulty(value: number): number {
  return Math.round(value * 100) / 100;
}

function roundDifficultyDown(value: number): number {
  return Math.floor(value * 100) / 100;
}
