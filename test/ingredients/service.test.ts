import { beforeEach, describe, expect, it, vi } from "vitest";

import type { IngredientDocument } from "@/lib/ingredients/types";

vi.mock("@/lib/ingredients/repository", () => ({
  createIngredient: vi.fn(),
  deleteIngredient: vi.fn(),
  findIngredientById: vi.fn(),
  findIngredientsByUserId: vi.fn(),
  updateIngredient: vi.fn(),
}));

import {
  createIngredient,
  deleteIngredient,
  findIngredientById,
  findIngredientsByUserId,
  updateIngredient,
} from "@/lib/ingredients/repository";
import {
  createUserIngredient,
  deleteUserIngredient,
  getUserIngredient,
  listUserIngredients,
  updateUserIngredient,
} from "@/lib/ingredients/service";

const createIngredientMock = vi.mocked(createIngredient);
const deleteIngredientMock = vi.mocked(deleteIngredient);
const findIngredientByIdMock = vi.mocked(findIngredientById);
const findIngredientsByUserIdMock = vi.mocked(findIngredientsByUserId);
const updateIngredientMock = vi.mocked(updateIngredient);

const ingredient: IngredientDocument = {
  _id: "ingredient-id",
  name: "Banana",
  caloriesPerServing: 105,
  servingSize: "1 medium",
  userId: "user-id",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-02T00:00:00.000Z"),
};

const response = {
  id: "ingredient-id",
  name: "Banana",
  caloriesPerServing: 105,
  servingSize: "1 medium",
  userId: "user-id",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
};

describe("ingredient service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a user ingredient", async () => {
    createIngredientMock.mockResolvedValue(ingredient);

    await expect(
      createUserIngredient("user-id", {
        name: "Banana",
        caloriesPerServing: 105,
        servingSize: "1 medium",
      })
    ).resolves.toEqual(response);
  });

  it("lists user ingredients with search params", async () => {
    findIngredientsByUserIdMock.mockResolvedValue([ingredient]);

    await expect(listUserIngredients("user-id", { query: "ban" })).resolves.toEqual([response]);
    expect(findIngredientsByUserIdMock).toHaveBeenCalledWith("user-id", { query: "ban" });
  });

  it("gets one user ingredient", async () => {
    findIngredientByIdMock.mockResolvedValue(ingredient);

    await expect(getUserIngredient("user-id", "ingredient-id")).resolves.toEqual(response);
  });

  it("updates a user ingredient", async () => {
    updateIngredientMock.mockResolvedValue(ingredient);

    await expect(updateUserIngredient("user-id", "ingredient-id", { name: "Banana" })).resolves.toEqual(response);
  });

  it("throws when updating a missing ingredient", async () => {
    updateIngredientMock.mockResolvedValue(null);

    await expect(updateUserIngredient("user-id", "ingredient-id", { name: "Banana" })).rejects.toThrow(
      "Ingredient not found"
    );
  });

  it("deletes a user ingredient", async () => {
    deleteIngredientMock.mockResolvedValue(true);

    await expect(deleteUserIngredient("user-id", "ingredient-id")).resolves.toBeUndefined();
  });
});
