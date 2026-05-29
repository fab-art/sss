export const StreakStatus = {
  Incremented: "incremented",
  Maintained: "maintained",
  Warned: "warned",
  Reset: "reset",
} as const;

export type StreakStatus = (typeof StreakStatus)[keyof typeof StreakStatus];

export type DateOnlyInput = Date | string;

export interface StreakUpdateResult {
  streak: number;
  status: StreakStatus;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Number of full missed calendar days a user may have before the streak resets.
 * With a value of 1, completing after skipping yesterday preserves the streak
 * and reports a warning; missing two or more full days resets the streak.
 */
export const GRACE_MISSED_DAYS = 1;

export function updateStreak(
  currentStreak: number,
  lastCompletionDate: DateOnlyInput | null | undefined,
  today: DateOnlyInput,
): StreakUpdateResult {
  const safeCurrentStreak = Math.max(0, Math.trunc(currentStreak));

  if (lastCompletionDate == null) {
    return {
      streak: Math.max(1, safeCurrentStreak),
      status: StreakStatus.Incremented,
    };
  }

  const elapsedDays = toEpochDay(today) - toEpochDay(lastCompletionDate);

  if (elapsedDays <= 0) {
    return {
      streak: safeCurrentStreak,
      status: StreakStatus.Maintained,
    };
  }

  if (elapsedDays === 1) {
    return {
      streak: safeCurrentStreak + 1,
      status: StreakStatus.Incremented,
    };
  }

  const missedDays = elapsedDays - 1;

  if (missedDays <= GRACE_MISSED_DAYS) {
    return {
      streak: safeCurrentStreak,
      status: StreakStatus.Warned,
    };
  }

  return {
    streak: 1,
    status: StreakStatus.Reset,
  };
}

function toEpochDay(input: DateOnlyInput): number {
  const { year, month, day } = toDateOnlyParts(input);

  return Math.floor(Date.UTC(year, month - 1, day) / MS_PER_DAY);
}

function toDateOnlyParts(input: DateOnlyInput): { year: number; month: number; day: number } {
  if (input instanceof Date) {
    return {
      year: input.getUTCFullYear(),
      month: input.getUTCMonth() + 1,
      day: input.getUTCDate(),
    };
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(input);

  if (match == null) {
    throw new Error(`Expected a date-only or ISO date string in YYYY-MM-DD format, received: ${input}`);
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}
