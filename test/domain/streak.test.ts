import { describe, expect, it } from 'vitest';

import { GRACE_MISSED_DAYS, StreakStatus, updateStreak } from '../../src/domain/streak.js';

describe('updateStreak', () => {
  it('maintains the streak for same-day repeat completions while ignoring time of day', () => {
    expect(updateStreak(7, '2026-05-28T00:01:00.000Z', '2026-05-28T23:59:59.999Z')).toEqual({
      streak: 7,
      status: StreakStatus.Maintained
    });
  });

  it('increments the streak for consecutive date-only calendar days', () => {
    expect(updateStreak(7, '2026-05-27', '2026-05-28')).toEqual({
      streak: 8,
      status: StreakStatus.Incremented
    });
  });

  it('preserves the streak and warns when exactly one full calendar day was missed', () => {
    expect(GRACE_MISSED_DAYS).toBe(1);
    expect(updateStreak(7, '2026-05-26', '2026-05-28')).toEqual({
      streak: 7,
      status: StreakStatus.Warned
    });
  });

  it('resets the streak when the missed-days grace allowance is exceeded', () => {
    expect(updateStreak(7, '2026-05-25', '2026-05-28')).toEqual({
      streak: 1,
      status: StreakStatus.Reset
    });
  });

  it('compares Date inputs by their UTC date parts so host timezone cannot shift boundaries', () => {
    expect(
      updateStreak(
        2,
        new Date('2024-02-29T23:30:00.000-10:00'),
        new Date('2024-03-02T00:30:00.000-10:00')
      )
    ).toEqual({
      streak: 3,
      status: StreakStatus.Incremented
    });
  });

  it('starts a new streak when there is no previous completion date', () => {
    expect(updateStreak(0, null, '2026-05-28')).toEqual({
      streak: 1,
      status: StreakStatus.Incremented
    });
  });
});
