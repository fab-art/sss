import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNutritionStore } from '../../store/useNutritionStore';
import { Plus, Lightbulb, Trash2, X, Check } from 'lucide-react';
import type { FoodItem, MealEntry } from '../../domain/types';

export function NutritionTracker() {
  const { mealEntries, removeMeal, logMeal, foodPresets, getSuggestions, protocol, getSummary } = useNutritionStore();
  const [showLogModal, setShowLogModal] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealEntry['mealType']>('lunch');
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);

  const summary = getSummary(0);
  const totalCalories = summary?.totalCaloriesConsumed || 0;

  const toggleFood = (food: FoodItem) => {
    if (selectedFoods.find(f => f.id === food.id)) {
      setSelectedFoods(selectedFoods.filter(f => f.id !== food.id));
    } else {
      setSelectedFoods([...selectedFoods, food]);
    }
  };

  const handleLogMeal = async () => {
    if (selectedFoods.length === 0) return;
    await logMeal(selectedMealType, selectedFoods);
    setShowLogModal(false);
    setSelectedFoods([]);
  };

  const suggestions = getSuggestions();

  return (
    <section className="max-w-xl mx-auto space-y-6 pb-24 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-white tracking-tight">Nutrition Log</h2>
        <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Today: {totalCalories} cal</div>
      </div>

      {/* Fasting Window Status */}
      <div className="rounded-3xl bg-slate-900 border border-indigo-500/20 p-6">
          <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  Fasting Window Status
              </h3>
              <span className="text-xs font-bold text-slate-500">{protocol?.protocolType || '16:8'} Protocol</span>
          </div>
          <div className="flex justify-between items-end">
              <div>
                  <p className="text-xs font-bold text-slate-400">Eating window</p>
                  <p className="text-lg font-black text-white">{protocol?.eatingWindowStart || '12:00'} – {protocol?.eatingWindowEnd || '20:00'}</p>
              </div>
              <div className="text-right">
                  <p className="text-xs font-bold text-slate-400">Time remaining</p>
                  <p className="text-lg font-black text-cyan-400">7:15 hrs</p>
              </div>
          </div>
      </div>

      {/* Meal History */}
      <div className="space-y-4">
        {mealEntries.length === 0 ? (
          <div className="rounded-[2.5rem] border border-dashed border-white/5 p-12 text-center text-slate-500 bg-white/[0.02]">
            No meals logged yet today.
          </div>
        ) : (
          mealEntries.map((meal) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-[2rem] bg-slate-900 border border-white/5 p-5 flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-2xl">
                    {meal.mealType === 'breakfast' ? '🌅' : meal.mealType === 'lunch' ? '🥘' : meal.mealType === 'dinner' ? '🍽️' : '🍌'}
                </div>
                <div>
                    <div className="font-black text-white text-lg capitalize">{meal.mealType}</div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        {meal.timestamp} • {meal.totalCalories} cal • {meal.withinFastingWindow ? '✓ In Window' : '⚠️ Outside Window'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{meal.foods.map(f => f.name).join(', ')}</p>
                </div>
              </div>
              <button
                onClick={() => removeMeal(meal.id)}
                aria-label={`Remove ${meal.mealType} meal`}
                className="p-3 text-slate-600 hover:text-red-400 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setShowLogModal(true)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 p-5 font-black text-white shadow-lg shadow-orange-500/20 hover:bg-orange-400 transition"
        >
          <Plus className="w-5 h-5" />
          Log Meal
        </button>
        <button
          onClick={() => setShowSuggestions(true)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 p-5 font-black text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition"
        >
          <Lightbulb className="w-5 h-5" />
          Suggestions
        </button>
      </div>

      {/* Suggestions Modal */}
      <AnimatePresence>
          {showSuggestions && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
              >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="max-w-md w-full rounded-[3rem] bg-slate-900 border border-indigo-500/30 p-8 shadow-2xl"
                  >
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black text-white tracking-tight">AI Smart Suggestions</h2>
                        <button onClick={() => setShowSuggestions(false)} className="p-2 bg-white/5 rounded-full"><X className="w-5 h-5" /></button>
                      </div>

                      <div className="space-y-6">
                          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4">
                              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Coach Note</p>
                              {suggestions.length > 0 ? (
                                  <p className="text-sm text-slate-300">{suggestions[0]}</p>
                              ) : (
                                  <p className="text-sm text-slate-300">Keep it up! Your nutrition is looking great today.</p>
                              )}
                          </div>

                          <div className="space-y-4">
                              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Recommended combos</h4>
                              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                  <div className="flex justify-between items-center mb-2">
                                      <span className="font-bold text-white">Balanced Lunch</span>
                                      <span className="text-emerald-400 font-black text-sm">~605 cal</span>
                                  </div>
                                  <p className="text-xs text-slate-400">Matoke, Grilled Chicken, Spinach, Beans</p>
                                  <button className="w-full mt-4 py-2 rounded-xl bg-indigo-500/20 text-indigo-400 font-bold text-xs">Quick Log This</button>
                              </div>
                          </div>
                      </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>

      {/* Log Meal Modal */}
      <AnimatePresence>
          {showLogModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex flex-col bg-slate-950"
              >
                  <header className="p-6 flex justify-between items-center border-b border-white/5">
                      <button onClick={() => setShowLogModal(false)} aria-label="Close" className="p-2"><X className="w-6 h-6" /></button>
                      <h2 className="text-xl font-black tracking-tight">Log a Meal</h2>
                      <div className="w-10" />
                  </header>

                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                      <div className="flex gap-2">
                          {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(type => (
                              <button
                                key={type}
                                onClick={() => setSelectedMealType(type)}
                                className={`flex-1 py-3 rounded-2xl font-black text-xs capitalize transition ${selectedMealType === type ? 'bg-orange-500 text-white' : 'bg-white/5 text-slate-500'}`}
                              >
                                  {type}
                              </button>
                          ))}
                      </div>

                      <div className="space-y-4">
                          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Select Foods</h3>
                          <div className="grid gap-3">
                              {foodPresets.map(preset => {
                                  const food: FoodItem = {
                                      id: preset.id,
                                      name: preset.name,
                                      category: preset.category,
                                      calories: preset.calories,
                                      portion: preset.portion,
                                      isRwandanFood: true
                                  };
                                  const isSelected = selectedFoods.find(f => f.id === food.id);
                                  return (
                                      <button
                                        key={food.id}
                                        onClick={() => toggleFood(food)}
                                        className={`flex justify-between items-center p-5 rounded-2xl border transition ${isSelected ? 'bg-orange-500/10 border-orange-500/30' : 'bg-white/5 border-white/5'}`}
                                      >
                                          <div className="text-left">
                                              <p className="font-black text-white">{food.name}</p>
                                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{food.portion} • {food.calories} cal</p>
                                          </div>
                                          {isSelected ? <Check className="w-5 h-5 text-orange-500" /> : <Plus className="w-5 h-5 text-slate-700" />}
                                      </button>
                                  );
                              })}
                          </div>
                      </div>
                  </div>

                  <footer className="p-6 bg-slate-900 border-t border-white/5">
                      <div className="flex justify-between items-center mb-6">
                          <div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Selected</p>
                              <p className="font-black text-white">{selectedFoods.length} items</p>
                          </div>
                          <div className="text-right">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total</p>
                              <p className="text-2xl font-black text-orange-500">{selectedFoods.reduce((s, f) => s + f.calories, 0)} cal</p>
                          </div>
                      </div>
                      <button
                        onClick={handleLogMeal}
                        disabled={selectedFoods.length === 0}
                        className="w-full py-5 rounded-[2rem] bg-orange-500 text-white font-black text-lg shadow-xl shadow-orange-500/20 disabled:opacity-50"
                      >
                          Confirm & Log
                      </button>
                  </footer>
              </motion.div>
          )}
      </AnimatePresence>
    </section>
  );
}
