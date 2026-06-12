import { z } from "zod";

export const ingredientNameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be 100 characters or less");

export const caloriesPerServingSchema = z.coerce
  .number({ invalid_type_error: "Calories per serving must be a number" })
  .min(0, "Calories per serving cannot be negative")
  .max(5000, "Calories per serving must be 5000 or less");

export const servingSizeSchema = z
  .string()
  .trim()
  .min(1, "Serving size is required")
  .max(80, "Serving size must be 80 characters or less");

export const createIngredientSchema = z.object({
  name: ingredientNameSchema,
  caloriesPerServing: caloriesPerServingSchema,
  servingSize: servingSizeSchema,
});

export const updateIngredientSchema = createIngredientSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const ingredientIdSchema = z.string().trim().min(1, "Ingredient id is required");

export const ingredientSearchSchema = z.object({
  query: z.string().trim().max(100, "Search must be 100 characters or less").optional(),
});

export type CreateIngredientInput = z.infer<typeof createIngredientSchema>;
export type UpdateIngredientInput = z.infer<typeof updateIngredientSchema>;
export type IngredientSearchInput = z.infer<typeof ingredientSearchSchema>;
