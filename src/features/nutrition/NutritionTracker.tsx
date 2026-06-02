import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNutritionStore } from '../../store/useNutritionStore';
import { Plus, Lightbulb, Trash2 } from 'lucide-react';

export function NutritionTracker() {
  const { meals, removeMeal, addMeal } = useNutritionStore();
  const [showSoon, setShowSoon] = useState(false);

  const totalCalories = useMemo(() => meals.reduce((sum, m) => sum + m.calories, 0), [meals]);

  useEffect(() => {
    if (showSoon) {
      const timer = setTimeout(() => setShowSoon(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSoon]);

  const quickAddMeal = () => {
    addMeal({
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toLocaleTimeString(),
      foodName: 'Quick Snack',
      servingSize: '1 portion',
      calories: 250,
      protein: 10,
      carbs: 30,
      fat: 8,
      foodCategory: 'snack',
      source: 'manual'
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-white">Nutrition Log</h2>
        <div className="text-slate-400 text-sm font-bold">Today: {totalCalories} cal</div>
      </div>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {meals.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-3xl border border-dashed border-white/10 p-12 text-center text-slate-500"
            >
              No meals logged yet today.
            </motion.div>
          ) : (
            meals.map((meal) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="rounded-2xl bg-white/5 border border-white/10 p-4 flex justify-between items-center"
              >
                <div>
                  <div className="font-bold text-white">{meal.foodName}</div>
                  <div className="text-xs text-slate-400">
                    {meal.timestamp} • {meal.calories} cal | P: {meal.protein}g C: {meal.carbs}g F: {meal.fat}g
                  </div>
                </div>
                <button
                  onClick={() => removeMeal(meal.id)}
                  aria-label={`Remove ${meal.foodName}`}
                  className="p-2 text-slate-500 hover:text-red-400 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={quickAddMeal}
          className="flex items-center justify-center gap-2 rounded-2xl bg-ember p-4 font-black text-white hover:bg-orange-400 transition"
        >
          <Plus className="w-5 h-5" />
          Log Meal
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 p-4 font-black text-white hover:bg-indigo-500 transition disabled:opacity-50"
          onClick={() => setShowSoon(true)}
          disabled={showSoon}
        >
          <Lightbulb className="w-5 h-5" />
          {showSoon ? 'Coming Soon!' : 'Suggestions'}
        </motion.button>
      </div>
    </section>
  );
}
