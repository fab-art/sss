import { failure, success, type PersistenceResult } from './errors';

export type ThemePreference = 'light' | 'dark' | 'system';

export interface PreferencesStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const PREFERENCE_KEYS = {
  theme: 'ssswork:theme',
  onboardingComplete: 'ssswork:onboardingComplete',
  username: 'ssswork:username',
} as const;

const getStorage = (storage?: PreferencesStorage): PreferencesStorage => {
  if (storage) {
    return storage;
  }

  if (typeof window === 'undefined' || !window.localStorage) {
    throw new Error('localStorage is unavailable');
  }

  return window.localStorage;
};

export const createPreferences = (storage?: PreferencesStorage) => ({
  getTheme: (): PersistenceResult<ThemePreference> => {
    try {
      const value = getStorage(storage).getItem(PREFERENCE_KEYS.theme);
      return success(value === 'light' || value === 'dark' || value === 'system' ? value : 'system');
    } catch (error) {
      return failure('preferences', undefined, error);
    }
  },

  setTheme: (theme: ThemePreference): PersistenceResult<void> => {
    try {
      getStorage(storage).setItem(PREFERENCE_KEYS.theme, theme);
      return success(undefined);
    } catch (error) {
      return failure('preferences', undefined, error);
    }
  },

  getOnboardingComplete: (): PersistenceResult<boolean> => {
    try {
      return success(getStorage(storage).getItem(PREFERENCE_KEYS.onboardingComplete) === 'true');
    } catch (error) {
      return failure('preferences', undefined, error);
    }
  },

  setOnboardingComplete: (complete: boolean): PersistenceResult<void> => {
    try {
      getStorage(storage).setItem(PREFERENCE_KEYS.onboardingComplete, String(complete));
      return success(undefined);
    } catch (error) {
      return failure('preferences', undefined, error);
    }
  },

  getUsername: (): PersistenceResult<string | undefined> => {
    try {
      return success(getStorage(storage).getItem(PREFERENCE_KEYS.username) ?? undefined);
    } catch (error) {
      return failure('preferences', undefined, error);
    }
  },

  setUsername: (username: string): PersistenceResult<void> => {
    try {
      getStorage(storage).setItem(PREFERENCE_KEYS.username, username);
      return success(undefined);
    } catch (error) {
      return failure('preferences', undefined, error);
    }
  },

  clearUsername: (): PersistenceResult<void> => {
    try {
      getStorage(storage).removeItem(PREFERENCE_KEYS.username);
      return success(undefined);
    } catch (error) {
      return failure('preferences', undefined, error);
    }
  },
});

export const preferences = createPreferences();
