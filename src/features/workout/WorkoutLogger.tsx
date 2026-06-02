import { memo, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell } from 'lucide-react';
import { useProgressionStore } from '../../store/useProgressionStore';
import { nowIso } from '../../lib/date';
import { MuscleGraphic } from '../../components/MuscleGraphic';

type ExerciseKey = 'pushups' | 'squats' | 'situps' | 'cardio';

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
      className="relative rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-4 shadow-inner shadow-black/40"
      animate={{ scale: pumpScale }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      <svg
        aria-labelledby={`${exercise.key}-muscle-title`}
        className="mx-auto h-48 w-full max-w-52 drop-shadow-[0_0_18px_rgba(249,115,22,0.18)]"
        role="img"
        viewBox="0 0 160 220"
      >
        <title id={`${exercise.key}-muscle-title`}>{exercise.name} targeted muscle map</title>
        <circle
          className="fill-slate-600 stroke-slate-400/60"
          cx="80"
          cy="24"
          r="15"
          strokeWidth="2"
        />
        <motion.rect
          className={isPushups || isSitups || isCardio ? highlighted : inactiveMuscle}
          height="64"
          rx="24"
          strokeWidth="2"
          width="54"
          x="53"
          y="45"
          animate={{ fillOpacity: isPushups || isSitups || isCardio ? 0.8 : 0.3 }}
        />
        <motion.path
          className={isPushups ? highlighted : inactiveMuscle}
          d="M52 52 C29 58 21 75 18 101 L35 105 C40 83 45 72 58 66 Z"
          strokeWidth="2"
          animate={{ fillOpacity: isPushups ? 0.8 : 0.3 }}
        />
        <motion.path
          className={isPushups ? highlighted : inactiveMuscle}
          d="M108 52 C131 58 139 75 142 101 L125 105 C120 83 115 72 102 66 Z"
          strokeWidth="2"
          animate={{ fillOpacity: isPushups ? 0.8 : 0.3 }}
        />
        <motion.path
          className={isSitups ? highlighted : inactiveMuscle}
          d="M62 64 H98 V106 C92 113 68 113 62 106 Z"
          strokeWidth="2"
          animate={{ fillOpacity: isSitups ? 0.8 : 0.3 }}
        />
        <motion.path
          className={isSquats || isCardio ? highlighted : inactiveMuscle}
          d="M56 113 C51 143 47 170 43 203 H62 C67 173 72 146 78 116 Z"
          strokeWidth="2"
          animate={{ fillOpacity: isSquats || isCardio ? 0.8 : 0.3 }}
        />
        <motion.path
          className={isSquats || isCardio ? highlighted : inactiveMuscle}
          d="M104 113 C109 143 113 170 117 203 H98 C93 173 88 146 82 116 Z"
          strokeWidth="2"
          animate={{ fillOpacity: isSquats || isCardio ? 0.8 : 0.3 }}
        />
        <motion.path
          className={isCardio ? highlighted : inactiveMuscle}
          d="M74 69 C74 61 86 61 86 69 C94 66 101 76 96 86 C92 94 83 99 80 103 C77 99 68 94 64 86 C59 76 66 66 74 69 Z"
          strokeWidth="2"
          animate={{ fillOpacity: isCardio ? 0.8 : 0.3 }}
        />
      </svg>

      <AnimatePresence>
        {repCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-black text-orange-400"
          >
            PUMP!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {exercise.muscles.map((muscle) => (
          <span
            className="rounded-full border border-orange-300/20 bg-orange-300/10 px-3 py-1 text-xs font-bold text-orange-100"
            key={muscle}
          >
            {muscle}
          </span>
        ))}
      </div>
    </motion.div>
  );
});

export function WorkoutLogger() {
  const completeWorkout = useProgressionStore((state) => state.completeWorkout);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [intensity, setIntensity] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [progress, setProgress] = useState<ExerciseProgress>(initialProgress);
  const [activeExerciseKey, setActiveExerciseKey] = useState<ExerciseKey>('pushups');
  const [lastAward, setLastAward] = useState<number>();

  const activeExercise =
    exercisePlan.find((exercise) => exercise.key === activeExerciseKey) ?? exercisePlan[0];
  const completedExercises = useMemo(
    () => exercisePlan.filter((exercise) => progress[exercise.key] >= exercise.target).length,
    [progress]
  );
  const [showSummary, setShowSummary] = useState(false);
  const { progression } = useProgressionStore();

  function updateExercise(exercise: ExercisePlan, value: number) {
    setProgress((current) => ({
      ...current,
      [exercise.key]: clampProgress(value, exercise)
    }));
  }

  async function logWorkout() {
    const workout = await completeWorkout({
      completedAt: nowIso(),
      durationMinutes,
      intensity,
      exercisesCompleted: completedExercises
    });
    setLastAward(workout.xpAwarded);
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-orange-500 p-3 text-white">
          <Dumbbell />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Log a workout</h2>
          <p className="text-sm text-slate-300">
            The store routes this intent through pure domain rules, then persists it locally.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-200">
          Duration minutes
          <input
            className="w-full rounded-2xl border border-white/10 bg-slate-950 p-3 text-white"
            type="number"
            min="1"
            value={durationMinutes}
            onChange={(event) => setDurationMinutes(Number(event.target.value))}
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-200">
          Intensity
          <select
            className="w-full rounded-2xl border border-white/10 bg-slate-950 p-3 text-white"
            value={intensity}
            onChange={(event) => setIntensity(Number(event.target.value) as 1 | 2 | 3 | 4 | 5)}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-200">
          Exercises completed
          <input
            className="w-full rounded-2xl border border-white/10 bg-slate-950 p-3 text-white"
            type="number"
            min="0"
            value={completedExercises}
            readOnly
          />
        </label>
      </div>

      <button
        className="mt-6 w-full rounded-2xl bg-orange-500 px-5 py-4 font-black text-white transition hover:bg-orange-400"
        type="button"
        onClick={logWorkout}
      >
        Complete quest
      </button>
      {lastAward && !showSummary ? (
        <div className="mt-4 flex flex-col items-center gap-2">
           <p className="text-center font-bold text-orange-200">+{lastAward} XP earned</p>
           <button
             onClick={() => setShowSummary(true)}
             className="text-sm font-bold text-orange-400 underline"
           >
             View Physique Gains
           </button>
        </div>
      ) : null}

      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full rounded-[2.5rem] bg-slate-900 border border-orange-500/30 p-8 shadow-2xl"
            >
              <h2 className="text-center text-3xl font-black text-white mb-6">Workout Complete! 🎉</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-center text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Physique Gains</h3>
                  <MuscleGraphic growth={progression.muscleGrowth} />
                </div>

                <div className="rounded-2xl bg-white/5 p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">XP Earned</span>
                    <span className="font-bold text-orange-400">+{lastAward}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Calories Burned</span>
                    <span className="font-bold text-emerald-400">+320 cal</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Trials Completed</span>
                    <span className="font-bold text-white">{progression.workoutsCompleted}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowSummary(false)}
                  className="w-full rounded-2xl bg-orange-500 py-4 font-black text-white hover:bg-orange-400 transition"
                >
                  Return to Dashboard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{activeExercise.name}</h3>
          <span className="text-sm text-slate-400">Target: {activeExercise.target} {activeExercise.unit}</span>
        </div>

        <div className="mb-6 grid grid-cols-4 gap-2">
          {exercisePlan.map((exercise) => (
            <button
              key={exercise.key}
              onClick={() => setActiveExerciseKey(exercise.key)}
              className={`rounded-xl p-2 text-center transition ${
                activeExerciseKey === exercise.key
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <div className="text-xs font-bold">{exercise.name.split(' ')[0]}</div>
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <WorkoutMuscleGraphic exercise={activeExercise} repCount={progress[activeExerciseKey]} />

          <div className="space-y-6">
            <div className="rounded-2xl bg-slate-900/50 p-4 border border-white/5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">Progress</span>
                <span className="text-lg font-black text-white">
                  {progress[activeExercise.key]} / {activeExercise.target}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={activeExercise.target * 2}
                step={activeExercise.unit === 'km' ? 0.1 : 1}
                value={progress[activeExercise.key]}
                onChange={(e) => updateExercise(activeExercise, Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">Form Cue</h4>
              <p className="text-slate-200">{activeExercise.cue}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">Pro Tips</h4>
              <ul className="space-y-2">
                {activeExercise.tips.map((tip, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-300">
                    <span className="text-orange-500 font-bold">{i + 1}.</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
