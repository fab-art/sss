import { db } from '../database';
import type { FastingSession, Meal, NutritionProfile, FoodPreset } from '../../domain/types';

export async function saveMeal(meal: Meal): Promise<void> {
  await db.meals.put(meal);
}

export async function listMealsByDate(date: string): Promise<Meal[]> {
  return db.meals.where('date').equals(date).toArray();
}

export async function deleteMeal(id: string): Promise<void> {
  await db.meals.delete(id);
}

export async function saveFastingSession(session: FastingSession): Promise<void> {
  await db.fastingSessions.put(session);
}

export async function getFastingSessionByDate(date: string): Promise<FastingSession | undefined> {
  return db.fastingSessions.where('date').equals(date).first();
}

export async function saveNutritionProfile(profile: NutritionProfile): Promise<void> {
  await db.nutritionProfile.put(profile);
}

export async function getNutritionProfile(userId: string): Promise<NutritionProfile | undefined> {
  return db.nutritionProfile.get(userId);
}

export async function listFoodPresets(): Promise<FoodPreset[]> {
  return db.foodPresets.toArray();
}

export async function saveFoodPreset(preset: FoodPreset): Promise<void> {
  await db.foodPresets.put(preset);
}
