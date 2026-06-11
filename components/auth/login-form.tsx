"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import { SubmitButton } from "./submit-button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const initialState = {
  success: false,
  message: "",
  errors: {},
};

export function LoginForm() {
  const [state, formAction] = useActionState(
    loginAction,
    initialState
  );

  return (
    <form
      action={formAction}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="email">
          Email
        </Label>

        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          aria-invalid={!!state.errors?.email}
        />

        {state.errors?.email && (
          <p className="text-sm text-destructive">
            {state.errors.email[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          Password
        </Label>

        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          aria-invalid={!!state.errors?.password}
        />

        {state.errors?.password && (
          <p className="text-sm text-destructive">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      {state.message && (
        <p
          className={
            state.success
              ? "text-sm text-green-600"
              : "text-sm text-destructive"
          }
        >
          {state.message}
        </p>
      )}

      <SubmitButton>
        Sign In
      </SubmitButton>
    </form>
  );
}