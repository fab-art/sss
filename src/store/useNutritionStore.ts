import { create } from 'zustand';
import type {
  MealEntry,
  FastingProtocol,
  RwandanFoodPreset,
  DailyNutritionSummary,
  FoodItem
} from '../domain/types';
import {
  saveMealEntry,
  listMealEntriesByDate,
  deleteMealEntry,
  saveFastingProtocol,
  getFastingProtocol,
  listRwandanFoodPresets,
  bulkSaveRwandanFoodPresets
} from '../db/repositories/nutritionRepository';
import {
  summarizeDailyNutrition,
  RWANDAN_FOOD_PRESETS,
  toMinutes,
  suggestNextMeal,
  calculateTDEE,
  calculateNutritionTargets
} from '../domain/nutrition';
import { useUserStore } from './useUserStore';
import { createId } from '../lib/id';
import { nowIso } from '../lib/date';

interface NutritionStore {
  protocol: FastingProtocol | null;
  mealEntries: MealEntry[];
  foodPresets: RwandanFoodPreset[];
  isHydrated: boolean;

  hydrate: (userId: string, date: string) => Promise<void>;
  logMeal: (mealType: MealEntry['mealType'], foods: FoodItem[]) => Promise<void>;
  removeMeal: (id: string) => Promise<void>;
  updateProtocol: (protocol: FastingProtocol) => Promise<void>;
  getSummary: (workoutCaloriesBurned: number) => DailyNutritionSummary | null;
  getSuggestions: () => string[];
}

export const useNutritionStore = create<NutritionStore>((set, get) => {
  let lastSummaryCache: {
    mealEntries: MealEntry[];
    protocol: FastingProtocol | null;
    profile: unknown;
    workoutCaloriesBurned: number;
    result: DailyNutritionSummary & { targets: unknown };
  } | null = null;

  return {
    protocol: null,
    mealEntries: [],
    foodPresets: [],
    isHydrated: false,

    hydrate: async (userId, date) => {
      const [protocol, mealEntries, foodPresets] = await Promise.all([
        getFastingProtocol(userId),
        listMealEntriesByDate(date),
        listRwandanFoodPresets()
      ]);

      let finalFoodPresets = foodPresets;
      if (foodPresets.length === 0) {
        await bulkSaveRwandanFoodPresets(RWANDAN_FOOD_PRESETS);
        finalFoodPresets = RWANDAN_FOOD_PRESETS;
      }

      set({ protocol, mealEntries, foodPresets: finalFoodPresets, isHydrated: true });
    },

    logMeal: async (mealType, foods) => {
      const today = nowIso().split('T')[0];
      const timestamp = nowIso().split('T')[1].split('.')[0];
      const totalCalories = foods.reduce((sum, f) => sum + f.calories, 0);

      // Validate fasting window
      const currentProtocol = get().protocol;
      let withinFastingWindow = true;
      if (currentProtocol && currentProtocol.protocolType !== 'none') {
        const nowMin = toMinutes(timestamp.slice(0, 5));
        const startMin = toMinutes(currentProtocol.eatingWindowStart);
        const endMin = toMinutes(currentProtocol.eatingWindowEnd);

        if (startMin < endMin) {
          withinFastingWindow = nowMin >= startMin && nowMin <= endMin;
        } else {
          withinFastingWindow = nowMin >= startMin || nowMin <= endMin;
        }
      }

      const entry: MealEntry = {
        id: createId('meal'),
        userId: 'default',
        date: today,
        timestamp,
        mealType,
        foods,
        totalCalories,
        withinFastingWindow
      };

      await saveMealEntry(entry);
      set({ mealEntries: [...get().mealEntries, entry] });
    },

    removeMeal: async (id) => {
      await deleteMealEntry(id);
      const currentMealEntries = get().mealEntries;
      set({ mealEntries: currentMealEntries.filter((m) => m.id !== id) });
    },

    updateProtocol: async (protocol) => {
      await saveFastingProtocol(protocol);
      set({ protocol });
    },

    getSummary: (workoutCaloriesBurned) => {
      const { mealEntries, protocol } = get();
      const { profile } = useUserStore.getState();

      // BOLT OPTIMIZATION: Memoize summary to prevent expensive recalculations during renders
      if (
        lastSummaryCache &&
        lastSummaryCache.mealEntries === mealEntries &&
        lastSummaryCache.protocol === protocol &&
        lastSummaryCache.profile === profile &&
        lastSummaryCache.workoutCaloriesBurned === workoutCaloriesBurned
      ) {
        return lastSummaryCache.result;
      }

      const tdee = calculateTDEE(
        profile.age,
        profile.weight,
        profile.height,
        profile.activityLevel,
        0 // workoutCaloriesBurned handled separately in summarizeDailyNutrition
      );

      const targets = calculateNutritionTargets(tdee, profile.goal, 500);
      const dailyGoal = targets.dailyCalories;

      const fastingWindow = {
        startTime: protocol?.eatingWindowStart || '12:00',
        endTime: protocol?.eatingWindowEnd || '20:00'
      };

      const summary = summarizeDailyNutrition(
        mealEntries,
        workoutCaloriesBurned,
        dailyGoal,
        fastingWindow
      );
      const result = {
        ...summary,
        targets // Include macro targets in summary
      };

      lastSummaryCache = {
        mealEntries,
        protocol,
        profile,
        workoutCaloriesBurned,
        result
      };

      return result;
    },

    getSuggestions: () => {
      const { protocol } = get();
      if (!protocol) return [];

      const summary = get().getSummary(0);
      if (!summary) return [];

      const now = new Date();
      const timestamp = now.toTimeString().slice(0, 5);
      const nowMin = toMinutes(timestamp);
      const endMin = toMinutes(protocol.eatingWindowEnd);

      let timeUntilClose = endMin - nowMin;
      if (timeUntilClose < 0) timeUntilClose += 1440;

      let timeOfDay: 'morning' | 'afternoon' | 'evening' = 'afternoon';
      const hour = now.getHours();
      if (hour < 11) timeOfDay = 'morning';
      else if (hour > 17) timeOfDay = 'evening';

      return suggestNextMeal(summary.remainingCalories, timeUntilClose, timeOfDay);
    }
  };
});
