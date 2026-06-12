export interface MealIngredientResponseDto {
  ingredientId: string;
  ingredientName: string;
  servings: number;
  caloriesPerServing: number;
  calories: number;
}

export interface MealResponseDto {
  _id: string;
  name: string;
  totalCalories: number;
  ingredients: MealIngredientResponseDto[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMealDto {
  name: string;
  ingredients: {
    ingredientId: string;
    servings: number;
  }[];
}

export interface UpdateMealDto extends CreateMealDto {
  id: string;
}
