import { useMemo, useState } from 'react';
import { Activity, Dumbbell, HeartPulse, Info, Minus, Plus, Target } from 'lucide-react';
import { useProgressionStore } from '../../store/useProgressionStore';
import { nowIso } from '../../lib/date';

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

function MuscleGraphic({ exercise }: { exercise: ExercisePlan }) {
  const highlighted = muscleHighlight[exercise.key];
  const isPushups = exercise.key === 'pushups';
  const isSquats = exercise.key === 'squats';
  const isSitups = exercise.key === 'situps';
  const isCardio = exercise.key === 'cardio';

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-4 shadow-inner shadow-black/40">
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
        <rect
          className={isPushups || isSitups || isCardio ? highlighted : inactiveMuscle}
          height="64"
          rx="24"
          strokeWidth="2"
          width="54"
          x="53"
          y="45"
        />
        <path
          className={isPushups ? highlighted : inactiveMuscle}
          d="M52 52 C29 58 21 75 18 101 L35 105 C40 83 45 72 58 66 Z"
          strokeWidth="2"
        />
        <path
          className={isPushups ? highlighted : inactiveMuscle}
          d="M108 52 C131 58 139 75 142 101 L125 105 C120 83 115 72 102 66 Z"
          strokeWidth="2"
        />
        <path
          className={isSitups ? highlighted : inactiveMuscle}
          d="M62 64 H98 V106 C92 113 68 113 62 106 Z"
          strokeWidth="2"
        />
        <path
          className={isSquats || isCardio ? highlighted : inactiveMuscle}
          d="M56 113 C51 143 47 170 43 203 H62 C67 173 72 146 78 116 Z"
          strokeWidth="2"
        />
        <path
          className={isSquats || isCardio ? highlighted : inactiveMuscle}
          d="M104 113 C109 143 113 170 117 203 H98 C93 173 88 146 82 116 Z"
          strokeWidth="2"
        />
        <path
          className={isCardio ? highlighted : inactiveMuscle}
          d="M74 69 C74 61 86 61 86 69 C94 66 101 76 96 86 C92 94 83 99 80 103 C77 99 68 94 64 86 C59 76 66 66 74 69 Z"
          strokeWidth="2"
        />
      </svg>
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
    </div>
  );
}

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
  const totalCompletion = useMemo(() => {
    const ratio = exercisePlan.reduce(
      (total, exercise) => total + Math.min(progress[exercise.key] / exercise.target, 1),
      0
    );

    return Math.round((ratio / exercisePlan.length) * 100);
  }, [progress]);

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
      exercisesCompleted
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
            min="1"
            value={exercisesCompleted}
            onChange={(event) => setExercisesCompleted(Number(event.target.value))}
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
      {lastAward ? (
        <p className="mt-4 text-center font-bold text-orange-200">+{lastAward} XP earned</p>
      ) : null}
    </section>
  );
}
