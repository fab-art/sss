import { describe, expect, it } from 'vitest';
import {
  evaluateAchievements,
  getAchievementRewardXp
} from '../../src/domain/achievements';
import type { AchievementSnapshot, UserAchievement } from '../../src/domain/types';

const baseSnapshot: AchievementSnapshot = {
  progression: {
    totalXp: 0,
    level: 1,
    rankId: 'initiate',
    workoutsCompleted: 0
  },
  streak: {
    current: 0,
    longest: 0
  },
  workouts: []
};

describe('achievements', () => {
  it('unlocks "First Quest" on first workout', () => {
    const snapshot = {
      ...baseSnapshot,
      progression: { ...baseSnapshot.progression, workoutsCompleted: 1 }
    };
    const unlocked = evaluateAchievements(snapshot, [], '2026-05-28');
    expect(unlocked.some(a => a.id === 'first-quest')).toBe(true);
  });

  it('unlocks "Three-Day Flame" on 3-day longest streak', () => {
    const snapshot = {
      ...baseSnapshot,
      streak: { current: 3, longest: 3 }
    };
    const unlocked = evaluateAchievements(snapshot, [], '2026-05-28');
    expect(unlocked.some(a => a.id === 'three-day-flame')).toBe(true);
  });

  it('does not double-unlock achievements', () => {
    const snapshot = {
      ...baseSnapshot,
      progression: { ...baseSnapshot.progression, workoutsCompleted: 1 }
    };
    const alreadyUnlocked: UserAchievement[] = [
      { id: 'first-quest', unlockedAt: '2026-05-27', xpReward: 50 }
    ];
    const result = evaluateAchievements(snapshot, alreadyUnlocked, '2026-05-28');
    expect(result.filter(a => a.id === 'first-quest')).toHaveLength(1);
  });

  it('calculates reward XP for new achievements', () => {
    const initial: UserAchievement[] = [];
    const updated: UserAchievement[] = [
      { id: 'first-quest', unlockedAt: '2026-05-28', xpReward: 50 },
      { id: 'three-day-flame', unlockedAt: '2026-05-28', xpReward: 100 }
    ];
    expect(getAchievementRewardXp(initial, updated)).toBe(150);
  });
});
