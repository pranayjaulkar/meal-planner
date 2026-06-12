"use client";

import { useActionState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import {
  deleteIngredientAction,
  updateIngredientAction,
  type IngredientActionState,
} from "@/app/actions/ingredients";
import type { IngredientResponseDto } from "@/lib/ingredients/dto";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: IngredientActionState = {
  success: false,
  message: "",
  errors: {},
};

function errorFor(state: IngredientActionState, field: string) {
  return state.errors?.[field]?.[0];
}

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="destructive" size="icon" disabled={pending} aria-label="Delete ingredient">
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
    </Button>
  );
}

function IngredientListItem({ ingredient }: { ingredient: IngredientResponseDto }) {
  const [state, formAction, pending] = useActionState(updateIngredientAction, initialState);

  return (
    <li className="grid gap-4 rounded-lg border p-4">
      <form action={formAction} className="grid gap-4 lg:grid-cols-[1fr_9rem_10rem_auto] lg:items-end">
        <input type="hidden" name="ingredientId" value={ingredient.id} />

        <div className="space-y-2">
          <Label htmlFor={`name-${ingredient.id}`}>Name</Label>
          <Input
            id={`name-${ingredient.id}`}
            name="name"
            defaultValue={ingredient.name}
            aria-invalid={!!errorFor(state, "name")}
            required
          />
          {errorFor(state, "name") && <p className="text-sm text-destructive">{errorFor(state, "name")}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`calories-${ingredient.id}`}>Calories</Label>
          <Input
            id={`calories-${ingredient.id}`}
            name="caloriesPerServing"
            type="number"
            min="0"
            max="5000"
            step="0.1"
            defaultValue={ingredient.caloriesPerServing}
            aria-invalid={!!errorFor(state, "caloriesPerServing")}
            required
          />
          {errorFor(state, "caloriesPerServing") && (
            <p className="text-sm text-destructive">{errorFor(state, "caloriesPerServing")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`serving-${ingredient.id}`}>Serving size</Label>
          <Input
            id={`serving-${ingredient.id}`}
            name="servingSize"
            defaultValue={ingredient.servingSize}
            aria-invalid={!!errorFor(state, "servingSize")}
            required
          />
          {errorFor(state, "servingSize") && (
            <p className="text-sm text-destructive">{errorFor(state, "servingSize")}</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="flex-1 lg:flex-none" disabled={pending}>
            {pending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Save
          </Button>
        </div>
      </form>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {ingredient.caloriesPerServing} calories per {ingredient.servingSize}
        </p>
        <form action={deleteIngredientAction}>
          <input type="hidden" name="ingredientId" value={ingredient.id} />
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

export function IngredientList({
  ingredients,
  query,
}: {
  ingredients: IngredientResponseDto[];
  query?: string;
}) {
  if (ingredients.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
        {query ? "No ingredients match your search." : "No ingredients yet. Create your first ingredient above."}
      </div>
    );
  }

  return (
    <ul className="grid gap-3">
      {ingredients.map((ingredient) => (
        <IngredientListItem key={ingredient.id} ingredient={ingredient} />
      ))}
    </ul>
  );
}
