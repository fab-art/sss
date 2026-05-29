import { describe, expect, it } from "vitest";

import {
  ACHIEVEMENTS,
  type AchievementId,
  type AchievementState,
  evaluateAchievements,
} from "../../src/domain/achievements";

const baseState: AchievementState = {
  totalWorkouts: 0,
  currentStreakDays: 0,
  longestStreakDays: 0,
  longestRunMeters: 0,
  totalPushUps: 0,
  consecutiveGoalWeeks: 0,
};

const achievement = (id: AchievementId) => {
  const definition = ACHIEVEMENTS.find((candidate) => candidate.id === id);

  if (!definition) {
    throw new Error(`Missing achievement ${id}`);
  }

  return definition;
};

describe("achievement predicates", () => {
  it("unlocks First Workout at one completed workout", () => {
    const predicate = achievement("first-workout").predicate;

    expect(predicate({ ...baseState, totalWorkouts: 0 })).toBe(false);
    expect(predicate({ ...baseState, totalWorkouts: 1 })).toBe(true);
  });

  it("unlocks 3-Day Streak at a three-day best streak", () => {
    const predicate = achievement("three-day-streak").predicate;

    expect(predicate({ ...baseState, currentStreakDays: 2 })).toBe(false);
    expect(predicate({ ...baseState, currentStreakDays: 3 })).toBe(true);
    expect(predicate({ ...baseState, longestStreakDays: 3 })).toBe(true);
  });

  it("unlocks 7-Day Streak at a seven-day best streak", () => {
    const predicate = achievement("seven-day-streak").predicate;

    expect(predicate({ ...baseState, longestStreakDays: 6 })).toBe(false);
    expect(predicate({ ...baseState, longestStreakDays: 7 })).toBe(true);
    expect(predicate({ ...baseState, currentStreakDays: 7 })).toBe(true);
  });

  it("unlocks First 1 km Run at 1,000 meters in a single run", () => {
    const predicate = achievement("first-1km-run").predicate;

    expect(predicate({ ...baseState, longestRunMeters: 999 })).toBe(false);
    expect(predicate({ ...baseState, longestRunMeters: 1_000 })).toBe(true);
  });

  it("unlocks 100 Total Push-Ups at 100 accumulated reps", () => {
    const predicate = achievement("one-hundred-total-push-ups").predicate;

    expect(predicate({ ...baseState, totalPushUps: 99 })).toBe(false);
    expect(predicate({ ...baseState, totalPushUps: 100 })).toBe(true);
  });

  it("unlocks Consistency Warrior at four consecutive goal weeks", () => {
    const predicate = achievement("consistency-warrior").predicate;

    expect(predicate({ ...baseState, consecutiveGoalWeeks: 3 })).toBe(false);
    expect(predicate({ ...baseState, consecutiveGoalWeeks: 4 })).toBe(true);
  });
});

describe("evaluateAchievements", () => {
  it("returns only newly unlocked achievements", () => {
    const state: AchievementState = {
      totalWorkouts: 10,
      currentStreakDays: 7,
      longestStreakDays: 7,
      longestRunMeters: 1_000,
      totalPushUps: 100,
      consecutiveGoalWeeks: 4,
    };

    const firstEvaluation = evaluateAchievements([], state);

    expect(firstEvaluation.map((achievement) => achievement.id)).toEqual(
      ACHIEVEMENTS.map((achievement) => achievement.id),
    );

    const secondEvaluation = evaluateAchievements(
      firstEvaluation.map((achievement) => achievement.id),
      state,
    );

    expect(secondEvaluation).toEqual([]);
  });

  it("does not re-fire an already-unlocked achievement when others become newly eligible", () => {
    const newlyUnlocked = evaluateAchievements(["first-workout"], {
      ...baseState,
      totalWorkouts: 3,
      currentStreakDays: 3,
    });

    expect(newlyUnlocked.map((achievement) => achievement.id)).toEqual([
      "three-day-streak",
    ]);
  });
});
