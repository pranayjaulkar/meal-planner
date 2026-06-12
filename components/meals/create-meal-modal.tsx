"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

import { createMealAction, MealActionState } from "@/app/actions/meals";
import type { IngredientResponseDto } from "@/lib/ingredients";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useCreateMealModal } from "@/stores/create-meal-modal";

type Props = {
  ingredients: IngredientResponseDto[];
};

const initialState = {
  success: false,
  message: "",
  errors: {},
};

type SelectedIngredient = {
  ingredientId: string;
  servings: number;
};

export function CreateMealModal({ ingredients }: Props) {
  const open = useCreateMealModal((state) => state.open);
  const closeModal = useCreateMealModal((state) => state.closeModal);

  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);

  const [state, formAction, pending] = useActionState(createMealAction, initialState);

  const totalCalories = useMemo(() => {
    return selectedIngredients.reduce((total, selected) => {
      const ingredient = ingredients.find((i) => i.id === selected.ingredientId);

      if (!ingredient) {
        return total;
      }

      return total + ingredient.caloriesPerServing * selected.servings;
    }, 0);
  }, [selectedIngredients, ingredients]);

  const canSubmit =
    selectedIngredients.length > 0 &&
    selectedIngredients.every((ingredient) => ingredient.ingredientId && ingredient.servings > 0);

  function addIngredient() {
    setSelectedIngredients((current) => [
      ...current,
      {
        ingredientId: "",
        servings: 1,
      },
    ]);
  }

  function errorFor(errors: MealActionState["errors"], field: string) {
    return errors?.[field]?.[0];
  }

  function removeIngredient(index: number) {
    setSelectedIngredients((current) => current.filter((_, i) => i !== index));
  }

  function updateIngredient(index: number, updates: Partial<SelectedIngredient>) {
    setSelectedIngredients((current) => current.map((item, i) => (i === index ? { ...item, ...updates } : item)));
  }

  useEffect(() => {
    if (state.success) {
      setSelectedIngredients([]);

      closeModal();
    }
  }, [state.success, closeModal]);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          closeModal();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Meal</DialogTitle>

          <DialogDescription>Combine ingredients to create a meal.</DialogDescription>
        </DialogHeader>

        <form
          action={(formData) => {
            formData.set("ingredients", JSON.stringify(selectedIngredients));

            formAction(formData);
          }}
          className="grid gap-6"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Meal Name</Label>

            <Input
              id="name"
              name="name"
              placeholder="Chicken Rice Bowl"
              aria-invalid={!!errorFor(state.errors, "name")}
            />

            {errorFor(state.errors, "name") && (
              <p className="text-sm text-destructive">{errorFor(state.errors, "name")}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Ingredients</Label>

              <Button type="button" size="sm" variant="outline" onClick={addIngredient}>
                <Plus className="mr-2 size-4" />
                Add Ingredient
              </Button>
            </div>

            {errorFor(state.errors, "ingredients") && (
              <p className="text-sm text-destructive">{errorFor(state.errors, "ingredients")}</p>
            )}

            {selectedIngredients.length === 0 && (
              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                No ingredients added yet.
              </div>
            )}

            {selectedIngredients.map((selected, index) => {
              const ingredient = ingredients.find((i) => i.id === selected.ingredientId);

              const calories = ingredient ? ingredient.caloriesPerServing * selected.servings : 0;

              return (
                <div key={index} className="grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_120px_auto]">
                  <div>
                    <select
                      value={selected.ingredientId}
                      onChange={(e) =>
                        updateIngredient(index, {
                          ingredientId: e.target.value,
                        })
                      }
                      className="h-9 w-full rounded-md border bg-background px-3"
                    >
                      <option value="">Select ingredient</option>

                      {ingredients.map((ingredient) => (
                        <option key={ingredient.id} value={ingredient.id}>
                          {ingredient.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={selected.servings}
                    onChange={(e) =>
                      updateIngredient(index, {
                        servings: Number(e.target.value) || 0,
                      })
                    }
                  />

                  <Button type="button" size="icon" variant="destructive" onClick={() => removeIngredient(index)}>
                    <Trash2 className="size-4" />
                  </Button>

                  {ingredient && (
                    <div className="md:col-span-3 text-sm text-muted-foreground">
                      {ingredient.caloriesPerServing} kcal × {selected.servings} ={" "}
                      <span className="font-medium text-foreground">{calories.toFixed(0)} kcal</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">Total Calories</p>

            <p className="text-3xl font-semibold">{Math.round(totalCalories)}</p>
          </div>

          {state.message && (
            <Alert variant={state.success ? "default" : "destructive"}>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={pending || !canSubmit}>
            {pending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Create Meal
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
