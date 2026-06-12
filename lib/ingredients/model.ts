import mongoose from "mongoose";

import type { IngredientDocument } from "./types";

const ingredientSchema = new mongoose.Schema<IngredientDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    caloriesPerServing: {
      type: Number,
      required: true,
      min: 0,
      max: 5000,
    },
    servingSize: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

ingredientSchema.virtual("meals", {
  ref: "Meal",
  localField: "_id",
  foreignField: "ingredients.ingredientId",
});

ingredientSchema.index({ userId: 1, name: 1 });

const IngredientModel =
  (mongoose.models.Ingredient as mongoose.Model<IngredientDocument>) ||
  mongoose.model<IngredientDocument>("Ingredient", ingredientSchema);

export default IngredientModel;
