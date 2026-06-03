import { useState } from 'react';
import { AchievementList } from '../features/achievements/AchievementList';
import { Dashboard } from '../features/dashboard/Dashboard';
import { Onboarding } from '../features/onboarding/Onboarding';
import { ProfilePanel } from '../features/profile/ProfilePanel';
import { WorkoutLogger } from '../features/workout/WorkoutLogger';
import { NutritionTracker } from '../features/nutrition/NutritionTracker';
import { useHydrateProgression } from '../hooks/useHydrateProgression';
import { useProgressionStore } from '../store/useProgressionStore';
import { useUserStore } from '../store/useUserStore';
import { useNutritionStore } from '../store/useNutritionStore';
import { Home, Dumbbell, Utensils, Trophy, User } from 'lucide-react';

export function App() {
  const hasCompletedOnboarding = useUserStore((state) => state.hasCompletedOnboarding);
  const isProgressionHydrated = useProgressionStore((state) => state.isHydrated);
  const isNutritionHydrated = useNutritionStore((state) => state.isHydrated);
  const isHydrated = isProgressionHydrated && isNutritionHydrated;
  const [activeTab, setActiveTab] = useState<'home' | 'train' | 'nutrition' | 'wins' | 'profile'>('home');

  useHydrateProgression();

  if (!hasCompletedOnboarding) {
    return <Onboarding />;
  }

  const navigateToTrain = () => setActiveTab('train');
  const navigateToNutrition = () => setActiveTab('nutrition');

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 pt-8 pb-32">
        <div className="max-w-xl mx-auto">
          {!isHydrated && (
            <p className="rounded-2xl bg-white/10 p-4 text-slate-300 mb-6">
              Loading local HeroPath data…
            </p>
          )}

          {activeTab === 'home' && <Dashboard onStartTraining={navigateToTrain} onViewNutrition={navigateToNutrition} />}
          {activeTab === 'train' && <WorkoutLogger />}
          {activeTab === 'nutrition' && <NutritionTracker />}
          {activeTab === 'wins' && (
              <div className="space-y-6">
                  <h2 className="text-3xl font-black text-white px-2">Your Victories</h2>
                  <AchievementList />
              </div>
          )}
          {activeTab === 'profile' && <ProfilePanel />}
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-xl border-t border-white/5 px-6 pt-3 pb-8 z-40">
        <div className="max-w-md mx-auto flex justify-between items-center">
            {[
                { id: 'home', icon: Home, label: 'Home' },
                { id: 'train', icon: Dumbbell, label: 'Train' },
                { id: 'nutrition', icon: Utensils, label: 'Nutrition' },
                { id: 'wins', icon: Trophy, label: 'Wins' },
                { id: 'profile', icon: User, label: 'Profile' }
            ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as 'home' | 'train' | 'nutrition' | 'wins' | 'profile')}
                        aria-label={tab.label}
                        aria-current={isActive ? 'page' : undefined}
                        className={`flex flex-col items-center gap-1 transition ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}
                    >
                        <div className={`p-2 rounded-xl transition ${isActive ? 'bg-cyan-400/10' : ''}`}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-tighter">{tab.label}</span>
                    </button>
                );
            })}
        </div>
      </nav>
    </main>
  );
}
