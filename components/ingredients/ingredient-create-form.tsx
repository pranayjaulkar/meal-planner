"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { createIngredientAction, type IngredientActionState } from "@/app/actions/ingredients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const initialState: IngredientActionState = {
  success: false,
  message: "",
  errors: {},
};

function errorFor(state: IngredientActionState, field: string) {
  return state.errors?.[field]?.[0];
}

export function IngredientCreateForm() {
  const [state, formAction, pending] = useActionState(createIngredientAction, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_9rem_10rem]">
        <div className="space-y-2">
          <Label htmlFor="ingredient-name">Name</Label>
          <Input
            id="ingredient-name"
            name="name"
            placeholder="Chicken breast"
            aria-invalid={!!errorFor(state, "name")}
            required
          />
          {errorFor(state, "name") && <p className="text-sm text-destructive">{errorFor(state, "name")}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ingredient-calories">Calories</Label>
          <Input
            id="ingredient-calories"
            name="caloriesPerServing"
            type="number"
            min="0"
            max="5000"
            step="0.1"
            placeholder="165"
            aria-invalid={!!errorFor(state, "caloriesPerServing")}
            required
          />
          {errorFor(state, "caloriesPerServing") && (
            <p className="text-sm text-destructive">{errorFor(state, "caloriesPerServing")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ingredient-serving-size">Serving size</Label>
          <Input
            id="ingredient-serving-size"
            name="servingSize"
            placeholder="100 g"
            aria-invalid={!!errorFor(state, "servingSize")}
            required
          />
          {errorFor(state, "servingSize") && (
            <p className="text-sm text-destructive">{errorFor(state, "servingSize")}</p>
          )}
        </div>
      </div>

      {state.message && (
        <Alert variant={state.success ? "default" : "destructive"}>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full sm:w-fit" disabled={pending}>
        {pending && <Loader2 className="mr-2 size-4 animate-spin" />}
        Create ingredient
      </Button>
    </form>
  );
}
