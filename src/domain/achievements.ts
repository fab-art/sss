export type AchievementId =
  | "first-workout"
  | "three-day-streak"
  | "seven-day-streak"
  | "first-1km-run"
  | "one-hundred-total-push-ups"
  | "consistency-warrior";

export type CosmeticFlair =
  | "spark"
  | "ember"
  | "flame"
  | "runner-stripe"
  | "push-up-badge"
  | "warrior-crest";

export type AchievementReward = Readonly<{
  xpBonus?: number;
  cosmeticFlair?: CosmeticFlair;
}>;

export type AchievementState = Readonly<{
  /** All completed workouts across every activity type. */
  totalWorkouts: number;
  /** Current consecutive-day workout streak. */
  currentStreakDays: number;
  /** Longest consecutive-day workout streak ever recorded. */
  longestStreakDays: number;
  /** Longest single run distance in meters. */
  longestRunMeters: number;
  /** All push-up reps completed across workouts. */
  totalPushUps: number;
  /** Consecutive weeks where the user met their workout goal. */
  consecutiveGoalWeeks: number;
}>;

export type AchievementDefinition = Readonly<{
  id: AchievementId;
  title: string;
  reward: AchievementReward;
  predicate: (state: AchievementState) => boolean;
}>;

const bestStreakDays = (state: AchievementState): number =>
  Math.max(state.currentStreakDays, state.longestStreakDays);

export const ACHIEVEMENTS = [
  {
    id: "first-workout",
    title: "First Workout",
    reward: { xpBonus: 25, cosmeticFlair: "spark" },
    predicate: (state) => state.totalWorkouts >= 1,
  },
  {
    id: "three-day-streak",
    title: "3-Day Streak",
    reward: { xpBonus: 75, cosmeticFlair: "ember" },
    predicate: (state) => bestStreakDays(state) >= 3,
  },
  {
    id: "seven-day-streak",
    title: "7-Day Streak",
    reward: { xpBonus: 200, cosmeticFlair: "flame" },
    predicate: (state) => bestStreakDays(state) >= 7,
  },
  {
    id: "first-1km-run",
    title: "First 1 km Run",
    reward: { xpBonus: 100, cosmeticFlair: "runner-stripe" },
    predicate: (state) => state.longestRunMeters >= 1_000,
  },
  {
    id: "one-hundred-total-push-ups",
    title: "100 Total Push-Ups",
    reward: { xpBonus: 100, cosmeticFlair: "push-up-badge" },
    predicate: (state) => state.totalPushUps >= 100,
  },
  {
    id: "consistency-warrior",
    title: "Consistency Warrior",
    reward: { xpBonus: 300, cosmeticFlair: "warrior-crest" },
    predicate: (state) => state.consecutiveGoalWeeks >= 4,
  },
] as const satisfies readonly AchievementDefinition[];

export const achievementCatalog = ACHIEVEMENTS;

export function evaluateAchievements(
  currentlyUnlocked: readonly AchievementId[],
  state: AchievementState,
): AchievementDefinition[] {
  const unlocked = new Set<AchievementId>(currentlyUnlocked);

  return ACHIEVEMENTS.filter(
    (achievement) => !unlocked.has(achievement.id) && achievement.predicate(state),
  );
}
