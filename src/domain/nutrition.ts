import type {
  MealEntry,
  ActivityLevel,
  NutritionGoal,
  RwandanFoodPreset,
  FoodItem,
  DailyNutritionSummary
} from './types';

export const RWANDAN_FOOD_PRESETS: RwandanFoodPreset[] = [
  // STAPLES
  { id: 'staple-1', name: 'Matoke', category: 'staple', calories: 180, portion: '1 portion', localLanguage: 'Ibitoke', createdAt: new Date().toISOString() },
  { id: 'staple-2', name: 'Cassava', category: 'staple', calories: 150, portion: '1 cup cooked', localLanguage: 'Imyumbati', createdAt: new Date().toISOString() },
  { id: 'staple-3', name: 'Rice', category: 'staple', calories: 200, portion: '1 cup cooked', localLanguage: 'Umuceri', createdAt: new Date().toISOString() },
  { id: 'staple-4', name: 'Beans', category: 'staple', calories: 220, portion: '1 cup cooked', localLanguage: 'Ibishyimbo', createdAt: new Date().toISOString() },
  { id: 'staple-5', name: 'Ugali', category: 'staple', calories: 200, portion: '1 cup', localLanguage: 'Ubugari', createdAt: new Date().toISOString() },
  { id: 'staple-6', name: 'Plantain', category: 'staple', calories: 220, portion: '1 medium', localLanguage: 'Ibitoke bibisi', createdAt: new Date().toISOString() },
  { id: 'staple-7', name: 'Posho', category: 'staple', calories: 150, portion: '1 cup', localLanguage: 'Kawunga', createdAt: new Date().toISOString() },

  // PROTEINS
  { id: 'protein-1', name: 'Chicken', category: 'protein', calories: 165, portion: '100g grilled', createdAt: new Date().toISOString() },
  { id: 'protein-2', name: 'Fish', category: 'protein', calories: 200, portion: '100g fried', createdAt: new Date().toISOString() },
  { id: 'protein-3', name: 'Eggs', category: 'protein', calories: 80, portion: '1 boiled', createdAt: new Date().toISOString() },
  { id: 'protein-4', name: 'Ground Nut Sauce', category: 'protein', calories: 300, portion: '1 cup', localLanguage: 'Ibisosa', createdAt: new Date().toISOString() },
  { id: 'protein-5', name: 'Milk', category: 'protein', calories: 150, portion: '1 cup', localLanguage: 'Amata', createdAt: new Date().toISOString() },

  // VEGETABLES
  { id: 'veg-1', name: 'Spinach', category: 'vegetable', calories: 40, portion: '1 cup cooked', localLanguage: 'Epinari', createdAt: new Date().toISOString() },
  { id: 'veg-2', name: 'Cabbage', category: 'vegetable', calories: 35, portion: '1 cup cooked', localLanguage: 'Mashu', createdAt: new Date().toISOString() },
  { id: 'veg-3', name: 'Carrots', category: 'vegetable', calories: 50, portion: '1 cup cooked', localLanguage: 'Karoti', createdAt: new Date().toISOString() },
  { id: 'veg-4', name: 'Tomatoes', category: 'vegetable', calories: 35, portion: '1 cup', localLanguage: 'Inyanya', createdAt: new Date().toISOString() },

  // FRUITS
  { id: 'fruit-1', name: 'Banana', category: 'fruit', calories: 105, portion: '1 medium', localLanguage: 'Umuneke', createdAt: new Date().toISOString() },
  { id: 'fruit-2', name: 'Avocado', category: 'fruit', calories: 120, portion: '1/2 fruit', localLanguage: 'Avoka', createdAt: new Date().toISOString() },
  { id: 'fruit-3', name: 'Mango', category: 'fruit', calories: 100, portion: '1 medium', localLanguage: 'Umwembe', createdAt: new Date().toISOString() },
  { id: 'fruit-4', name: 'Papaya', category: 'fruit', calories: 55, portion: '1 cup', localLanguage: 'Ipapayi', createdAt: new Date().toISOString() },

  // DRINKS
  { id: 'drink-1', name: 'Tea with milk', category: 'drink', calories: 50, portion: '1 cup', localLanguage: 'Icyayi n’amata', createdAt: new Date().toISOString() },
  { id: 'drink-2', name: 'Coffee with milk', category: 'drink', calories: 40, portion: '1 cup', localLanguage: 'Ikawa n’amata', createdAt: new Date().toISOString() },

  // ADDITIONAL VARIANTS
  { id: 'staple-8', name: 'Sweet Potato', category: 'staple', calories: 120, portion: '1 medium', localLanguage: 'Ikijumba', createdAt: new Date().toISOString() },
  { id: 'staple-9', name: 'Irish Potato', category: 'staple', calories: 130, portion: '1 cup', localLanguage: 'Ibirayi', createdAt: new Date().toISOString() },
  { id: 'protein-6', name: 'Goat Brochette', category: 'protein', calories: 180, portion: '1 skewer', localLanguage: 'Indatwa', createdAt: new Date().toISOString() },
  { id: 'protein-7', name: 'Grilled Tilapia', category: 'protein', calories: 150, portion: '100g', createdAt: new Date().toISOString() },
  { id: 'veg-5', name: 'Isombe', category: 'vegetable', calories: 120, portion: '1 cup', localLanguage: 'Isombe', createdAt: new Date().toISOString() },
  { id: 'fruit-5', name: 'Passion Fruit', category: 'fruit', calories: 20, portion: '1 fruit', localLanguage: 'Iritunda', createdAt: new Date().toISOString() },
];

export function calculateTDEE(
  age: number,
  weightLbs: number,
  heightInches: number,
  activityLevel: ActivityLevel,
  workoutCaloriesBurned: number
): number {
  const bmr = 88.362 + 13.397 * (weightLbs * 0.453592) + 4.799 * (heightInches * 2.54) - 5.677 * age;
  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  return Math.round(bmr * multipliers[activityLevel] + workoutCaloriesBurned);
}

export function calculateNutritionTargets(
  tdee: number,
  goal: NutritionGoal,
  deficit: number
): { dailyCalories: number; proteinG: number; carbsG: number; fatG: number } {
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

export function suggestNextMeal(
  caloriesRemaining: number,
  timeUntilWindowCloseMin: number,
  timeOfDay: 'morning' | 'afternoon' | 'evening'
): string[] {
  const suggestions: string[] = [];
  if (timeUntilWindowCloseMin < 180 && caloriesRemaining > 800) {
    suggestions.push("You should eat soon to use remaining calories before your window closes.");
  }
  if (caloriesRemaining < 300) {
    suggestions.push("You're near your daily limit. Stick to light snacks only.");
  }
  if (timeOfDay === 'afternoon' && timeUntilWindowCloseMin > 180) {
    suggestions.push("Good time for a balanced lunch. Focus on staples and proteins.");
  } else if (timeOfDay === 'evening') {
    suggestions.push("Dinner soon. Ensure adequate protein intake before your window closes.");
  }
  const targetMealCal = Math.min(caloriesRemaining * 0.6, 800);
  suggestions.push(`Aim for a meal around ${Math.round(targetMealCal)} calories.`);
  return suggestions;
}

export function generateMealCombos(
  foodPresets: RwandanFoodPreset[] = RWANDAN_FOOD_PRESETS
): { name: string; foods: FoodItem[]; totalCalories: number }[] {
  const combos = [];
  const staple = foodPresets.find(f => f.category === 'staple');
  const protein = foodPresets.find(f => f.category === 'protein');
  const veg = foodPresets.find(f => f.category === 'vegetable');
  if (staple && protein && veg) {
    const total = staple.calories + protein.calories + veg.calories;
    combos.push({
        name: 'Balanced Lunch',
        foods: [staple, protein, veg].map(f => ({ ...f, isRwandanFood: true })),
        totalCalories: total
    });
  }
  const staples = foodPresets.filter(f => f.category === 'staple').slice(0, 2);
  const prot = foodPresets.find(f => f.category === 'protein');
  if (staples.length === 2 && prot) {
      const total = staples[0].calories + staples[1].calories + prot.calories;
      combos.push({
          name: 'High Energy Meal',
          foods: [...staples, prot].map(f => ({ ...f, isRwandanFood: true })),
          totalCalories: total
      });
  }
  return combos;
}

export function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function summarizeDailyNutrition(
  mealEntries: MealEntry[],
  workoutCaloriesBurned: number,
  dailyGoal: number,
  fastingWindow: { startTime: string; endTime: string }
): DailyNutritionSummary {
  const consumed = mealEntries.reduce((total, meal) => total + meal.totalCalories, 0);
  const totalAllowance = dailyGoal + workoutCaloriesBurned;
  const remainingCalories = Math.max(0, totalAllowance - consumed);
  const deficit = workoutCaloriesBurned - (consumed - dailyGoal);

  return {
    date: mealEntries[0]?.date || new Date().toISOString().split('T')[0],
    userId: mealEntries[0]?.userId || 'default',
    mealEntries,
    totalCaloriesConsumed: consumed,
    dailyGoal,
    workoutCaloriesBurned,
    totalAllowance,
    remainingCalories,
    deficit,
    fastingWindow: {
      ...fastingWindow,
      adherence: mealEntries.every(meal => meal.withinFastingWindow)
    }
  };
}
