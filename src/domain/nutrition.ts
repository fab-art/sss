import type {
  Meal,
  ActivityLevel,
  NutritionGoal
} from './types';

export function calculateTDEE(
  age: number,
  weightLbs: number,
  heightInches: number,
  activityLevel: ActivityLevel,
  workoutCaloriesBurned: number
): number {
  // Harris-Benedict formula for BMR
  const bmr = 88.362 + 13.397 * (weightLbs * 0.453592) + 4.799 * (heightInches * 2.54) - 5.677 * age;

  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };

  const tdee = bmr * multipliers[activityLevel] + workoutCaloriesBurned;
  return Math.round(tdee);
}

export function calculateNutritionTargets(
  tdee: number,
  goal: NutritionGoal,
  deficit: number
): {
  dailyCalories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
} {
  let dailyCalories = tdee;
  let macroRatio = { protein: 0.3, carbs: 0.4, fat: 0.3 };

  if (goal === 'weightLoss') {
    dailyCalories = tdee - deficit;
    macroRatio = { protein: 0.4, carbs: 0.4, fat: 0.2 };
  } else if (goal === 'muscleGain') {
    dailyCalories = tdee + 300;
    macroRatio = { protein: 0.35, carbs: 0.45, fat: 0.2 };
  }

  return {
    dailyCalories,
    proteinG: Math.round((dailyCalories * macroRatio.protein) / 4),
    carbsG: Math.round((dailyCalories * macroRatio.carbs) / 4),
    fatG: Math.round((dailyCalories * macroRatio.fat) / 9),
  };
}

export function validateMealAgainstFastingWindow(
  mealTime: string,
  eatingWindowStart: string,
  eatingWindowEnd: string
): { valid: boolean; message: string } {
  const toMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const mealMinutes = toMinutes(mealTime);
  const startMinutes = toMinutes(eatingWindowStart);
  const endMinutes = toMinutes(eatingWindowEnd);

  if (startMinutes < endMinutes) {
    const valid = mealMinutes >= startMinutes && mealMinutes <= endMinutes;
    return {
      valid,
      message: valid
        ? 'Meal logged within eating window.'
        : `Outside eating window (${eatingWindowStart} - ${eatingWindowEnd}).`,
    };
  } else {
    const valid = mealMinutes >= startMinutes || mealMinutes <= endMinutes;
    return {
      valid,
      message: valid
        ? 'Meal logged within eating window.'
        : `Outside eating window (${eatingWindowStart} - ${eatingWindowEnd}).`,
    };
  }
}

export function summarizeDailyNutrition(
  meals: Meal[],
  workoutCaloriesBurned: number,
  targets: { dailyCalories: number; proteinG: number; carbsG: number; fatG: number }
) {
  const consumed = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const deficit = workoutCaloriesBurned - consumed.calories;

  const getStatus = (consumed: number, target: number) => {
    if (consumed < target * 0.9) return 'under';
    if (consumed > target * 1.1) return 'over';
    return 'on-target';
  };

  return {
    caloriesConsumed: consumed.calories,
    calorieDeficit: deficit,
    proteinConsumed: consumed.protein,
    carbsConsumed: consumed.carbs,
    fatConsumed: consumed.fat,
    macroStatus: {
      protein: getStatus(consumed.protein, targets.proteinG),
      carbs: getStatus(consumed.carbs, targets.carbsG),
      fat: getStatus(consumed.fat, targets.fatG),
    },
  };
}
