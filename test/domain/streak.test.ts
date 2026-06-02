import { describe, expect, it } from 'vitest';
import { applyWorkoutToStreak } from '../../src/domain/streak';

describe('applyWorkoutToStreak', () => {
  it('maintains the streak for same-day repeat completions', () => {
    const initial = { current: 7, longest: 7, lastWorkoutDate: '2026-05-28' };
    expect(applyWorkoutToStreak(initial, '2026-05-28T23:59:59.999Z')).toEqual(initial);
  });

  it('increments the streak for consecutive days', () => {
    const initial = { current: 7, longest: 7, lastWorkoutDate: '2026-05-27' };
    expect(applyWorkoutToStreak(initial, '2026-05-28')).toEqual({
      current: 8,
      longest: 8,
      lastWorkoutDate: '2026-05-28'
    });
  });

  it('resets the streak when a day is missed', () => {
    const initial = { current: 7, longest: 7, lastWorkoutDate: '2026-05-26' };
    expect(applyWorkoutToStreak(initial, '2026-05-28')).toEqual({
      current: 1,
      longest: 7,
      lastWorkoutDate: '2026-05-28'
    });
  });

  it('starts a new streak when there is no previous completion date', () => {
    expect(applyWorkoutToStreak({ current: 0, longest: 0 }, '2026-05-28')).toEqual({
      current: 1,
      longest: 1,
      lastWorkoutDate: '2026-05-28'
    });
  });

  it('maintains longest streak when current streak is reset', () => {
    const initial = { current: 10, longest: 15, lastWorkoutDate: '2026-05-25' };
    expect(applyWorkoutToStreak(initial, '2026-05-28')).toEqual({
      current: 1,
      longest: 15,
      lastWorkoutDate: '2026-05-28'
    });
  });
});
