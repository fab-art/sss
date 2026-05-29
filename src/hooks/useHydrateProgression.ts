import { useEffect } from 'react';
import { useProgressionStore } from '../store/useProgressionStore';

export function useHydrateProgression() {
  const hydrate = useProgressionStore((state) => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);
}
