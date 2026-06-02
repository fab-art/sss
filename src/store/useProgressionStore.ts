import { create } from 'zustand';
import { ACHIEVEMENTS, evaluateAchievements, getAchievementRewardXp } from '../domain/achievements';
import { applyXp, completeWorkoutProgression, initialProgression } from '../domain/progression';
import { applyWorkoutToStreak } from '../domain/streak';
import { calculateWorkoutXp } from '../domain/xp';
import type {
  ProgressionState,
  StreakState,
  UserAchievement,
  WorkoutInput,
  WorkoutRecord
} from '../domain/types';
import {
  getProgression,
  getStreak,
  listAchievements,
  saveAchievements,
  saveProgression,
  saveStreak
} from '../db/repositories/progressionRepository';
import { listWorkouts, saveWorkout } from '../db/repositories/workoutRepository';
import { createId } from '../lib/id';

const initialStreak: StreakState = { current: 0, longest: 0 };

type ProgressionStore = {
  progression: ProgressionState;
  streak: StreakState;
  achievements: UserAchievement[];
  workouts: WorkoutRecord[];
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  completeWorkout: (workout: WorkoutInput) => Promise<WorkoutRecord>;
};

export const useProgressionStore = create<ProgressionStore>((set, get) => ({
  progression: initialProgression,
  streak: initialStreak,
  achievements: [],
  workouts: [],
  isHydrated: false,
  hydrate: async () => {
    const [progression, streak, achievements, workouts] = await Promise.all([
      getProgression(),
      getStreak(),
      listAchievements(),
      listWorkouts()
    ]);

    set({ progression, streak, achievements, workouts, isHydrated: true });
  },
  completeWorkout: async (workout) => {
    const xpAwarded = calculateWorkoutXp(workout);
    const record: WorkoutRecord = {
      ...workout,
      id: createId('workout'),
      xpAwarded
    };

    const workouts = [record, ...get().workouts];
    const streak = applyWorkoutToStreak(get().streak, workout.completedAt);
    let progression = completeWorkoutProgression(get().progression, xpAwarded, workout);
    const achievements = evaluateAchievements(
      { progression, streak, workouts },
      get().achievements,
      workout.completedAt
    );
    const achievementXp = getAchievementRewardXp(get().achievements, achievements);

    if (achievementXp > 0) {
      progression = applyXp(progression, achievementXp);
    }

    await Promise.all([
      saveWorkout(record),
      saveProgression(progression),
      saveStreak(streak),
      saveAchievements(achievements)
    ]);

    set({ workouts, progression, streak, achievements });
    return record;
  }
}));

export const achievementDefinitions = ACHIEVEMENTS;
