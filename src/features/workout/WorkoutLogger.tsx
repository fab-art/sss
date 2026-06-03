import { memo, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Info, Trophy, Flame } from 'lucide-react';
import { useProgressionStore } from '../../store/useProgressionStore';
import { MuscleGraphic } from '../../components/MuscleGraphic';

export function QuestRewardModal({ onClose }: { onClose: () => void }) {
  const { progression, activeQuest, streak } = useProgressionStore();

type ExercisePlan = {
  key: ExerciseKey;
  name: string;
  target: number;
  unit: 'reps' | 'km';
  muscles: string[];
  cue: string;
  tips: string[];
};

type ExerciseProgress = Record<ExerciseKey, number>;

const exercisePlan: ExercisePlan[] = [
  {
    key: 'pushups',
    name: 'Push-ups',
    target: 10,
    unit: 'reps',
    muscles: ['Chest', 'Triceps', 'Shoulders', 'Core'],
    cue: 'Brace your core and move as one straight plank.',
    tips: [
      'Set hands just outside shoulder width and stack wrists under shoulders.',
      'Lower until elbows are near 45° from your ribs, then press the floor away.',
      'Keep hips from sagging; stop the set before form breaks.'
    ]
  },
  {
    key: 'squats',
    name: 'Squats',
    target: 15,
    unit: 'reps',
    muscles: ['Quads', 'Glutes', 'Hamstrings', 'Core'],
    cue: 'Sit between your hips with knees tracking over toes.',
    tips: [
      'Plant feet around shoulder width and keep heels rooted.',
      'Brace your torso, send hips back slightly, then bend knees together.',
      'Stand tall by driving through mid-foot without letting knees cave inward.'
    ]
  },
  {
    key: 'situps',
    name: 'Sit-ups',
    target: 12,
    unit: 'reps',
    muscles: ['Abs', 'Hip flexors', 'Obliques'],
    cue: 'Curl up under control instead of yanking your neck.',
    tips: [
      'Keep feet planted and ribs pulled down before the first rep.',
      'Exhale as you rise and think about bringing ribs toward hips.',
      'Lower slowly until shoulders touch, then reset your brace.'
    ]
  },
  {
    key: 'cardio',
    name: 'Cardio run',
    target: 1,
    unit: 'km',
    muscles: ['Heart', 'Glutes', 'Quads', 'Calves'],
    cue: 'Stay conversational and smooth; HeroPath rewards consistency first.',
    tips: [
      'Start at an easy pace for the first few minutes before building rhythm.',
      'Keep chest tall, shoulders relaxed, and steps light under your center of mass.',
      'If breathing spikes, slow to a walk and resume when controlled.'
    ]
  }
];

const initialProgress = exercisePlan.reduce(
  (progress, exercise) => ({ ...progress, [exercise.key]: 0 }),
  {} as ExerciseProgress
);

const muscleHighlight: Record<ExerciseKey, string> = {
  pushups: 'fill-orange-400/80 stroke-orange-200',
  squats: 'fill-cyan-400/75 stroke-cyan-200',
  situps: 'fill-fuchsia-400/75 stroke-fuchsia-200',
  cardio: 'fill-emerald-400/75 stroke-emerald-200'
};

const inactiveMuscle = 'fill-slate-700/70 stroke-slate-500/50';

function clampProgress(value: number, exercise: ExercisePlan) {
  const clamped = Math.min(Math.max(0, value), exercise.target * 2);

  return exercise.unit === 'km' ? Number(clamped.toFixed(1)) : Math.round(clamped);
}

/**
 * Memoized SVG component to prevent expensive re-renders of the muscle map
 * when unrelated WorkoutLogger state (duration, intensity) changes.
 */
const WorkoutMuscleGraphic = memo(function WorkoutMuscleGraphic({
  exercise,
  repCount
}: {
  exercise: ExercisePlan;
  repCount: number;
}) {
  const highlighted = muscleHighlight[exercise.key];
  const isPushups = exercise.key === 'pushups';
  const isSquats = exercise.key === 'squats';
  const isSitups = exercise.key === 'situps';
  const isCardio = exercise.key === 'cardio';

  // "Pump" effect: brief scale up on rep increment
  const pumpScale = repCount > 0 ? 1.05 : 1.0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-md w-full rounded-[3rem] bg-slate-900 border border-orange-500/30 p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10 text-center space-y-6">
            <h2 className="text-4xl font-black text-white leading-tight">QUEST COMPLETE! 🎉</h2>
            <p className="text-orange-400 font-bold uppercase tracking-widest">{activeQuest.questName} Won!</p>

            <div className="py-4">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Physique Hardening</h3>
                <div className="bg-white/5 rounded-[2rem] p-6">
                    <MuscleGraphic growth={progression.muscleGrowth} />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center bg-white/5 rounded-2xl p-4">
                    <div className="text-left">
                        <p className="text-[10px] font-black text-slate-500 uppercase">XP Breakdown</p>
                        <p className="text-xl font-black text-white">+{activeQuest.xpReward} XP</p>
                    </div>
                    <Trophy className="w-8 h-8 text-orange-500" />
                </div>

                <div className="flex justify-between items-center bg-white/5 rounded-2xl p-4">
                    <div className="text-left">
                        <p className="text-[10px] font-black text-slate-500 uppercase">Streak status</p>
                        <p className="text-xl font-black text-white">{streak.current}-Day Streak Ignited!</p>
                    </div>
                    <Flame className="w-8 h-8 text-orange-500 fill-orange-500" />
                </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-5 rounded-2xl bg-orange-500 text-white font-black text-lg shadow-lg shadow-orange-500/30 hover:bg-orange-400 transition"
            >
              Back to Dashboard
            </button>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>
      </motion.div>
    </motion.div>
  );
});

export function WorkoutLogger() {
  const { activeQuest, updateExerciseProgress, completeActiveQuest } = useProgressionStore();
  const [activeExIdx, setActiveExIdx] = useState(0);
  const [showReward, setShowReward] = useState(false);

  if (!activeQuest) return null;

  const activeEx = activeQuest.exercises[activeExIdx];

  const handleCompleteQuest = async () => {
    await completeActiveQuest();
    setShowReward(true);
  };

  const isAllComplete = activeQuest.exercises.every(ex => ex.state === 'completed');

  return (
    <section className="max-w-xl mx-auto min-h-screen bg-black text-white flex flex-col p-6 pb-24">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <button aria-label="Go back" className="p-2 rounded-full bg-white/5 border border-white/10">
            <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
            <h2 className="text-lg font-black tracking-tight">{activeEx.exerciseType.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('-')}</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{activeEx.targetReps ? 'Strength' : 'Endurance'} Focus</p>
        </div>
        <button aria-label="Exercise information" className="p-2 rounded-full bg-white/5 border border-white/10">
            <Info className="w-6 h-6" />
        </button>
      </header>

      {/* Target Progress */}
      <div className="text-center space-y-2 mb-12">
          <p className="text-sm font-bold text-slate-400">Target: {activeEx.targetReps || activeEx.targetDistance} {activeEx.targetReps ? 'reps' : 'm'} for Rank {activeQuest.rank}</p>
          <div className="text-7xl font-black tabular-nums tracking-tighter">
              {activeEx.repsLogged || activeEx.distanceLogged || 0}
              <span className="text-2xl text-slate-600 ml-2">/ {activeEx.targetReps || activeEx.targetDistance}</span>
          </div>
          <div className="max-w-xs mx-auto pt-4">
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((activeEx.repsLogged || activeEx.distanceLogged || 0) / (activeEx.targetReps || activeEx.targetDistance || 1)) * 100}%` }}
                    className="h-full bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]"
                  />
              </div>
          </div>
      </div>

      {/* Live Muscle Silhouette */}
      <div className="flex-1 flex flex-col items-center justify-center py-8">
          <div className="relative w-full max-w-[280px]">
            <MuscleGraphic growth={activeQuest.exercises.reduce((acc, ex) => {
                ex.muscleGroups.forEach(mg => {
                    acc[mg.name] = (acc[mg.name] || 0) + (ex.repsLogged ? (ex.repsLogged / (ex.targetReps || 1)) * mg.growthPercentage : 0);
                });
                return acc;
            }, { chest: 0, core: 0, legs: 0, shoulders: 0, back: 0, cardio: 0 })} />

            <AnimatePresence>
                {(activeEx.repsLogged || 0) > 0 && (
                    <motion.div
                        key={activeEx.repsLogged}
                        initial={{ opacity: 0, scale: 0.5, y: 0 }}
                        animate={{ opacity: 1, scale: 1.5, y: -100 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center text-4xl font-black text-cyan-400 pointer-events-none"
                    >
                        PUMP!
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
          <div className="mt-8 flex gap-2">
              {activeEx.muscleGroups.map(mg => (
                  <span key={mg.name} className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black text-cyan-500 uppercase tracking-widest">
                      {mg.name} +{mg.growthPercentage}%
                  </span>
              ))}
          </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 mt-8">
          <button
            onClick={() => updateExerciseProgress(activeEx.id, (activeEx.repsLogged || 0) + 1)}
            className="col-span-2 py-8 rounded-[2.5rem] bg-slate-900 border border-white/10 flex items-center justify-center text-5xl font-black active:scale-95 transition"
          >
              +
          </button>
          <button
            onClick={() => updateExerciseProgress(activeEx.id, (activeEx.repsLogged || 0) + 5)}
            className="py-4 rounded-2xl bg-white/5 border border-white/10 font-black"
          >
              +5 reps
          </button>
          <button
            onClick={() => updateExerciseProgress(activeEx.id, (activeEx.repsLogged || 0) + 10)}
            className="py-4 rounded-2xl bg-white/5 border border-white/10 font-black"
          >
              +10 reps
          </button>
      </div>

      <div className="mt-8 space-y-4">
          {activeExIdx < activeQuest.exercises.length - 1 ? (
              <button
                onClick={() => setActiveExIdx(activeExIdx + 1)}
                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition"
              >
                  Next Exercise
              </button>
          ) : (
              !isAllComplete && (
                  <button
                    onClick={() => setActiveExIdx(0)}
                    className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition"
                  >
                      Back to First Exercise
                  </button>
              )
          )}

          {isAllComplete && (
              <button
                onClick={handleCompleteQuest}
                className="w-full py-5 rounded-2xl bg-emerald-500 text-white font-black text-lg shadow-xl shadow-emerald-500/20 active:scale-95 transition"
              >
                  Complete Quest
              </button>
          )}
      </div>

      <AnimatePresence>
          {showReward && <QuestRewardModal onClose={() => { setShowReward(false); }} />}
      </AnimatePresence>
    </section>
  );
}
