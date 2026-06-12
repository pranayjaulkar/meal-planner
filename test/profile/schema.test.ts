import { describe, expect, it } from "vitest";

import { healthProfileSchema } from "@/lib/schemas/health-profile.schema";

describe("healthProfileSchema", () => {
  it("coerces valid form values into typed profile data", () => {
    expect(
      healthProfileSchema.parse({
        age: "35",
        gender: "female",
        height: "170.5",
        weight: "68.2",
      })
    ).toEqual({
      age: 35,
      gender: "female",
      height: 170.5,
      weight: 68.2,
    });
  });

  it("rejects unsupported genders and out-of-range values", () => {
    const result = healthProfileSchema.safeParse({
      age: "12",
      gender: "other",
      height: "99",
      weight: "29",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      expect(errors.age).toContain("Age must be at least 13");
      expect(errors.gender).toContain("Gender must be male or female");
      expect(errors.height).toContain("Height must be at least 100 cm");
      expect(errors.weight).toContain("Weight must be at least 30 kg");
    }
  });
});
