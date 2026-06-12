export interface CreateIngredientDto {
  name: string;
  caloriesPerServing: number;
  servingSize: string;
}

export interface UpdateIngredientDto {
  name?: string;
  caloriesPerServing?: number;
  servingSize?: string;
}

export interface IngredientResponseDto {
  id: string;
  name: string;
  caloriesPerServing: number;
  servingSize: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
