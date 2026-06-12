"use server";

import { revalidatePath } from "next/cache";

import { createMeal, deleteMeal, updateMeal } from "@/lib/meals/service";
import { getCurrentUser } from "@/lib/auth/session";
import { createMealSchema } from "@/lib/schemas/meal.schema";

export type MealActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

const initialState: MealActionState = {
  success: false,
  message: "",
  errors: {},
};

export async function createMealAction(_: MealActionState, formData: FormData): Promise<MealActionState> {
  try {
    const user = await getCurrentUser();

    if (!user?.userId) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      ingredients: JSON.parse(String(formData.get("ingredients") ?? "[]")),
    };

    const parsed = createMealSchema.safeParse(payload);

    if (!parsed.success) {
      return {
        success: false,
        message: "Please fix the errors below.",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    await createMeal(user.userId, parsed.data);

    revalidatePath("/");

    return {
      success: true,
      message: "Meal created successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create meal.",
    };
  }
}

export async function updateMealAction(_: MealActionState, formData: FormData): Promise<MealActionState> {
  try {
    const id = String(formData.get("mealId"));

    const user = await getCurrentUser();

    if (!user?.userId) throw new Error("User not found");

    const name = String(formData.get("name") ?? "").trim();

    const ingredients = JSON.parse(String(formData.get("ingredients") ?? "[]"));

    await updateMeal(user.userId, {
      id,
      name,
      ingredients,
    });

    revalidatePath("/meals");

    return {
      success: true,
      message: "Meal updated successfully.",
    };
  } catch (error) {
    return {
      ...initialState,
      message: error instanceof Error ? error.message : "Failed to update meal.",
    };
  }
}

export async function deleteMealAction(formData: FormData) {
  try {
    const mealId = String(formData.get("mealId"));

    await deleteMeal(mealId);

    revalidatePath("/meals");
  } catch (error) {
    console.error(error);
  }
}
