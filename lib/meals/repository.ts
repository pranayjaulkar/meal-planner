import MealModel from "./model";
import type { CreateMealDto, UpdateMealDto } from "./dto";

export async function createMeal(
  data: CreateMealDto & {
    totalCalories: number;
    userId: string;
  },
) {
  return MealModel.create(data);
}

export async function updateMeal(
  data: UpdateMealDto & {
    totalCalories: number;
  },
) {
  return MealModel.findByIdAndUpdate(
    data.id,
    {
      name: data.name,
      ingredients: data.ingredients,
      totalCalories: data.totalCalories,
    },
    {
      new: true,
    },
  );
}

export async function deleteMeal(id: string) {
  return MealModel.findByIdAndDelete(id);
}

export async function getMealById(id: string) {
  return MealModel.findById(id).populate("ingredients.ingredientId");
}

export async function getMealsByUserId(userId: string) {
  return MealModel.find({ userId }).sort({ createdAt: -1 }).populate("ingredients.ingredientId");
}
