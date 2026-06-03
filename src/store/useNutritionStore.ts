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
  suggestNextMeal
} from '../domain/nutrition';
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

export const useNutritionStore = create<NutritionStore>((set, get) => ({
  protocol: null,
  mealEntries: [],
  foodPresets: [],
  isHydrated: false,

  hydrate: async (userId, date) => {
    let [protocol, mealEntries, foodPresets] = await Promise.all([
      getFastingProtocol(userId),
      listMealEntriesByDate(date),
      listRwandanFoodPresets()
    ]);

    if (foodPresets.length === 0) {
      await bulkSaveRwandanFoodPresets(RWANDAN_FOOD_PRESETS);
      foodPresets = RWANDAN_FOOD_PRESETS;
    }

    set({ protocol, mealEntries, foodPresets, isHydrated: true });
  },

  logMeal: async (mealType, foods) => {
    const today = nowIso().split('T')[0];
    const timestamp = nowIso().split('T')[1].split('.')[0];
    const totalCalories = foods.reduce((sum, f) => sum + f.calories, 0);

    // Validate fasting window
    const { protocol } = get();
    let withinFastingWindow = true;
    if (protocol && protocol.protocolType !== 'none') {
        const nowMin = toMinutes(timestamp.slice(0, 5));
        const startMin = toMinutes(protocol.eatingWindowStart);
        const endMin = toMinutes(protocol.eatingWindowEnd);

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
    set({ mealEntries: get().mealEntries.filter(m => m.id !== id) });
  },

  updateProtocol: async (protocol) => {
    await saveFastingProtocol(protocol);
    set({ protocol });
  },

  getSummary: (workoutCaloriesBurned) => {
    const { mealEntries, protocol } = get();
    const dailyGoal = 2000; // Default goal
    const fastingWindow = {
      startTime: protocol?.eatingWindowStart || '12:00',
      endTime: protocol?.eatingWindowEnd || '20:00'
    };

    return summarizeDailyNutrition(mealEntries, workoutCaloriesBurned, dailyGoal, fastingWindow);
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
}));
