import { describe, expect, it } from 'vitest';
import {
  calculateWorkoutXp,
  getLevelForXp,
  getXpIntoLevel,
  getXpRequiredForNextLevel
} from '../../src/domain/xp';

describe('XP calculation', () => {
  it('calculates workout XP correctly', () => {
    // BASE_COMPLETION_XP = 25
    // MINUTE_XP = 3
    // EXERCISE_XP = 8
    // INTENSITY_MULTIPLIER = 0.15
    // formula: Math.round((25 + duration * 3 + exercises * 8) * (1 + intensity * 0.15))

    // duration 30, exercises 5, intensity 3
    // (25 + 90 + 40) * (1 + 0.45) = 155 * 1.45 = 224.75 -> 225
    expect(
      calculateWorkoutXp({
        completedAt: '2026-05-28',
        durationMinutes: 30,
        exercisesCompleted: 5,
        intensity: 3
      })
    ).toBe(225);
  });

  it('derives level from total XP', () => {
    // LEVEL_XP_SPAN = 250
    expect(getLevelForXp(0)).toBe(1);
    expect(getLevelForXp(249)).toBe(1);
    expect(getLevelForXp(250)).toBe(2);
    expect(getLevelForXp(500)).toBe(3);
  });

  it('calculates XP into current level', () => {
    expect(getXpIntoLevel(100)).toBe(100);
    expect(getXpIntoLevel(300)).toBe(50);
  });

  it('returns required XP for next level', () => {
    expect(getXpRequiredForNextLevel()).toBe(250);
  });
});
