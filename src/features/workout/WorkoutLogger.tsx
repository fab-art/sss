import { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { useProgressionStore } from '../../store/useProgressionStore';
import { nowIso } from '../../lib/date';

export function WorkoutLogger() {
  const completeWorkout = useProgressionStore((state) => state.completeWorkout);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [intensity, setIntensity] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [exercisesCompleted, setExercisesCompleted] = useState(5);
  const [lastAward, setLastAward] = useState<number>();

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

      <div className="mt-6 grid gap-4 md:grid-cols-3">
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
