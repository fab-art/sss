import { create } from 'zustand';
import { ACHIEVEMENTS, evaluateAchievements, getAchievementRewardXp } from '../domain/achievements';
import {
  applyXp,
  applyQuestRewards,
  initialProgression,
  initialRunningProgress,
  evaluateRunningPhaseProgression
} from '../domain/progression';
import { applyWorkoutToStreak } from '../domain/streak';
import type {
  ProgressionState,
  StreakState,
  UserAchievement,
  DailyQuest,
  RunningProgress,
  ExerciseInstance
} from '../domain/types';
import {
  getProgression,
  getStreak,
  listAchievements,
  saveAchievements,
  saveProgression,
  saveStreak,
  getDailyQuest,
  saveDailyQuest,
  getRunningProgress,
  saveRunningProgress,
  listDailyQuests
} from '../db/repositories/progressionRepository';
import { listWorkouts } from '../db/repositories/workoutRepository';
import { nowIso } from '../lib/date';
import { createId } from '../lib/id';

const initialStreak: StreakState = { current: 0, longest: 0 };

type ProgressionStore = {
  progression: ProgressionState;
  streak: StreakState;
  achievements: UserAchievement[];
  quests: DailyQuest[];
  activeQuest: DailyQuest | null;
  runningProgress: RunningProgress;
  isHydrated: boolean;

  hydrate: () => Promise<void>;
  startQuest: (rank: number) => Promise<DailyQuest>;
  updateExerciseProgress: (
    exerciseId: string,
    reps?: number,
    distance?: number,
    duration?: number
  ) => Promise<void>;
  completeActiveQuest: () => Promise<void>;
  syncSteps: (steps: number) => Promise<void>;
};

export const useProgressionStore = create<ProgressionStore>((set, get) => ({
  progression: initialProgression,
  streak: initialStreak,
  achievements: [],
  quests: [],
  activeQuest: null,
  runningProgress: initialRunningProgress,
  isHydrated: false,

  hydrate: async () => {
    const today = nowIso().split('T')[0];
    const [progression, streak, achievements, allQuests, runningProgress] = await Promise.all([
      getProgression(),
      getStreak(),
      listAchievements(),
      listDailyQuests(),
      getRunningProgress()
    ]);

    const activeQuest = allQuests.find((q) => q.date === today) || null;

    set({
      progression,
      streak,
      achievements,
      quests: allQuests,
      activeQuest,
      runningProgress,
      isHydrated: true
    });
  },

  startQuest: async (rank) => {
    const today = nowIso().split('T')[0];
    const existing = await getDailyQuest(today);
    if (existing) return existing;

    // Available exercises pool
    const pool = [
      {
        type: 'push-ups',
        base: 10,
        inc: 5,
        muscles: [{ name: 'chest', intensity: 'primary', growthPercentage: 3.0 }]
      },
      {
        type: 'sit-ups',
        base: 15,
        inc: 5,
        muscles: [{ name: 'core', intensity: 'primary', growthPercentage: 3.5 }]
      },
      {
        type: 'squats',
        base: 20,
        inc: 5,
        muscles: [{ name: 'legs', intensity: 'primary', growthPercentage: 3.0 }]
      },
      {
        type: 'light-run',
        base: 500,
        inc: 250,
        unit: 'm',
        muscles: [{ name: 'cardio', intensity: 'primary', growthPercentage: 4.0 }]
      },
      {
        type: 'walking',
        base: 1000,
        inc: 500,
        unit: 'm',
        muscles: [{ name: 'cardio', intensity: 'primary', growthPercentage: 4.0 }]
      }
    ];

    // Include all 5 exercises in every quest
    const selected = pool;

    const quest: DailyQuest = {
      id: createId('quest'),
      date: today,
      userId: 'default',
      rank,
      questName: `Rank ${rank} Daily Challenge`,
      exercises: selected.map((ex) => ({
        id: createId('ex'),
        questId: '',
        exerciseType: ex.type as ExerciseInstance['exerciseType'],
        targetReps: ex.unit ? undefined : ex.base + rank * ex.inc,
        targetDistance: ex.unit === 'm' ? ex.base + rank * ex.inc : undefined,
        repsLogged: ex.unit ? undefined : 0,
        distanceLogged: ex.unit === 'm' ? 0 : undefined,
        state: 'locked' as const,
        muscleGroups: ex.muscles as ExerciseInstance['muscleGroups'],
        xpContribution: 50 + rank * 10
      })),
      xpReward: 150 + rank * 50,
      isCompleted: false
    };

    quest.exercises.forEach((ex) => (ex.questId = quest.id));

    await saveDailyQuest(quest);
    set({ activeQuest: quest, quests: [quest, ...get().quests] });
    return quest;
  },

  updateExerciseProgress: async (exerciseId, reps, distance, duration) => {
    const quest = get().activeQuest;
    if (!quest) return;

    const exercises = quest.exercises.map((ex) => {
      if (ex.id === exerciseId) {
        const repsLogged = reps ?? ex.repsLogged;
        const distanceLogged = distance ?? ex.distanceLogged;
        const durationLogged = duration ?? ex.durationLogged;

        let state: ExerciseInstance['state'] = 'in-progress';
        if (ex.targetReps && repsLogged !== undefined && repsLogged >= ex.targetReps)
          state = 'completed';
        if (
          ex.targetDistance &&
          distanceLogged !== undefined &&
          distanceLogged >= ex.targetDistance
        )
          state = 'completed';

        return { ...ex, repsLogged, distanceLogged, durationLogged, state };
      }
      return ex;
    });

    const updatedQuest = { ...quest, exercises };
    await saveDailyQuest(updatedQuest);
    set({ activeQuest: updatedQuest });
  },

  completeActiveQuest: async () => {
    const quest = get().activeQuest;
    if (!quest || quest.isCompleted) return;

    const updatedQuest = { ...quest, isCompleted: true, completedAt: nowIso() };
    const streak = applyWorkoutToStreak(get().streak, updatedQuest.completedAt);
    let progression = applyQuestRewards(get().progression, updatedQuest);

    // Evaluate achievements
    const workouts = await listWorkouts();
    const achievements = evaluateAchievements(
      { progression, streak, workouts, quests: get().quests },
      get().achievements,
      updatedQuest.completedAt
    );
    const achievementXp = getAchievementRewardXp(get().achievements, achievements);
    if (achievementXp > 0) progression = applyXp(progression, achievementXp);

    await Promise.all([
      saveDailyQuest(updatedQuest),
      saveProgression(progression),
      saveStreak(streak),
      saveAchievements(achievements)
    ]);

    set({ activeQuest: updatedQuest, progression, streak, achievements });
  },

  syncSteps: async (steps) => {
    const runningProgress = get().runningProgress;
    const targetHit = (runningProgress.stepGoal && steps >= runningProgress.stepGoal) || false;
    const nextRunning = evaluateRunningPhaseProgression(runningProgress, targetHit);

    await saveRunningProgress(nextRunning);
    set({ runningProgress: nextRunning });
  }
}));

export const achievementDefinitions = ACHIEVEMENTS;
