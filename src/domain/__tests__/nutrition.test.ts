import { describe, expect, it } from 'vitest';
import {
  calculateTDEE,
  calculateNutritionTargets,
  summarizeDailyNutrition
} from '../nutrition';
import type { MealEntry } from '../types';

describe('Nutrition domain logic', () => {
  it('calculates TDEE correctly', () => {
    // age 28, weight 180lbs, height 70 inches, active
    const tdee = calculateTDEE(28, 180, 70, 'active', 0);
    expect(tdee).toBeGreaterThan(2000);
  });

  it('calculates nutrition targets for weight loss', () => {
    const targets = calculateNutritionTargets(2500, 'weightLoss', 500);
    expect(targets.dailyCalories).toBe(2000);
    expect(targets.proteinG).toBe(200); // 40% of 2000 / 4
    expect(targets.carbsG).toBe(200);   // 40% of 2000 / 4
    expect(targets.fatG).toBe(44);      // 20% of 2000 / 9
  });

  it('summarizes daily nutrition correctly', () => {
    const mealEntries: MealEntry[] = [
      {
          id: '1',
          userId: 'default',
          date: '2026-06-02',
          timestamp: '12:30:00',
          mealType: 'lunch',
          foods: [{ id: 'f1', name: 'Oatmeal', category: 'staple', calories: 350, portion: '1 cup', isRwandanFood: false }],
          totalCalories: 350,
          withinFastingWindow: true
      }
    ];

    const summary = summarizeDailyNutrition(mealEntries, 300, 2000, { startTime: '12:00', endTime: '20:00' });

    expect(summary.totalCaloriesConsumed).toBe(350);
    expect(summary.remainingCalories).toBe(1950); // (2000 + 300) - 350
    expect(summary.deficit).toBe(1950); // 300 - (350 - 2000) = 1950
  });
});
