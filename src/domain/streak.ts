import { ISODateString } from './types';

export function applyWorkoutToStreak(
  current: { current: number; longest: number; lastWorkoutDate?: ISODateString },
  completedAt: ISODateString
) {
  const date = completedAt.slice(0, 10);
  if (current.lastWorkoutDate === date) {
    return current;
  }

  const lastDate = current.lastWorkoutDate ? new Date(current.lastWorkoutDate) : null;
  const currentDate = new Date(date);

  const isConsecutive =
    lastDate && Math.floor((currentDate.getTime() - lastDate.getTime()) / 86400000) === 1;

  const nextCurrent = isConsecutive ? current.current + 1 : 1;
  return {
    current: nextCurrent,
    longest: Math.max(current.longest, nextCurrent),
    lastWorkoutDate: date
  };
}
