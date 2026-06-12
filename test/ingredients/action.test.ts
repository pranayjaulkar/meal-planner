import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/lib/ingredients/service", () => ({
  createUserIngredient: vi.fn(),
  deleteUserIngredient: vi.fn(),
  updateUserIngredient: vi.fn(),
}));

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { createUserIngredient, deleteUserIngredient, updateUserIngredient } from "@/lib/ingredients/service";
import { createIngredientAction, deleteIngredientAction, updateIngredientAction } from "@/app/actions/ingredients";

const getCurrentUserMock = vi.mocked(getCurrentUser);
const createUserIngredientMock = vi.mocked(createUserIngredient);
const deleteUserIngredientMock = vi.mocked(deleteUserIngredient);
const updateUserIngredientMock = vi.mocked(updateUserIngredient);
const revalidatePathMock = vi.mocked(revalidatePath);

function ingredientFormData(overrides: Record<string, string> = {}) {
  const formData = new FormData();
  const values = {
    name: "Banana",
    caloriesPerServing: "105",
    servingSize: "1 medium",
    ...overrides,
  };

  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }

  return formData;
}

describe("ingredient actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthenticated creates", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    await expect(createIngredientAction({ success: false, message: "" }, ingredientFormData())).resolves.toEqual({
      success: false,
      message: "You must be signed in to create ingredients",
    });
  });

  it("creates valid ingredients", async () => {
    getCurrentUserMock.mockResolvedValue({ userId: "user-id", email: "test@example.com", name: "Test User" });

    await expect(createIngredientAction({ success: false, message: "" }, ingredientFormData())).resolves.toEqual({
      success: true,
      message: "Ingredient created",
      errors: {},
    });
    expect(createUserIngredientMock).toHaveBeenCalledWith("user-id", {
      name: "Banana",
      caloriesPerServing: 105,
      servingSize: "1 medium",
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
  });

  it("returns update validation errors", async () => {
    getCurrentUserMock.mockResolvedValue({ userId: "user-id", email: "test@example.com", name: "Test User" });
    const formData = ingredientFormData({ ingredientId: "ingredient-id", name: "A" });

    const result = await updateIngredientAction({ success: false, message: "" }, formData);

    expect(result.success).toBe(false);
    expect(result.errors?.name).toContain("Name must be at least 2 characters");
    expect(updateUserIngredientMock).not.toHaveBeenCalled();
  });

  it("updates valid ingredients", async () => {
    getCurrentUserMock.mockResolvedValue({ userId: "user-id", email: "test@example.com", name: "Test User" });
    const formData = ingredientFormData({ ingredientId: "ingredient-id" });

    await expect(updateIngredientAction({ success: false, message: "" }, formData)).resolves.toEqual({
      success: true,
      message: "Ingredient updated",
      errors: {},
    });
    expect(updateUserIngredientMock).toHaveBeenCalledWith("user-id", "ingredient-id", {
      name: "Banana",
      caloriesPerServing: 105,
      servingSize: "1 medium",
    });
  });

  it("deletes valid ingredients", async () => {
    getCurrentUserMock.mockResolvedValue({ userId: "user-id", email: "test@example.com", name: "Test User" });
    const formData = new FormData();
    formData.set("ingredientId", "ingredient-id");

    await deleteIngredientAction(formData);

    expect(deleteUserIngredientMock).toHaveBeenCalledWith("user-id", "ingredient-id");
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
  });
});
