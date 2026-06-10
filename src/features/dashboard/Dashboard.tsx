import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getRankForXp } from '../../domain/ranks';
import { getXpIntoLevel, getXpRequiredForNextLevel } from '../../domain/xp';
import { useProgressionStore } from '../../store/useProgressionStore';
import { useUserStore } from '../../store/useUserStore';
import { MuscleGraphic } from '../../components/MuscleGraphic';
import { Flame, Footprints, CheckCircle2, Trophy, Check } from 'lucide-react';
import { useNutritionStore } from '../../store/useNutritionStore';
import type { DailyNutritionSummary } from '../../domain/types';

interface DashboardProps {
    onStartTraining?: () => void;
    onViewNutrition?: () => void;
}

export function Dashboard({ onStartTraining, onViewNutrition }: DashboardProps) {
  const { heroName } = useUserStore();
  const { progression, streak, activeQuest, runningProgress, startQuest, syncSteps } = useProgressionStore();
  const { getSummary } = useNutritionStore();
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    if (isSynced) {
      const timer = setTimeout(() => setIsSynced(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSynced]);

  const currentRank = getRankForXp(progression.totalXp);
  const levelProgress = (getXpIntoLevel(progression.totalXp) / getXpRequiredForNextLevel()) * 100;

  const nutritionSummary = getSummary(0) as (DailyNutritionSummary & { targets?: { proteinG: number; carbsG: number; fatG: number } });
  const caloriePercent = nutritionSummary
    ? (nutritionSummary.totalCaloriesConsumed / nutritionSummary.totalAllowance) * 100
    : 0;


  const currentSteps = activeQuest?.exercises
    .filter(ex => ex.exerciseType === 'walking' || ex.exerciseType === 'footsteps')
    .reduce((acc, ex) => acc + Math.round((ex.distanceLogged || 0) * 1.31), 0) || 0;

  const stepPercent = runningProgress.stepGoal
    ? (currentSteps / runningProgress.stepGoal) * 100
    : 0;

  const handleStart = async () => {
      await startQuest(1);
      onStartTraining?.();
  };

  return (
    <section className="max-w-xl mx-auto space-y-8 pb-24">
      {/* Premium Header */}
      <header className="flex justify-between items-center px-2">
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
                {currentRank.emblem}
            </div>
            <div>
                <h1 className="text-xl font-black text-white tracking-tight leading-none mb-1">{heroName}</h1>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{currentRank.title}</p>
            </div>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900 border border-white/5 rounded-2xl px-4 py-2 shadow-xl">
            <Flame className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-black text-white">{streak.current}d</span>
        </div>
      </header>

      {/* Level Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-[2.5rem] bg-zinc-900 border border-white/5 p-8 relative overflow-hidden shadow-2xl"
      >
        <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Current Progress</p>
                    <h2 className="text-2xl font-black text-white">Level {progression.level}</h2>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">XP to Rank up</p>
                    <p className="text-sm font-bold text-primary">{getXpRequiredForNextLevel() - getXpIntoLevel(progression.totalXp)} XP</p>
                </div>
            </div>
            <div className="h-4 w-full bg-black rounded-full overflow-hidden p-1 border border-white/5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                />
            </div>
        </div>
        <div className="absolute -top-12 -right-8 text-[12rem] font-black text-white/[0.03] pointer-events-none">{progression.level}</div>
      </motion.div>

      {/* Grid of Stats */}
      <div className="grid grid-cols-2 gap-4">
          {/* Steps */}
          <div className="rounded-[2rem] bg-zinc-900 border border-white/5 p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <Footprints className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Steps</span>
              </div>
              <div>
                  <p className="text-2xl font-black text-white">{currentSteps.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Goal: {runningProgress.stepGoal?.toLocaleString()}</p>
              </div>
              <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stepPercent}%` }}
                    className="h-full bg-primary"
                  />
              </div>
              <div className="flex gap-2" aria-live="polite">
                  <button
                    onClick={() => {
                        syncSteps(currentSteps);
                        setIsSynced(true);
                    }}
                    aria-label={isSynced ? "Steps synchronized" : "Synchronize steps to evolution phase"}
                    className={`w-full py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1 ${isSynced ? 'bg-primary text-black' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                  >
                      {isSynced ? (
                          <>
                              <Check className="w-3 h-3" />
                              Synced
                          </>
                      ) : (
                          "Sync to Phase"
                      )}
                  </button>
              </div>
          </div>

          {/* Calories */}
          <div className="rounded-[2rem] bg-zinc-900 border border-white/5 p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center">
                  <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
                    <Flame className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Kcal</span>
              </div>
              <div>
                  <p className="text-2xl font-black text-white">{nutritionSummary?.totalCaloriesConsumed || 0}</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Left: {nutritionSummary?.remainingCalories || 0}</p>
              </div>
              <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${caloriePercent}%` }}
                    className="h-full bg-orange-500"
                  />
              </div>
              <button onClick={onViewNutrition} className="w-full py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition">Log Meal</button>
          </div>
      </div>

      {/* Quest Card */}
      <div className="space-y-4">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] px-2">Active Challenge</h3>
          <div className="rounded-[2.5rem] bg-zinc-900 border border-white/5 p-8 shadow-xl">
            {!activeQuest ? (
                <div className="text-center space-y-6 py-4">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto">
                        <Trophy className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-xl font-black text-white">Daily Quest Ready</h4>
                        <p className="text-sm text-zinc-500 font-medium px-8 text-balance">Complete today's routine to build your physique and rank up.</p>
                    </div>
                    <button
                        onClick={handleStart}
                        className="w-full py-4 rounded-2xl bg-primary text-black font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition"
                    >
                        Begin Training
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h4 className="font-black text-white">{activeQuest.questName}</h4>
                        <span className="text-[10px] font-black text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">Rank {activeQuest.rank}</span>
                    </div>
                    <div className="space-y-3">
                        {activeQuest.exercises.map(ex => (
                            <div key={ex.id} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    {ex.state === 'completed' ? (
                                        <CheckCircle2 className="w-5 h-5 text-primary" />
                                    ) : (
                                        <div className="w-5 h-5 rounded-full border-2 border-zinc-800" />
                                    )}
                                    <span className={`text-sm font-black ${ex.state === 'completed' ? 'text-zinc-500 line-through' : 'text-white'}`}>
                                        {ex.exerciseType.split('-').join(' ')}
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold text-zinc-500 uppercase">{ex.targetReps || ex.targetDistance} {ex.targetReps ? 'reps' : 'm'}</span>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={onStartTraining}
                        className="w-full py-4 rounded-2xl bg-zinc-800 text-white font-black text-sm uppercase tracking-widest border border-white/10 hover:bg-zinc-700 transition"
                    >
                        Continue Quest
                    </button>
                </div>
            )}
          </div>
      </div>

      {/* Physique Card */}
      <div className="space-y-4">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] px-2">Physique Status</h3>
          <div className="rounded-[2.5rem] bg-zinc-900 border border-white/5 p-8 shadow-xl">
            <div className="bg-black/50 rounded-[2rem] p-6 mb-8 border border-white/5">
                <MuscleGraphic growth={progression.muscleGrowth} />
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {Object.entries(progression.muscleGrowth).map(([muscle, value]) => (
                <div key={muscle} className="space-y-1">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-zinc-500">
                        <span>{muscle}</span>
                        <span className="text-white">{Math.round(value)}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-black">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        className="h-full rounded-full bg-primary"
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
