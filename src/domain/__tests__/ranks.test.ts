import { describe, expect, it } from 'vitest';
import { RANKS, getNextRank, getRankByNumber, getRankWorkout } from '../index.js';

const prdRanks = [
  {
    rankNumber: 1,
    name: 'Civilian',
    targetWorkout: { pushups: 5, squats: 5, situps: 5, cardioDistanceKm: 0.5 }
  },
  {
    rankNumber: 2,
    name: 'Trainee',
    targetWorkout: { pushups: 10, squats: 10, situps: 10, cardioDistanceKm: 1 }
  },
  {
    rankNumber: 3,
    name: 'Fighter',
    targetWorkout: { pushups: 20, squats: 20, situps: 20, cardioDistanceKm: 2 }
  },
  {
    rankNumber: 4,
    name: 'Hunter',
    targetWorkout: { pushups: 35, squats: 35, situps: 35, cardioDistanceKm: 3 }
  },
  {
    rankNumber: 5,
    name: 'Elite',
    targetWorkout: { pushups: 50, squats: 50, situps: 50, cardioDistanceKm: 5 }
  },
  {
    rankNumber: 6,
    name: 'Hero Candidate',
    targetWorkout: { pushups: 70, squats: 70, situps: 70, cardioDistanceKm: 7 }
  },
  {
    rankNumber: 7,
    name: 'Hero',
    targetWorkout: { pushups: 85, squats: 85, situps: 85, cardioDistanceKm: 8.5 }
  },
  {
    rankNumber: 8,
    name: 'Caped Baldy',
    targetWorkout: { pushups: 100, squats: 100, situps: 100, cardioDistanceKm: 10 }
  }
] as const;

describe('rank definitions', () => {
  it('matches every PRD rank name, rank number, and target workout exactly', () => {
    expect(RANKS).toHaveLength(prdRanks.length);
    expect(RANKS).toEqual(prdRanks);
  });

  it.each(prdRanks)('returns rank $rankNumber ($name) by number', (expectedRank) => {
    expect(getRankByNumber(expectedRank.rankNumber)).toEqual(expectedRank);
  });

  it.each(prdRanks)('returns workout targets for rank $rankNumber ($name)', (expectedRank) => {
    expect(getRankWorkout(expectedRank.rankNumber)).toEqual(expectedRank.targetWorkout);
  });

  it('freezes the rank array, each rank, and each target workout', () => {
    expect(Object.isFrozen(RANKS)).toBe(true);

    for (const rank of RANKS) {
      expect(Object.isFrozen(rank)).toBe(true);
      expect(Object.isFrozen(rank.targetWorkout)).toBe(true);
    }
  });

  it('returns null for rank 1 previous lookup because there is no previous rank', () => {
    expect(getRankByNumber(0)).toBeNull();
  });

  it('returns the next rank until rank 8, which has no next rank', () => {
    for (const expectedRank of prdRanks.slice(1)) {
      expect(getNextRank(expectedRank.rankNumber - 1)).toEqual(expectedRank);
    }

    expect(getNextRank(8)).toBeNull();
  });

  it('returns null when no workout exists for a rank number', () => {
    expect(getRankWorkout(0)).toBeNull();
    expect(getRankWorkout(9)).toBeNull();
  });
});
