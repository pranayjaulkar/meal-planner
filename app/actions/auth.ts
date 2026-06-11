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
    const response = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validation.data),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.error,
      };
    }

    return {
      success: true,
      message: "Login successful",
    };
  } catch {
    return {
      success: false,
      message: "Unable to login",
    };
  }
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
    const response = await fetch(`/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validation.data),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.error,
      };
    }

    return {
      success: true,
      message: "Account created successfully",
    };
  } catch {
    return {
      success: false,
      message: "Unable to register user",
    };
  }
}
