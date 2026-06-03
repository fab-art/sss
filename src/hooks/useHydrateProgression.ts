import { useEffect } from 'react';
import { useProgressionStore } from '../store/useProgressionStore';
import { useNutritionStore } from '../store/useNutritionStore';
import { nowIso } from '../lib/date';

export function useHydrateProgression() {
  const hydrateProgression = useProgressionStore((state) => state.hydrate);
  const hydrateNutrition = useNutritionStore((state) => state.hydrate);

  useEffect(() => {
    const today = nowIso().split('T')[0];
    void hydrateProgression();
    void hydrateNutrition('default', today);
  }, [hydrateProgression, hydrateNutrition]);
}
