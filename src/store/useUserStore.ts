import { create } from 'zustand';
import type { ActivityLevel, NutritionGoal } from '../domain/types';

type Theme = 'dark' | 'light';

export type UserProfile = {
  age: number;
  weight: number;
  height: number;
  activityLevel: ActivityLevel;
  goal: NutritionGoal;
};

type UserStore = {
  heroName: string;
  theme: Theme;
  hasCompletedOnboarding: boolean;
  profile: UserProfile;
  setHeroName: (heroName: string) => void;
  setTheme: (theme: Theme) => void;
  completeOnboarding: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
};

const storageKey = 'heropath:user-preferences';

function loadPreferences(): Pick<UserStore, 'heroName' | 'theme' | 'hasCompletedOnboarding' | 'profile'> {
  const fallback = {
    heroName: 'New Hero',
    theme: 'dark' as Theme,
    hasCompletedOnboarding: false,
    profile: {
      age: 25,
      weight: 150,
      height: 67,
      activityLevel: 'moderate' as ActivityLevel,
      goal: 'maintenance' as NutritionGoal
    }
  };
  const raw = localStorage.getItem(storageKey);

  if (!raw) {
    return fallback;
  }

  return { ...fallback, ...JSON.parse(raw) };
}

function savePreferences(
  state: Pick<UserStore, 'heroName' | 'theme' | 'hasCompletedOnboarding'>
): void {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

export const useUserStore = create<UserStore>((set, get) => ({
  ...loadPreferences(),
  setHeroName: (heroName) => {
    set({ heroName });
    savePreferences(get());
  },
  setTheme: (theme) => {
    set({ theme });
    savePreferences(get());
  },
  completeOnboarding: () => {
    set({ hasCompletedOnboarding: true });
    savePreferences(get());
  },
  updateProfile: (profile) => {
    set({ profile: { ...get().profile, ...profile } });
    savePreferences(get());
  }
}));
