import { describe, expect, it } from 'vitest';
import {
  calculateTDEE,
  calculateNutritionTargets,
  validateMealAgainstFastingWindow,
  summarizeDailyNutrition
} from '../nutrition';
import type { Meal } from '../types';

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

  it('validates meal against fasting window', () => {
    const start = '12:00';
    const end = '20:00';

    expect(validateMealAgainstFastingWindow('13:00', start, end).valid).toBe(true);
    expect(validateMealAgainstFastingWindow('21:00', start, end).valid).toBe(false);
    expect(validateMealAgainstFastingWindow('11:00', start, end).valid).toBe(false);
  });

  it('summarizes daily nutrition correctly', () => {
    const meals: Meal[] = [
      { id: '1', date: '2026-06-02', timestamp: '12:30', foodName: 'Oatmeal', servingSize: '1 cup', calories: 350, protein: 12, carbs: 58, fat: 8, foodCategory: 'breakfast', source: 'preset' }
    ];
    const targets = { dailyCalories: 2000, proteinG: 150, carbsG: 200, fatG: 60 };
    const summary = summarizeDailyNutrition(meals, 300, targets);

    expect(summary.caloriesConsumed).toBe(350);
    expect(summary.calorieDeficit).toBe(-50); // 300 - 350
    expect(summary.macroStatus.protein).toBe('under');
  });
});
