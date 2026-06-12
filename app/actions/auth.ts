"use server";

import { redirect } from "next/navigation";

import { DEFAULT_LOGIN_REDIRECT } from "@/lib/auth/constants";
import { setAuthCookie } from "@/lib/auth/cookies";
import { loginUser, registerUser } from "@/lib/auth/service";
import { loginSchema, signupSchema } from "@/lib/schemas/auth.schema";

export type AuthActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function loginAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const values = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validation = loginSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await loginUser(validation.data);
    await setAuthCookie(result.token);
  } catch {
    return {
      success: false,
      message: "Unable to login",
    };
  }

  redirect(DEFAULT_LOGIN_REDIRECT);
}

export async function signupAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const values = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const validation = signupSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await registerUser(validation.data);
    await setAuthCookie(result.token);
  } catch {
    return {
      success: false,
      message: "Unable to register user",
    };
  }

  redirect(DEFAULT_LOGIN_REDIRECT);
}
