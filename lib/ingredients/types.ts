export interface Ingredient {
  name: string;
  caloriesPerServing: number;
  servingSize: string;
  userId: string;
}

export interface IngredientDocument extends Ingredient {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IngredientSearchParams {
  query?: string;
}
