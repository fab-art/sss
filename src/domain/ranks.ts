import type { Rank } from './types';

export const RANKS: Rank[] = [
  { id: 'initiate', title: 'Initiate', minXp: 0, emblem: '🛡️' },
  { id: 'squire', title: 'Squire', minXp: 500, emblem: '⚔️' },
  { id: 'guardian', title: 'Guardian', minXp: 1_500, emblem: '🔥' },
  { id: 'champion', title: 'Champion', minXp: 3_500, emblem: '🏆' },
  { id: 'legend', title: 'Legend', minXp: 7_500, emblem: '👑' }
];

export function getRankForXp(totalXp: number): Rank {
  return RANKS.reduce((current, candidate) => (totalXp >= candidate.minXp ? candidate : current), RANKS[0]);
}

export function getNextRank(totalXp: number): Rank | undefined {
  return RANKS.find((rank) => rank.minXp > totalXp);
}
