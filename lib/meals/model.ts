import mongoose from "mongoose";

import type { MealDocument } from "./types";

const mealIngredientSchema = new mongoose.Schema(
  {
    ingredientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient",
      required: true,
    },
    servings: {
      type: Number,
      required: true,
      min: 0.01,
    },
  },
  {
    _id: false,
  }
);

const mealSchema = new mongoose.Schema<MealDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    ingredients: {
      type: [mealIngredientSchema],
      default: [],
    },

    totalCalories: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    userId: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

mealSchema.index({
  userId: 1,
  name: 1,
});

const MealModel =
  (mongoose.models.Meal as mongoose.Model<MealDocument>) ||
  mongoose.model<MealDocument>("Meal", mealSchema);

export default MealModel;