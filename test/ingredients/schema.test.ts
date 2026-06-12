import { describe, expect, it } from "vitest";

import { createIngredientSchema, updateIngredientSchema } from "@/lib/schemas/ingredient.schema";

describe("ingredient schemas", () => {
  it("coerces valid create form data", () => {
    expect(
      createIngredientSchema.parse({
        name: "Greek yogurt",
        caloriesPerServing: "120",
        servingSize: "170 g",
      })
    ).toEqual({
      name: "Greek yogurt",
      caloriesPerServing: 120,
      servingSize: "170 g",
    });
  });

  it("rejects invalid create values", () => {
    const result = createIngredientSchema.safeParse({
      name: "A",
      caloriesPerServing: "-1",
      servingSize: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      expect(errors.name).toContain("Name must be at least 2 characters");
      expect(errors.caloriesPerServing).toContain("Calories per serving cannot be negative");
      expect(errors.servingSize).toContain("Serving size is required");
    }
  });

  it("rejects empty updates", () => {
    expect(updateIngredientSchema.safeParse({}).success).toBe(false);
  });
});
