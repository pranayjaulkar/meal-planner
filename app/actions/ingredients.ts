"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/session";
import { createIngredientSchema, ingredientIdSchema, updateIngredientSchema } from "@/lib/schemas/ingredient.schema";
import { createUserIngredient, deleteUserIngredient, updateUserIngredient } from "@/lib/ingredients/service";

export type IngredientActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

const emptyState: IngredientActionState = {
  success: false,
  message: "",
  errors: {},
};

function ingredientValues(formData: FormData) {
  return {
    name: formData.get("name"),
    caloriesPerServing: formData.get("caloriesPerServing"),
    servingSize: formData.get("servingSize"),
  };
}

async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return user;
}

export async function createIngredientAction(
  previousState: IngredientActionState = emptyState,
  formData: FormData
): Promise<IngredientActionState> {
  void previousState;

  const user = await requireCurrentUser();

  if (!user) {
    return {
      success: false,
      message: "You must be signed in to create ingredients",
    };
  }

  const validation = createIngredientSchema.safeParse(ingredientValues(formData));

  if (!validation.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    await createUserIngredient(user.userId, validation.data);
    revalidatePath("/");

    return {
      success: true,
      message: "Ingredient created",
      errors: {},
    };
  } catch {
    return {
      success: false,
      message: "Unable to create ingredient",
    };
  }
}

export async function updateIngredientAction(
  previousState: IngredientActionState = emptyState,
  formData: FormData
): Promise<IngredientActionState> {
  void previousState;

  const user = await requireCurrentUser();

  if (!user) {
    return {
      success: false,
      message: "You must be signed in to update ingredients",
    };
  }

  const idValidation = ingredientIdSchema.safeParse(formData.get("ingredientId"));

  if (!idValidation.success) {
    return {
      success: false,
      message: "Ingredient id is required",
    };
  }

  const validation = updateIngredientSchema.safeParse(ingredientValues(formData));

  if (!validation.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    await updateUserIngredient(user.userId, idValidation.data, validation.data);
    revalidatePath("/");

    return {
      success: true,
      message: "Ingredient updated",
      errors: {},
    };
  } catch {
    return {
      success: false,
      message: "Unable to update ingredient",
    };
  }
}

export async function deleteIngredientAction(formData: FormData): Promise<void> {
  const user = await requireCurrentUser();

  if (!user) {
    return;
  }

  const idValidation = ingredientIdSchema.safeParse(formData.get("ingredientId"));

  if (!idValidation.success) {
    return;
  }

  await deleteUserIngredient(user.userId, idValidation.data);
  revalidatePath("/");
}
