import { motion } from 'framer-motion';
import { getNextRank, getRankForXp } from '../../domain/ranks';
import { getXpIntoLevel, getXpRequiredForNextLevel } from '../../domain/xp';
import { useProgressionStore } from '../../store/useProgressionStore';
import { useUserStore } from '../../store/useUserStore';
import { StatCard } from '../../components/StatCard';

export function Dashboard() {
  const heroName = useUserStore((state) => state.heroName);
  const { progression, streak, workouts } = useProgressionStore();
  const currentRank = getRankForXp(progression.totalXp);
  const nextRank = getNextRank(progression.totalXp);
  const levelProgress = (getXpIntoLevel(progression.totalXp) / getXpRequiredForNextLevel()) * 100;

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

      <div className="grid gap-4 md:grid-cols-4">
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
