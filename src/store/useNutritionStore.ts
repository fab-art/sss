import { create } from 'zustand';
import type { FastingSession, Meal, NutritionProfile, FoodPreset, DailyNutritionSummary } from '../domain/types';
import {
  saveMeal,
  listMealsByDate,
  deleteMeal,
  saveFastingSession,
  getFastingSessionByDate,
  saveNutritionProfile,
  getNutritionProfile,
  listFoodPresets
} from '../db/repositories/nutritionRepository';
import { summarizeDailyNutrition, calculateNutritionTargets } from '../domain/nutrition';
import { createId } from '../lib/id';

interface NutritionStore {
  profile: NutritionProfile | null;
  meals: Meal[];
  fastingSession: FastingSession | null;
  foodPresets: FoodPreset[];
  isHydrated: boolean;

  hydrate: (userId: string, date: string) => Promise<void>;
  addMeal: (meal: Omit<Meal, 'id'>) => Promise<void>;
  removeMeal: (id: string) => Promise<void>;
  updateFastingSession: (session: FastingSession) => Promise<void>;
  updateProfile: (profile: NutritionProfile) => Promise<void>;
  getSummary: (workoutCaloriesBurned: number) => DailyNutritionSummary | null;
}

export const useNutritionStore = create<NutritionStore>((set, get) => ({
  profile: null,
  meals: [],
  fastingSession: null,
  foodPresets: [],
  isHydrated: false,

  hydrate: async (userId, date) => {
    const [profile, meals, fastingSession, foodPresets] = await Promise.all([
      getNutritionProfile(userId),
      listMealsByDate(date),
      getFastingSessionByDate(date),
      listFoodPresets()
    ]);
    set({ profile, meals, fastingSession, foodPresets, isHydrated: true });
  },

  addMeal: async (mealInput) => {
    const meal = { ...mealInput, id: createId('meal') };
    await saveMeal(meal);
    set({ meals: [...get().meals, meal] });
  },

  removeMeal: async (id) => {
    await deleteMeal(id);
    set({ meals: get().meals.filter(m => m.id !== id) });
  },

  updateFastingSession: async (session) => {
    await saveFastingSession(session);
    set({ fastingSession: session });
  },

  updateProfile: async (profile) => {
    await saveNutritionProfile(profile);
    set({ profile });
  },

  getSummary: (workoutCaloriesBurned) => {
    const { meals, profile } = get();
    if (!profile) return null;

    const tdee = profile.weight
      ? (profile.weight * 11) + (profile.activityLevel === 'sedentary' ? 0 : 300) // Simple approximation if full data missing
      : 2000;

    const targets = calculateNutritionTargets(tdee, profile.goal, profile.deficit);
    const summary = summarizeDailyNutrition(meals, workoutCaloriesBurned, targets);

    return {
      date: meals[0]?.date || '',
      userId: profile.userId,
      caloriesConsumed: summary.caloriesConsumed,
      caloriesBurned: workoutCaloriesBurned,
      calorieDeficit: summary.calorieDeficit,
      proteinConsumed: summary.proteinConsumed,
      carbsConsumed: summary.carbsConsumed,
      fatConsumed: summary.fatConsumed,
      proteinTarget: targets.proteinG,
      carbsTarget: targets.carbsG,
      fatTarget: targets.fatG,
      mealsLogged: meals.length,
      fastingAdherence: get().fastingSession?.completedSuccessfully ?? false
    };
  }
}));
