"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { updateHealthProfileAction, type ProfileActionState } from "@/app/actions/profile";
import type { HealthProfileResponseDto } from "@/lib/profile/dto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const initialState: ProfileActionState = {
  success: false,
  message: "",
  errors: {},
};

function fieldError(errors: ProfileActionState["errors"], field: string) {
  return errors?.[field]?.[0];
}

export function ProfileForm({ profile }: { profile: HealthProfileResponseDto | null }) {
  const [state, formAction, pending] = useActionState(updateHealthProfileAction, {
    ...initialState,
    bmr: profile?.bmr,
    maintenanceCalories: profile?.maintenanceCalories,
  });

  const maintenanceCalories = state.maintenanceCalories ?? profile?.maintenanceCalories;
  const bmr = state.bmr ?? profile?.bmr;

  return (
    <form action={formAction} className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            name="age"
            type="number"
            min="13"
            max="120"
            defaultValue={profile?.age ?? ""}
            aria-invalid={!!fieldError(state.errors, "age")}
            required
          />
          {fieldError(state.errors, "age") && <p className="text-sm text-destructive">{fieldError(state.errors, "age")}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <select
            id="gender"
            name="gender"
            defaultValue={profile?.gender ?? ""}
            aria-invalid={!!fieldError(state.errors, "gender")}
            required
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30"
          >
            <option value="" disabled>
              Select gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {fieldError(state.errors, "gender") && (
            <p className="text-sm text-destructive">{fieldError(state.errors, "gender")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            name="height"
            type="number"
            min="100"
            max="250"
            step="0.1"
            defaultValue={profile?.height ?? ""}
            aria-invalid={!!fieldError(state.errors, "height")}
            required
          />
          {fieldError(state.errors, "height") && (
            <p className="text-sm text-destructive">{fieldError(state.errors, "height")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="30"
            max="300"
            step="0.1"
            defaultValue={profile?.weight ?? ""}
            aria-invalid={!!fieldError(state.errors, "weight")}
            required
          />
          {fieldError(state.errors, "weight") && (
            <p className="text-sm text-destructive">{fieldError(state.errors, "weight")}</p>
          )}
        </div>
      </div>

      {maintenanceCalories ? (
        <div className="grid gap-3 rounded-lg border bg-muted/40 p-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Maintenance calories</p>
            <p className="text-3xl font-semibold tracking-tight">{maintenanceCalories}</p>
            <p className="text-sm text-muted-foreground">calories/day</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">BMR</p>
            <p className="text-3xl font-semibold tracking-tight">{bmr}</p>
            <p className="text-sm text-muted-foreground">calories/day</p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          Enter your profile details to calculate maintenance calories.
        </div>
      )}

      {state.message && (
        <Alert variant={state.success ? "default" : "destructive"}>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full sm:w-fit" disabled={pending}>
        {pending && <Loader2 className="mr-2 size-4 animate-spin" />}
        Save profile
      </Button>
    </form>
  );
}
