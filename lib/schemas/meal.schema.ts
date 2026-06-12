import { z } from "zod";

export const mealIngredientSchema = z.object({
  ingredientId: z.string().min(1),
  servings: z.coerce.number().positive(),
});

export const createMealSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(100),

  ingredients: z
    .array(mealIngredientSchema)
    .min(1, "Select at least one ingredient"),
});

export const updateMealSchema =
  createMealSchema.extend({
    id: z.string().min(1),
  });