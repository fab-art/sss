import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Info, Trophy, ChevronRight, Zap, Target } from 'lucide-react';
import { useProgressionStore } from '../../store/useProgressionStore';
import { MuscleGraphic } from '../../components/MuscleGraphic';
import type { MuscleGrowth } from '../../domain/types';

export function QuestRewardModal({ onClose }: { onClose: () => void }) {
  const { progression, activeQuest, streak } = useProgressionStore();

  if (!activeQuest) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-md w-full rounded-[3.5rem] bg-zinc-900 border border-primary/30 p-10 shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10 text-center space-y-8">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-2 border border-primary/20">
            <Trophy className="w-10 h-10 text-primary shadow-[0_0_20px_rgba(34,197,94,0.3)]" />
          </div>

          <div>
            <h2 className="text-4xl font-black text-white leading-tight mb-2 uppercase tracking-tighter italic">Victory!</h2>
            <p className="text-primary font-black uppercase tracking-[0.3em] text-xs">Mission Accomplished</p>
          </div>

          <div className="py-2">
            <div className="bg-black/40 rounded-[2.5rem] p-8 border border-white/5 shadow-inner">
              <MuscleGraphic growth={progression.muscleGrowth} />
            </div>
            <p className="mt-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Physique Adaptation Active</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-800/50 rounded-3xl p-5 border border-white/5">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">XP Earned</p>
                <p className="text-2xl font-black text-white">+{activeQuest.xpReward}</p>
            </div>

            <div className="bg-zinc-800/50 rounded-3xl p-5 border border-white/5">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Streak</p>
                <p className="text-2xl font-black text-primary italic">{streak.current}d</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-6 rounded-[2rem] bg-primary text-black font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Acknowledge
          </button>
        </div>

        {/* Decorative accents */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500 rounded-full blur-[100px]" />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function WorkoutLogger() {
  const { activeQuest, updateExerciseProgress, completeActiveQuest } = useProgressionStore();
  const [activeExIdx, setActiveExIdx] = useState(0);
  const [showReward, setShowReward] = useState(false);

  // Performance: Memoize growth projection to prevent redundant O(E*M) calculations
  // E = number of exercises, M = number of muscle groups per exercise.
  // This stabilizes the reference for the memoized MuscleGraphic component.
  const projectedGrowth = useMemo(() => {
    if (!activeQuest) return null;
    return activeQuest.exercises.reduce((acc, ex) => {
      ex.muscleGroups.forEach(mg => {
        acc[mg.name] = (acc[mg.name] || 0) + (ex.repsLogged ? (ex.repsLogged / (ex.targetReps || 1)) * mg.growthPercentage : 0);
      });
      return acc;
    }, { chest: 0, core: 0, legs: 0, shoulders: 0, back: 0, cardio: 0 } as MuscleGrowth);
  }, [activeQuest]);

  if (!activeQuest) return null;

  const activeEx = activeQuest.exercises[activeExIdx];

  const handleCompleteQuest = async () => {
    await completeActiveQuest();
    setShowReward(true);
  };

  const isAllComplete = activeQuest.exercises.every(ex => ex.state === 'completed');
  const progressPercent = ((activeEx.repsLogged || activeEx.distanceLogged || 0) / (activeEx.targetReps || activeEx.targetDistance || 1)) * 100;

  return (
    <section className="max-w-xl mx-auto min-h-screen bg-black text-white flex flex-col p-6 pb-24 font-sans">
      {/* Premium Header */}
      <header className="flex justify-between items-center mb-10">
        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center">
            <Target className="w-5 h-5 text-zinc-500" />
        </div>
        <div className="text-center">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Protocol {activeQuest.rank}</p>
            <h2 className="text-xl font-black tracking-tighter uppercase italic">{activeEx.exerciseType.split('-').join(' ')}</h2>
        </div>
        <button aria-label="Exercise information" className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition">
            <Info className="w-5 h-5" />
        </button>
      </header>

      {/* Hero Progress Display */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
          <div className="relative w-72 h-72 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90 scale-110">
                  <circle cx="144" cy="144" r="130" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-zinc-900" />
                  <motion.circle
                    cx="144" cy="144" r="130" stroke="currentColor" strokeWidth="8" fill="transparent"
                    strokeDasharray={816.8}
                    initial={{ strokeDashoffset: 816.8 }}
                    animate={{ strokeDashoffset: 816.8 - (816.8 * Math.min(100, progressPercent)) / 100 }}
                    strokeLinecap="round"
                    className="text-primary drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                  />
              </svg>
              <div className="text-center z-10">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-2">Logged</p>
                  <div className="text-8xl font-black tracking-tighter italic leading-none tabular-nums">
                      {activeEx.repsLogged || activeEx.distanceLogged || 0}
                  </div>
                  <p className="text-sm font-bold text-zinc-600 mt-4 uppercase tracking-widest">Target {activeEx.targetReps || activeEx.targetDistance}</p>
              </div>
          </div>

          <div className="w-full max-w-[280px] bg-zinc-900/50 rounded-[2.5rem] p-8 border border-white/5">
                {projectedGrowth && <MuscleGraphic growth={projectedGrowth} />}
          </div>
      </div>

      {/* Control Module */}
      <div className="space-y-6 mt-12">
          <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => updateExerciseProgress(activeEx.id, (activeEx.repsLogged || 0) + 1)}
                className="col-span-1 py-8 rounded-3xl bg-zinc-900 border border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-zinc-800 active:scale-95 transition-all"
              >
                  <span className="text-3xl font-black text-primary">+1</span>
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Single</span>
              </button>
              <button
                onClick={() => updateExerciseProgress(activeEx.id, (activeEx.repsLogged || 0) + 5)}
                className="col-span-1 py-8 rounded-3xl bg-zinc-900 border border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-zinc-800 active:scale-95 transition-all"
              >
                  <span className="text-3xl font-black text-white">+5</span>
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Burst</span>
              </button>
              <button
                onClick={() => updateExerciseProgress(activeEx.id, (activeEx.repsLogged || 0) + 10)}
                className="col-span-1 py-8 rounded-3xl bg-primary flex flex-col items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-primary/20"
              >
                  <span className="text-3xl font-black text-black">+10</span>
                  <span className="text-[9px] font-black text-black/50 uppercase tracking-widest">Max</span>
              </button>
          </div>

          <div className="flex gap-3">
              {activeExIdx > 0 && (
                  <button
                    onClick={() => setActiveExIdx(activeExIdx - 1)}
                    className="flex-1 py-5 rounded-[2rem] bg-zinc-900 border border-white/5 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                  >
                      <ChevronLeft className="w-4 h-4" /> Prev
                  </button>
              )}

              {activeExIdx < activeQuest.exercises.length - 1 ? (
                  <button
                    onClick={() => setActiveExIdx(activeExIdx + 1)}
                    className="flex-[2] py-5 rounded-[2rem] bg-zinc-100 text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl"
                  >
                      Next Phase <ChevronRight className="w-4 h-4" />
                  </button>
              ) : (
                  isAllComplete && (
                      <button
                        onClick={handleCompleteQuest}
                        className="flex-[2] py-5 rounded-[2rem] bg-primary text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-2xl shadow-primary/30 animate-pulse"
                      >
                          Extract Rewards <Zap className="w-4 h-4 fill-black" />
                      </button>
                  )
              )}
          </div>
      </div>

      <AnimatePresence>
          {showReward && <QuestRewardModal onClose={() => { setShowReward(false); }} />}
      </AnimatePresence>
    </section>
  );
}
