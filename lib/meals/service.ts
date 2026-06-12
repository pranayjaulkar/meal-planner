import * as ingredientRepository from "@/lib/ingredients/repository";
import * as mealRepository from "./repository";

import type { CreateMealDto, MealResponseDto, UpdateMealDto } from "./dto";
import { serializeDocument } from "../utils";
import { MealDocument } from "./types";

async function calculateMealCalories(ingredients: CreateMealDto["ingredients"], userId: string) {
  let totalCalories = 0;

  for (const item of ingredients) {
    const ingredient = await ingredientRepository.findIngredientById(userId, item.ingredientId);

    if (!ingredient) {
      throw new Error("Ingredient not found");
    }

    totalCalories += ingredient.caloriesPerServing * item.servings;
  }

  return totalCalories;
}

export async function createMeal(userId: string, dto: CreateMealDto) {
  const totalCalories = await calculateMealCalories(dto.ingredients, userId);

  return mealRepository.createMeal({
    ...dto,
    userId,
    totalCalories,
  });
}

export async function updateMeal(userId: string, dto: UpdateMealDto) {
  const totalCalories = await calculateMealCalories(dto.ingredients, userId);

  return mealRepository.updateMeal({
    ...dto,
    totalCalories,
  });
}

export async function deleteMeal(id: string) {
  return mealRepository.deleteMeal(id);
}

export async function getMeal(id: string) {
  return mealRepository.getMealById(id);
}

export async function getMeals(userId: string) {
  const mealDocs = await mealRepository.getMealsByUserId(userId);
  const meals = mealDocs.map((m) => serializeDocument<MealDocument>(m));
  return meals as unknown as MealResponseDto[];
}
