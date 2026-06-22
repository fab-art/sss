import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNutritionStore } from '../../store/useNutritionStore';
import { Plus, Lightbulb, Trash2, X, Check, Zap } from 'lucide-react';
import type { FoodItem, MealEntry } from '../../domain/types';

export function NutritionTracker() {
  const { mealEntries, removeMeal, logMeal, foodPresets, getSuggestions, protocol, getSummary } = useNutritionStore();
  const [showLogModal, setShowLogModal] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealEntry['mealType']>('lunch');
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);

  const summary = getSummary(0);
  const totalCalories = summary?.totalCaloriesConsumed || 0;
  const calorieGoal = summary?.dailyGoal || 2500;

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
    <section className="max-w-xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <header className="flex justify-between items-end px-2">
        <div>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Fueling Log</p>
            <h2 className="text-3xl font-black text-white tracking-tight">Nutrition</h2>
        </div>
        <div className="text-right">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Today's Total</p>
            <p className="text-xl font-black text-white">{totalCalories} <span className="text-xs text-zinc-500">kcal</span></p>
        </div>
      </header>

      {/* Goal Card */}
      <div className="rounded-[2.5rem] bg-zinc-900 border border-white/5 p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex justify-between items-center">
              <div className="space-y-1">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Daily Target</p>
                  <p className="text-2xl font-black text-white">{calorieGoal} kcal</p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-zinc-800 flex items-center justify-center">
                  <span className="text-xs font-black text-primary">{Math.round((totalCalories / calorieGoal) * 100)}%</span>
              </div>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl grayscale">🥗</div>
      </div>

      {/* Fasting Card */}
      <div className="rounded-[2.5rem] bg-black border border-primary/20 p-6 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Zap className="w-6 h-6 fill-primary/20" />
              </div>
              <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Fasting Window</p>
                  <p className="font-black text-white">{protocol?.eatingWindowStart} – {protocol?.eatingWindowEnd}</p>
              </div>
          </div>
          <div className="text-right">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">{protocol?.protocolType || '16:8'} ACTIVE</p>
          </div>
      </div>

      {/* Meal History */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] px-2">Meals Consumed</h3>
        <AnimatePresence mode="popLayout">
          {mealEntries.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-[2.5rem] border border-dashed border-white/10 p-12 text-center text-zinc-600 bg-white/[0.01]"
            >
              No data logged for today.
            </motion.div>
          ) : (
            mealEntries.map((meal) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="rounded-[2rem] bg-zinc-900 border border-white/5 p-6 flex justify-between items-center shadow-lg"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-3xl shadow-inner border border-white/5">
                      {meal.mealType === 'breakfast' ? '🌅' : meal.mealType === 'lunch' ? '🥘' : meal.mealType === 'dinner' ? '🍽️' : '🍌'}
                  </div>
                  <div>
                      <div className="font-black text-white text-lg capitalize tracking-tight">{meal.mealType}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{meal.timestamp}</span>
                        <span className="text-zinc-800">•</span>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{meal.totalCalories} kcal</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 font-medium">{meal.foods.map(f => f.name).join(', ')}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeMeal(meal.id)}
                  aria-label={`Remove ${meal.mealType} meal`}
                  className="p-3 text-zinc-700 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setShowLogModal(true)}
          className="flex items-center justify-center gap-3 rounded-[2rem] bg-primary py-5 font-black text-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition"
        >
          <Plus className="w-5 h-5" />
          Log Meal
        </button>
        <button
          onClick={() => setShowSuggestions(true)}
          className="flex items-center justify-center gap-3 rounded-[2rem] bg-zinc-800 py-5 font-black text-white text-sm uppercase tracking-widest border border-white/5 hover:bg-zinc-700 transition"
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
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
              >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="max-w-md w-full rounded-[3rem] bg-zinc-950 border border-white/10 p-8 shadow-2xl"
                  >
                      <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black text-white tracking-tight">Suggestions</h2>
                        <button
                          onClick={() => setShowSuggestions(false)}
                          aria-label="Close suggestions modal"
                          className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-8">
                          <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6">
                              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                <Zap className="w-3 h-3 fill-primary" /> Coach Advice
                              </p>
                              {suggestions.length > 0 ? (
                                  <p className="text-sm text-zinc-300 font-medium leading-relaxed">{suggestions[0]}</p>
                              ) : (
                                  <p className="text-sm text-zinc-300 font-medium">Keep it up! Your nutrition is optimized for today.</p>
                              )}
                          </div>

                          <div className="space-y-4">
                              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Recommended combo</h4>
                              <div className="bg-zinc-900 rounded-[2rem] p-6 border border-white/5 shadow-inner">
                                  <div className="flex justify-between items-center mb-2">
                                      <span className="font-black text-white tracking-tight">Balanced Lunch</span>
                                      <span className="text-primary font-black text-sm tracking-tighter">~605 kcal</span>
                                  </div>
                                  <p className="text-xs text-zinc-500 font-medium mb-6">Matoke, Grilled Chicken, Spinach, Beans</p>
                                  <button
                                    onClick={async () => {
                                      const comboFoods = [
                                        foodPresets.find(f => f.id === 'staple-1')!,
                                        foodPresets.find(f => f.id === 'protein-1')!,
                                        foodPresets.find(f => f.id === 'veg-1')!,
                                        foodPresets.find(f => f.id === 'staple-4')!
                                      ].filter(Boolean).map(f => ({ ...f, isRwandanFood: true }));
                                      await logMeal('lunch', comboFoods);
                                      setShowSuggestions(false);
                                    }}
                                    className="w-full py-3 rounded-xl bg-primary text-black font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20"
                                  >
                                    Quick Log This
                                  </button>
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
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-0 z-50 flex flex-col bg-zinc-950"
              >
                  <header className="p-6 flex justify-between items-center border-b border-white/5">
                      <button
                        onClick={() => setShowLogModal(false)}
                        aria-label="Close log meal modal"
                        className="p-2 hover:bg-white/5 rounded-full transition"
                      >
                        <X className="w-6 h-6" />
                      </button>
                      <h2 className="text-xl font-black tracking-tight">Log Fuel</h2>
                      <div className="w-10" />
                  </header>

                  <div className="flex-1 overflow-y-auto p-6 space-y-10">
                      <div className="flex gap-2">
                          {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(type => (
                              <button
                                key={type}
                                onClick={() => setSelectedMealType(type)}
                                aria-pressed={selectedMealType === type}
                                className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${selectedMealType === type ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'bg-white/5 text-zinc-500'}`}
                              >
                                  {type}
                              </button>
                          ))}
                      </div>

                      <div className="space-y-6">
                          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] px-1">Select Items</h3>
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
                                  const isSelected = !!selectedFoods.find(f => f.id === food.id);
                                  return (
                                      <button
                                        key={food.id}
                                        onClick={() => toggleFood(food)}
                                        aria-pressed={isSelected}
                                        aria-label={`Toggle ${food.name}`}
                                        className={`flex justify-between items-center p-6 rounded-3xl border transition-all ${isSelected ? 'bg-primary/10 border-primary/30 scale-[0.98]' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                                      >
                                          <div className="text-left">
                                              <p className="font-black text-white text-lg tracking-tight">{food.name}</p>
                                              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{food.portion} • {food.calories} kcal</p>
                                          </div>
                                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${isSelected ? 'bg-primary text-black' : 'bg-white/5 text-zinc-700'}`}>
                                            {isSelected ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                          </div>
                                      </button>
                                  );
                              })}
                          </div>
                      </div>
                  </div>

                  <footer className="p-8 bg-zinc-900 border-t border-white/5 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
                      <div className="flex justify-between items-center mb-8">
                          <div>
                              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Selected Items</p>
                              <p className="text-2xl font-black text-white">{selectedFoods.length}</p>
                          </div>
                          <div className="text-right">
                              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Total Fuel</p>
                              <p className="text-3xl font-black text-primary tracking-tighter">{selectedFoods.reduce((s, f) => s + f.calories, 0)} <span className="text-sm font-bold text-zinc-500">kcal</span></p>
                          </div>
                      </div>
                      <button
                        onClick={handleLogMeal}
                        disabled={selectedFoods.length === 0}
                        className="w-full py-6 rounded-[2.5rem] bg-primary text-black font-black text-lg uppercase tracking-widest shadow-2xl shadow-primary/30 disabled:opacity-30 transition-all active:scale-95"
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
