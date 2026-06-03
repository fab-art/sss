import { initialProgression, initialRunningProgress } from '../../domain/progression';
import type {
  ProgressionState,
  StreakState,
  UserAchievement,
  DailyQuest,
  RunningProgress
} from '../../domain/types';
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

// V2 Quests
export async function getDailyQuest(date: string): Promise<DailyQuest | undefined> {
  return db.dailyQuests.where('date').equals(date).first();
}

export async function saveDailyQuest(quest: DailyQuest): Promise<void> {
  await db.dailyQuests.put(quest);
}

export async function listDailyQuests(): Promise<DailyQuest[]> {
  return db.dailyQuests.orderBy('date').reverse().toArray();
}

// V2 Running Progress
export async function getRunningProgress(userId: string = 'default'): Promise<RunningProgress> {
  return (await db.runningProgress.get(userId)) ?? { ...initialRunningProgress, userId };
}

export async function saveRunningProgress(progress: RunningProgress): Promise<void> {
  await db.runningProgress.put(progress);
}
