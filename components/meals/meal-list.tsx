"use client";

import { useActionState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { deleteMealAction, updateMealAction, type MealActionState } from "@/app/actions/meals";

import type { MealResponseDto } from "@/lib/meals";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: MealActionState = {
  success: false,
  message: "",
  errors: {},
};

function errorFor(state: MealActionState, field: string) {
  return state.errors?.[field]?.[0];
}

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="destructive" size="icon" disabled={pending} aria-label="Delete meal">
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
    </Button>
  );
}

function MealListItem({ meal }: { meal: MealResponseDto }) {
  const [state, formAction, pending] = useActionState(updateMealAction, initialState);

  return (
    <li className="grid gap-4 rounded-lg border p-4">
      <form action={formAction} className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <input type="hidden" name="mealId" value={meal._id} />

        <div className="space-y-2">
          <Label htmlFor={`meal-name-${meal._id}`}>Meal Name</Label>

          <Input
            id={`meal-name-${meal._id}`}
            name="name"
            defaultValue={meal.name}
            aria-invalid={!!errorFor(state, "name")}
            required
          />

          {errorFor(state, "name") && <p className="text-sm text-destructive">{errorFor(state, "name")}</p>}
        </div>

        <div className="flex gap-2 self-end">
          <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Save
          </Button>
        </div>
      </form>

      <div className="rounded-md bg-muted/40 p-3">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm text-muted-foreground">Total Calories</p>
            <p className="text-xl font-semibold">{meal.totalCalories} kcal</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Ingredients</p>
            <p className="text-xl font-semibold">{meal.ingredients.length}</p>
          </div>
        </div>

        {meal.ingredients.length > 0 && (
          <div className="space-y-2">
            {meal.ingredients.map((ingredient,idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded border bg-background px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">{ingredient.ingredientName}</p>
                  <p className="text-muted-foreground">
                    {ingredient.servings} serving
                    {ingredient.servings !== 1 ? "s" : ""}
                  </p>
                </div>

                <span className="font-medium">{ingredient.calories} kcal</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <form action={deleteMealAction}>
          <input type="hidden" name="mealId" value={meal._id} />
          <DeleteButton />
        </form>
      </div>

      {state.message && (
        <Alert variant={state.success ? "default" : "destructive"}>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
    </li>
  );
}

export function MealList({ meals, query }: { meals: MealResponseDto[]; query?: string }) {
  if (meals.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
        {query ? "No meals match your search." : "No meals yet. Create your first meal above."}
      </div>
    );
  }

  return (
    <ul className="grid gap-3">
      {meals.map((meal) => (
        <MealListItem key={meal._id} meal={meal} />
      ))}
    </ul>
  );
}
