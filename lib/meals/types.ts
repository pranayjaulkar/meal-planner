import type { Document, Types } from "mongoose";

export interface MealIngredient {
  ingredientId: Types.ObjectId;
  servings: number;
}

export interface Meal {
  id: string;
  name: string;
  ingredients: MealIngredient[];
  totalCalories: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MealDocument extends Document {
  name: string;
  ingredients: MealIngredient[];
  totalCalories: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}