import { getRankForXp } from './ranks';
import { getLevelForXp } from './xp';
import type { ProgressionState } from './types';

export const initialProgression: ProgressionState = {
  totalXp: 0,
  level: 1,
  rankId: 'initiate',
  workoutsCompleted: 0
};

export function applyXp(state: ProgressionState, xpAwarded: number): ProgressionState {
  const totalXp = Math.max(0, state.totalXp + xpAwarded);
  const rank = getRankForXp(totalXp);

  return {
    ...state,
    totalXp,
    level: getLevelForXp(totalXp),
    rankId: rank.id
  };
}

export function completeWorkoutProgression(state: ProgressionState, xpAwarded: number): ProgressionState {
  return {
    ...applyXp(state, xpAwarded),
    workoutsCompleted: state.workoutsCompleted + 1
  };
}
