import { motion } from 'framer-motion';
import { getNextRank, getRankForXp } from '../../domain/ranks';
import { getXpIntoLevel, getXpRequiredForNextLevel } from '../../domain/xp';
import { useProgressionStore } from '../../store/useProgressionStore';
import { useUserStore } from '../../store/useUserStore';
import { StatCard } from '../../components/StatCard';
import { MuscleGraphic } from '../../components/MuscleGraphic';
import { Utensils, Moon } from 'lucide-react';
import { useNutritionStore } from '../../store/useNutritionStore';

export function Dashboard() {
  const heroName = useUserStore((state) => state.heroName);
  const { progression, streak, workouts } = useProgressionStore();
  const { getSummary, fastingSession, profile } = useNutritionStore();

  const currentRank = getRankForXp(progression.totalXp);
  const nextRank = getNextRank(progression.totalXp);
  const levelProgress = (getXpIntoLevel(progression.totalXp) / getXpRequiredForNextLevel()) * 100;

  const nutritionSummary = getSummary(0); // Assuming 0 workout cals for dashboard view
  const caloriePercent = nutritionSummary
    ? (nutritionSummary.caloriesConsumed / (nutritionSummary.caloriesConsumed + Math.max(0, nutritionSummary.calorieDeficit))) * 100
    : 0;

  return (
    <section className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[2rem] border border-orange-300/20 bg-gradient-to-br from-orange-500/25 via-slate-900 to-indigo-950 p-8 shadow-2xl shadow-orange-950/40"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-200">
          HeroPath
        </p>
        <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black text-white md:text-6xl">Forge ahead, {heroName}.</h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-300">
              Complete workouts, protect your streak, and climb from Initiate to Legend — fully
              offline on this device.
            </p>
          </div>
          <div className="rounded-3xl bg-black/30 p-5 text-center ring-1 ring-white/10">
            <div className="text-5xl">{currentRank.emblem}</div>
            <p className="mt-2 text-xl font-bold text-white">{currentRank.title}</p>
            <p className="text-sm text-slate-300">Level {progression.level}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-400" />
            Fasting Window
          </h2>
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-slate-400">{profile?.preferredIfProtocol || '16:8'} Protocol</span>
              <span className="text-xs font-black uppercase tracking-widest text-indigo-400">
                {fastingSession?.completedSuccessfully ? 'Completed' : 'Active'}
              </span>
            </div>
            <div className="text-3xl font-black text-white mb-2">
              {fastingSession ? `${fastingSession.totalFastingHours}h goal` : 'No active fast'}
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div
                 initial={{ width: 0 }}
                 animate={{ width: fastingSession?.completedSuccessfully ? '100%' : '65%' }}
                 className="h-full bg-indigo-500"
               />
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Starts: {profile?.eatingWindowEnd || '20:00'} | Ends: {profile?.eatingWindowStart || '12:00'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Utensils className="w-5 h-5 text-ember" />
            Daily Nutrition
          </h2>
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-400">Calories</span>
              <span className="text-sm font-bold text-white">
                {nutritionSummary?.caloriesConsumed || 0} / {nutritionSummary ? (nutritionSummary.caloriesConsumed + Math.max(0, nutritionSummary.calorieDeficit)) : 2000}
              </span>
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden mb-6">
               <motion.div
                 initial={{ width: 0 }}
                 animate={{ width: `${caloriePercent}%` }}
                 className="h-full bg-ember"
               />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-500">Protein</div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-500" style={{ width: `${Math.min(100, ((nutritionSummary?.proteinConsumed || 0) / (nutritionSummary?.proteinTarget || 1)) * 100)}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-500">Carbs</div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, ((nutritionSummary?.carbsConsumed || 0) / (nutritionSummary?.carbsTarget || 1)) * 100)}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-500">Fat</div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: `${Math.min(100, ((nutritionSummary?.fatConsumed || 0) / (nutritionSummary?.fatTarget || 1)) * 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Physique Development</h2>
          <MuscleGraphic growth={progression.muscleGrowth} />
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(progression.muscleGrowth).map(([muscle, value]) => (
              <div key={muscle} className="space-y-1">
                <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-slate-400">
                  <span>{muscle}</span>
                  <span>{Math.round(value)}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    className="h-full rounded-full bg-orange-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Trial Stats</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Total XP"
              value={progression.totalXp}
              detail={
                nextRank
                  ? `${nextRank.minXp - progression.totalXp} XP to ${nextRank.title}`
                  : 'Max rank achieved'
              }
            />
            <StatCard
              label="Streak"
              value={`${streak.current} days`}
              detail={`Best: ${streak.longest} days`}
            />
            <StatCard
              label="Workouts"
              value={progression.workoutsCompleted}
              detail="Trials completed"
            />
            <StatCard
              label="Latest XP"
              value={workouts[0]?.xpAwarded ?? 0}
              detail="From your last workout"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Level progress</h2>
            <p className="text-sm text-slate-400">
              {getXpIntoLevel(progression.totalXp)} / {getXpRequiredForNextLevel()} XP
            </p>
          </div>
          <span className="text-sm font-semibold text-orange-200">Level {progression.level}</span>
        </div>
        <div className="mt-4 h-4 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            className="h-full rounded-full bg-gradient-to-r from-orange-400 to-yellow-300"
          />
        </div>
      </div>
    </section>
  );
}
