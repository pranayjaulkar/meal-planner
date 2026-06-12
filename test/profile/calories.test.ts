import { describe, expect, it } from "vitest";

import {
  calculateBmr,
  calculateHealthProfileMetrics,
  calculateMaintenanceCalories,
} from "@/lib/profile/calories";

describe("health profile calorie calculations", () => {
  it("calculates male BMR with the Mifflin-St Jeor formula", () => {
    expect(
      calculateBmr({
        age: 30,
        gender: "male",
        height: 180,
        weight: 80,
      })
    ).toBe(1780);
  });

  it("calculates female BMR with the Mifflin-St Jeor formula", () => {
    expect(
      calculateBmr({
        age: 30,
        gender: "female",
        height: 165,
        weight: 60,
      })
    ).toBe(1320);
  });

  it("calculates maintenance calories from the sedentary activity factor", () => {
    expect(calculateMaintenanceCalories(1780)).toBe(2136);
  });

  it("returns BMR and maintenance calories together", () => {
    expect(
      calculateHealthProfileMetrics({
        age: 30,
        gender: "male",
        height: 180,
        weight: 80,
      })
    ).toEqual({
      bmr: 1780,
      maintenanceCalories: 2136,
    });
  });
});
