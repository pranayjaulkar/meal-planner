"use client";

import { useActionState } from "react";
import { signupAction } from "@/app/actions/auth";
import { SubmitButton } from "./submit-button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const initialState = {
  success: false,
  message: "",
  errors: {},
};

export function SignupForm() {
  const [state, formAction] = useActionState(
    signupAction,
    initialState
  );

  return (
    <form
      action={formAction}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="name">
          Full Name
        </Label>

        <Input
          id="name"
          name="name"
          placeholder="John Doe"
        />

        {state.errors?.name && (
          <p className="text-sm text-destructive">
            {state.errors.name[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email
        </Label>

        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
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
        />

        {state.errors?.password && (
          <p className="text-sm text-destructive">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">
          Confirm Password
        </Label>

        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
        />

        {state.errors?.confirmPassword && (
          <p className="text-sm text-destructive">
            {state.errors.confirmPassword[0]}
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
        Create Account
      </SubmitButton>
    </form>
  );
}