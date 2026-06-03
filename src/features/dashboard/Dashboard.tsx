import { motion } from 'framer-motion';
import { useState } from 'react';
import { getRankForXp } from '../../domain/ranks';
import { getXpIntoLevel, getXpRequiredForNextLevel } from '../../domain/xp';
import { useProgressionStore } from '../../store/useProgressionStore';
import { useUserStore } from '../../store/useUserStore';
import { MuscleGraphic } from '../../components/MuscleGraphic';
import { Moon, Flame, CheckCircle2, Circle } from 'lucide-react';
import { useNutritionStore } from '../../store/useNutritionStore';
import type { DailyNutritionSummary } from '../../domain/types';

interface DashboardProps {
    onStartTraining?: () => void;
    onViewNutrition?: () => void;
}

export function Dashboard({ onStartTraining, onViewNutrition }: DashboardProps) {
  const { heroName } = useUserStore();
  const { progression, streak, activeQuest, runningProgress, startQuest, syncSteps } = useProgressionStore();
  const { getSummary, protocol } = useNutritionStore();
  const [stepInput, setStepInput] = useState<string>('3842');

  const currentRank = getRankForXp(progression.totalXp);
  const levelProgress = (getXpIntoLevel(progression.totalXp) / getXpRequiredForNextLevel()) * 100;

  const nutritionSummary = getSummary(0) as (DailyNutritionSummary & { targets?: { proteinG: number; carbsG: number; fatG: number } });
  const caloriePercent = nutritionSummary
    ? (nutritionSummary.totalCaloriesConsumed / nutritionSummary.totalAllowance) * 100
    : 0;

  const questProgress = activeQuest
    ? (activeQuest.exercises.filter(ex => ex.state === 'completed').length / activeQuest.exercises.length) * 100
    : 0;

  const currentSteps = parseInt(stepInput) || 0;
  const stepPercent = runningProgress.stepGoal
    ? (currentSteps / runningProgress.stepGoal) * 100
    : 0;

  const handleStart = async () => {
      await startQuest(1);
      onStartTraining?.();
  };

  return (
    <section className="max-w-xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <header className="flex justify-between items-center px-2">
        <div>
            <h1 className="text-xl font-black text-white tracking-tight">HeroPath</h1>
            <p className="text-xs font-bold text-slate-500 uppercase">{currentRank.title} • Rank {activeQuest?.rank || 1}</p>
        </div>
        <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="text-sm font-black text-orange-500">{streak.current} day streak</span>
        </div>
      </header>

      {/* Rank Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2.5rem] bg-slate-900 border border-white/5 p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="text-2xl font-black text-cyan-400">{currentRank.title}</h2>
                    <p className="text-sm font-bold text-slate-400">Level {progression.level} • {getXpIntoLevel(progression.totalXp)}/{getXpRequiredForNextLevel()} XP</p>
                </div>
                <div className="text-xs font-black text-orange-400 uppercase tracking-widest flex items-center gap-1">
                    {heroName}
                </div>
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    className="h-full bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]"
                />
            </div>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl grayscale">{currentRank.emblem}</div>
      </motion.div>

      {/* Today's Quest */}
      <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Today's Quest</h3>
              <span className="text-xs font-bold text-cyan-400">
                  {activeQuest?.exercises.filter(ex => ex.state === 'completed').length || 0} / {activeQuest?.exercises.length || 0} done
              </span>
          </div>
          <div className="rounded-[2.5rem] bg-slate-900 border border-white/5 p-6 space-y-4">
            {!activeQuest ? (
                <button
                  onClick={handleStart}
                  className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition"
                >
                    Start Training
                </button>
            ) : (
                <>
                    <div className="space-y-3">
                        {activeQuest.exercises.map(ex => (
                            <div key={ex.id} className="flex items-center gap-3">
                                {ex.state === 'completed' ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                ) : (
                                    <Circle className="w-5 h-5 text-slate-700" />
                                )}
                                <span className={`text-sm font-bold ${ex.state === 'completed' ? 'text-slate-300' : 'text-white'}`}>
                                    {ex.exerciseType} ({ex.targetReps || ex.targetDistance} {ex.targetReps ? 'reps' : 'm'})
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${questProgress}%` }}
                            className="h-full bg-orange-500"
                        />
                    </div>
                    <button
                        onClick={onStartTraining}
                        className="w-full py-4 rounded-2xl bg-orange-500 text-white font-black shadow-lg shadow-orange-500/20"
                    >
                        Continue Quest
                    </button>
                </>
            )}
          </div>
      </div>

      {/* Steps Goal */}
      <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Daily Steps Goal</h3>
          <div className="rounded-[2.5rem] bg-slate-900 border border-white/5 p-6 flex items-center gap-6">
              <div className="relative w-24 h-24 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                      <motion.circle
                        cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                        strokeDasharray={251.2}
                        initial={{ strokeDashoffset: 251.2 }}
                        animate={{ strokeDashoffset: 251.2 - (251.2 * stepPercent) / 100 }}
                        className="text-cyan-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                      />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <input
                          type="number"
                          value={stepInput}
                          onChange={(e) => setStepInput(e.target.value)}
                          className="w-16 bg-transparent text-center text-lg font-black text-white focus:outline-none"
                      />
                      <span className="text-[10px] font-bold text-slate-500 uppercase">steps</span>
                  </div>
              </div>
              <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-end">
                      <span className="text-sm font-bold text-slate-400">Goal</span>
                      <span className="text-lg font-black text-white">{runningProgress.stepGoal?.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500" style={{ width: `${stepPercent}%` }} />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mt-2">
                    Phase {runningProgress.phase} of 3 • Build the habit
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-[10px] font-bold text-emerald-400">≈ {Math.round(currentSteps * 0.000762 * 10) / 10} km walked</p>
                    <button
                        onClick={() => syncSteps(currentSteps)}
                        className="text-[10px] font-black text-cyan-400 uppercase tracking-widest border border-cyan-400/30 px-2 py-0.5 rounded hover:bg-cyan-400/10 transition"
                    >
                        Sync
                    </button>
                  </div>
              </div>
          </div>
      </div>

      {/* Fasting Card */}
      <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Fasting Window</h3>
              <span className="bg-indigo-500/20 text-indigo-400 text-[10px] font-black px-2 py-0.5 rounded border border-indigo-500/30">
                  {protocol?.protocolType || '16:8'} Protocol
              </span>
          </div>
          <div className="rounded-[2.5rem] bg-slate-900 border border-white/5 p-6 flex items-center gap-6">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-500/30 flex items-center justify-center relative">
                  <Moon className="w-8 h-8 text-indigo-400" />
                  <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin-slow" />
              </div>
              <div className="flex-1">
                  <div className="text-xl font-black text-white">8h 14m fasting</div>
                  <p className="text-xs font-bold text-slate-400">Eating: {protocol?.eatingWindowStart} – {protocol?.eatingWindowEnd}</p>
                  <p className="text-xs font-black text-cyan-400 mt-1">Window opens in 3h 46m</p>
              </div>
          </div>
      </div>

      {/* Calories Card */}
      <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Today's Calories</h3>
              <span className="text-[10px] font-black text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded border border-orange-400/20 uppercase tracking-tighter">
                {nutritionSummary?.totalCaloriesConsumed} / {nutritionSummary?.totalAllowance} kcal
              </span>
          </div>
          <div className="rounded-[2.5rem] bg-slate-900 border border-white/5 p-6 space-y-6">
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${caloriePercent}%` }}
                    className="h-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.4)]"
                  />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                        <span>Protein</span>
                        <span className="text-white">{nutritionSummary?.targets?.proteinG || 0}g</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-pink-500" style={{ width: '40%' }} />
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                        <span>Carbs</span>
                        <span className="text-white">{nutritionSummary?.targets?.carbsG || 0}g</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: '40%' }} />
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                        <span>Fat</span>
                        <span className="text-white">{nutritionSummary?.targets?.fatG || 0}g</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500" style={{ width: '40%' }} />
                    </div>
                </div>
              </div>
              <button
                onClick={onViewNutrition}
                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition"
              >
                  View Nutrition Tracker
              </button>
          </div>
      </div>

      {/* Physique Development */}
      <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Physique Development</h3>
          <div className="rounded-[2.5rem] bg-slate-900 border border-white/5 p-8">
            <MuscleGraphic growth={progression.muscleGrowth} />
            <div className="mt-8 grid grid-cols-2 gap-4">
                {Object.entries(progression.muscleGrowth).map(([muscle, value]) => (
                <div key={muscle} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <span>{muscle}</span>
                    <span className="text-white">{Math.round(value)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        className="h-full rounded-full bg-cyan-500"
                    />
                    </div>
                </div>
                ))}
            </div>
          </div>
      </div>
    </section>
  );
}
