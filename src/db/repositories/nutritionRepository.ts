import { db } from '../database';
import type {
  MealEntry,
  FastingProtocol,
  RwandanFoodPreset
} from '../../domain/types';

// V2 Meal Entries
export async function saveMealEntry(entry: MealEntry): Promise<void> {
  await db.mealEntries.put(entry);
}

export async function listMealEntriesByDate(date: string): Promise<MealEntry[]> {
  return db.mealEntries.where('date').equals(date).toArray();
}

export async function deleteMealEntry(id: string): Promise<void> {
  await db.mealEntries.delete(id);
}

// V2 Fasting Protocols
export async function saveFastingProtocol(protocol: FastingProtocol): Promise<void> {
  await db.fastingProtocols.put(protocol);
}

export async function getFastingProtocol(userId: string = 'default'): Promise<FastingProtocol | undefined> {
  return db.fastingProtocols.get(userId);
}

// V2 Rwandan Food Presets
export async function listRwandanFoodPresets(): Promise<RwandanFoodPreset[]> {
  return db.rwandanFoodPresets.toArray();
}

export async function saveRwandanFoodPreset(preset: RwandanFoodPreset): Promise<void> {
  await db.rwandanFoodPresets.put(preset);
}

export async function bulkSaveRwandanFoodPresets(presets: RwandanFoodPreset[]): Promise<void> {
  await db.rwandanFoodPresets.bulkPut(presets);
}
