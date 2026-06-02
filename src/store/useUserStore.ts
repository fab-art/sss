import { create } from 'zustand';

type Theme = 'dark' | 'light';

type UserStore = {
  heroName: string;
  theme: Theme;
  hasCompletedOnboarding: boolean;
  setHeroName: (heroName: string) => void;
  setTheme: (theme: Theme) => void;
  completeOnboarding: () => void;
};

const storageKey = 'heropath:user-preferences';

function loadPreferences(): Pick<UserStore, 'heroName' | 'theme' | 'hasCompletedOnboarding'> {
  const fallback = { heroName: 'New Hero', theme: 'dark' as Theme, hasCompletedOnboarding: false };
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
  }
}));
