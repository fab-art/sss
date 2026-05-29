import { AchievementList } from '../features/achievements/AchievementList';
import { Dashboard } from '../features/dashboard/Dashboard';
import { Onboarding } from '../features/onboarding/Onboarding';
import { ProfilePanel } from '../features/profile/ProfilePanel';
import { WorkoutLogger } from '../features/workout/WorkoutLogger';
import { useHydrateProgression } from '../hooks/useHydrateProgression';
import { useProgressionStore } from '../store/useProgressionStore';
import { useUserStore } from '../store/useUserStore';

export function App() {
  const hasCompletedOnboarding = useUserStore((state) => state.hasCompletedOnboarding);
  const isHydrated = useProgressionStore((state) => state.isHydrated);
  useHydrateProgression();

  if (!hasCompletedOnboarding) {
    return <Onboarding />;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.25),_transparent_28rem),#030712] p-4 text-slate-100 md:p-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          {!isHydrated ? <p className="rounded-2xl bg-white/10 p-4 text-slate-300">Loading local HeroPath data…</p> : null}
          <Dashboard />
          <WorkoutLogger />
          <AchievementList />
        </div>
        <ProfilePanel />
      </div>
    </main>
  );
}
