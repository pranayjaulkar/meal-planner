import {
  createIngredientSchema,
  ingredientIdSchema,
  ingredientSearchSchema,
  updateIngredientSchema,
} from "@/lib/schemas/ingredient.schema";

import type { CreateIngredientDto, IngredientResponseDto, UpdateIngredientDto } from "./dto";
import {
  createIngredient,
  deleteIngredient,
  findIngredientById,
  findIngredientsByUserId,
  updateIngredient,
} from "./repository";
import type { IngredientDocument, IngredientSearchParams } from "./types";

function toResponseDto(ingredient: IngredientDocument): IngredientResponseDto {
  return {
    id: ingredient._id.toString(),
    name: ingredient.name,
    caloriesPerServing: ingredient.caloriesPerServing,
    servingSize: ingredient.servingSize,
    userId: ingredient.userId.toString(),
    createdAt: ingredient.createdAt.toISOString(),
    updatedAt: ingredient.updatedAt.toISOString(),
  };
}

export async function createUserIngredient(
  userId: string,
  data: CreateIngredientDto
): Promise<IngredientResponseDto> {
  const input = createIngredientSchema.parse(data);
  const ingredient = await createIngredient(userId, input);

  return toResponseDto(ingredient);
}

export async function listUserIngredients(
  userId: string,
  params: IngredientSearchParams = {}
): Promise<IngredientResponseDto[]> {
  const search = ingredientSearchSchema.parse(params);
  const ingredients = await findIngredientsByUserId(userId, search);

  return ingredients.map(toResponseDto);
}

export async function getUserIngredient(userId: string, ingredientId: string): Promise<IngredientResponseDto | null> {
  const id = ingredientIdSchema.parse(ingredientId);
  const ingredient = await findIngredientById(userId, id);

  return ingredient ? toResponseDto(ingredient) : null;
}

export async function updateUserIngredient(
  userId: string,
  ingredientId: string,
  data: UpdateIngredientDto
): Promise<IngredientResponseDto> {
  const id = ingredientIdSchema.parse(ingredientId);
  const input = updateIngredientSchema.parse(data);
  const ingredient = await updateIngredient(userId, id, input);

  if (!ingredient) {
    throw new Error("Ingredient not found");
  }

  return toResponseDto(ingredient);
}

export async function deleteUserIngredient(userId: string, ingredientId: string): Promise<void> {
  const id = ingredientIdSchema.parse(ingredientId);
  const deleted = await deleteIngredient(userId, id);

  if (!deleted) {
    throw new Error("Ingredient not found");
  }
}
