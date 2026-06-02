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
      exercisesCompleted: Math.max(1, completedExercises)
    });
    setLastAward(workout.xpAwarded);
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-orange-500 p-3 text-white shadow-lg shadow-orange-500/30">
            <Dumbbell />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-orange-200">
              Workout page
            </p>
            <h2 className="text-2xl font-black text-white">Track today&apos;s quest</h2>
            <p className="text-sm text-slate-300">
              Count every exercise, study the target muscles, and review form cues before you claim
              XP.
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-orange-300/20 bg-orange-300/10 px-4 py-3 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-200">
            Total progress
          </p>
          <p className="text-3xl font-black text-white">{totalCompletion}%</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-200">
          Duration minutes
          <input
            className="w-full rounded-2xl border border-white/10 bg-slate-950 p-3 text-white"
            min="1"
            type="number"
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
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          {exercisePlan.map((exercise) => {
            const current = progress[exercise.key];
            const percent = Math.min((current / exercise.target) * 100, 100);
            const isActive = exercise.key === activeExercise.key;

            return (
              <article
                className={`rounded-[1.5rem] border p-4 transition ${
                  isActive
                    ? 'border-orange-300/40 bg-orange-300/10 shadow-lg shadow-orange-500/10'
                    : 'border-white/10 bg-slate-950/50'
                }`}
                key={exercise.key}
              >
                <button
                  className="w-full text-left"
                  type="button"
                  onClick={() => setActiveExerciseKey(exercise.key)}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black text-white">{exercise.name}</h3>
                      <p className="text-sm text-slate-300">{exercise.cue}</p>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-orange-100">
                      {current} / {exercise.target} {exercise.unit}
                    </span>
                  </div>
                </button>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-900">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-300 to-cyan-300 shadow-[0_0_18px_rgba(251,146,60,0.75)] transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    aria-label={`Decrease ${exercise.name}`}
                    className="rounded-xl border border-white/10 bg-white/10 p-3 text-white transition hover:bg-white/20"
                    type="button"
                    onClick={() =>
                      updateExercise(exercise, current - (exercise.unit === 'km' ? 0.1 : 1))
                    }
                  >
                    <Minus size={18} />
                  </button>
                  <input
                    aria-label={`${exercise.name} progress`}
                    className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-950 p-3 text-center font-black text-white"
                    min="0"
                    step={exercise.unit === 'km' ? '0.1' : '1'}
                    type="number"
                    value={current}
                    onChange={(event) => updateExercise(exercise, Number(event.target.value))}
                  />
                  <button
                    aria-label={`Increase ${exercise.name}`}
                    className="rounded-xl border border-orange-300/30 bg-orange-500/80 p-3 text-white transition hover:bg-orange-400"
                    type="button"
                    onClick={() =>
                      updateExercise(exercise, current + (exercise.unit === 'km' ? 0.1 : 1))
                    }
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="space-y-4 rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-400/20 p-3 text-cyan-100">
              <Activity />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-200">
                Muscle intel
              </p>
              <h3 className="text-xl font-black text-white">{activeExercise.name}</h3>
            </div>
          </div>

          <MuscleGraphic exercise={activeExercise} />

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-orange-100">
              <Info size={18} />
              <h4 className="font-black">Correct form tips</h4>
            </div>
            <ul className="space-y-3 text-sm text-slate-200">
              {activeExercise.tips.map((tip) => (
                <li className="flex gap-3" key={tip}>
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-300 shadow-[0_0_10px_rgba(253,186,116,0.8)]" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
              <div className="flex items-center gap-2 text-emerald-100">
                <Target size={18} />
                <span className="font-black">Completed exercises</span>
              </div>
              <p className="mt-2 text-3xl font-black text-white">
                {completedExercises}/{exercisePlan.length}
              </p>
            </div>
            <div className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/10 p-4">
              <div className="flex items-center gap-2 text-fuchsia-100">
                <HeartPulse size={18} />
                <span className="font-black">Safety rule</span>
              </div>
              <p className="mt-2 text-sm text-slate-200">Stop early if pain changes your form.</p>
            </div>
          </div>
        </aside>
      </div>

      <button
        className="mt-6 w-full rounded-2xl bg-orange-500 px-5 py-4 font-black text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-400"
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
