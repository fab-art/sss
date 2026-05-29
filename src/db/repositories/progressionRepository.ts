import { initialProgression } from '../../domain/progression';
import type { ProgressionState, StreakState, UserAchievement } from '../../domain/types';
import { db } from '../database';

const initialStreak: StreakState = { current: 0, longest: 0 };

export async function getProgression(): Promise<ProgressionState> {
  return (await db.progression.get('current'))?.value ?? initialProgression;
}

export async function saveProgression(value: ProgressionState): Promise<void> {
  await db.progression.put({ id: 'current', value });
}

export async function getStreak(): Promise<StreakState> {
  return (await db.streak.get('current'))?.value ?? initialStreak;
}

export async function saveStreak(value: StreakState): Promise<void> {
  await db.streak.put({ id: 'current', value });
}

export async function listAchievements(): Promise<UserAchievement[]> {
  return db.achievements.orderBy('unlockedAt').toArray();
}

export async function saveAchievements(achievements: UserAchievement[]): Promise<void> {
  await db.achievements.bulkPut(achievements);
}
