import { connectToDatabase } from "@/lib/db";

import IngredientModel from "./model";
import type { CreateIngredientDto, UpdateIngredientDto } from "./dto";
import type { IngredientDocument, IngredientSearchParams } from "./types";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function createIngredient(userId: string, data: CreateIngredientDto): Promise<IngredientDocument> {
  await connectToDatabase();

  return IngredientModel.create({
    ...data,
    userId,
  });
}

export async function findIngredientsByUserId(
  userId: string,
  params: IngredientSearchParams = {}
): Promise<IngredientDocument[]> {
  await connectToDatabase();

  const filter: Record<string, unknown> = { userId };

  if (params.query) {
    filter.name = { $regex: escapeRegExp(params.query), $options: "i" };
  }

  return IngredientModel.find(filter).sort({ name: 1 }).lean<IngredientDocument[]>();
}

export async function findIngredientById(userId: string, ingredientId: string): Promise<IngredientDocument | null> {
  await connectToDatabase();

  return IngredientModel.findOne({ _id: ingredientId, userId }).lean<IngredientDocument | null>();
}

export async function updateIngredient(
  userId: string,
  ingredientId: string,
  data: UpdateIngredientDto
): Promise<IngredientDocument | null> {
  await connectToDatabase();

  return IngredientModel.findOneAndUpdate({ _id: ingredientId, userId }, { $set: data }, { new: true, runValidators: true })
    .lean<IngredientDocument | null>();
}

export async function deleteIngredient(userId: string, ingredientId: string): Promise<boolean> {
  await connectToDatabase();

  const result = await IngredientModel.deleteOne({ _id: ingredientId, userId });

  return result.deletedCount === 1;
}
