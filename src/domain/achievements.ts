import type { AchievementDefinition, AchievementSnapshot, UserAchievement } from './types';

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first-quest',
    title: 'First Quest',
    description: 'Complete your first workout.',
    xpReward: 50,
    isUnlocked: ({ progression }) => progression.workoutsCompleted >= 1
  },
  {
    id: 'three-day-flame',
    title: 'Three-Day Flame',
    description: 'Build a three-day workout streak.',
    xpReward: 100,
    isUnlocked: ({ streak }) => streak.longest >= 3
  },
  {
    id: 'guardian-rising',
    title: 'Guardian Rising',
    description: 'Reach Guardian rank.',
    xpReward: 150,
    isUnlocked: ({ progression }) => progression.totalXp >= 1_500
  },
  {
    id: 'ten-trials',
    title: 'Ten Trials',
    description: 'Complete ten workouts.',
    xpReward: 200,
    isUnlocked: ({ progression }) => progression.workoutsCompleted >= 10
  }
];

export function evaluateAchievements(
  snapshot: AchievementSnapshot,
  unlocked: UserAchievement[],
  unlockedAt: string
): UserAchievement[] {
  const unlockedIds = new Set(unlocked.map((achievement) => achievement.id));
  const newlyUnlocked = ACHIEVEMENTS.filter(
    (achievement) => !unlockedIds.has(achievement.id) && achievement.isUnlocked(snapshot)
  ).map((achievement) => ({
    id: achievement.id,
    unlockedAt,
    xpReward: achievement.xpReward
  }));

  return [...unlocked, ...newlyUnlocked];
}

export function getAchievementRewardXp(previous: UserAchievement[], next: UserAchievement[]): number {
  const previousIds = new Set(previous.map((achievement) => achievement.id));
  return next
    .filter((achievement) => !previousIds.has(achievement.id))
    .reduce((total, achievement) => total + achievement.xpReward, 0);
}
