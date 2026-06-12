"use server";

import { revalidatePath } from "next/cache";

import { setAuthCookie } from "@/lib/auth/cookies";
import { signAuthToken } from "@/lib/auth/jwt";
import { getCurrentUser } from "@/lib/auth/session";
import { findUserByEmail } from "@/lib/auth/service";
import { healthProfileSchema } from "@/lib/schemas/health-profile.schema";
import { saveHealthProfile } from "@/lib/profile/service";

export type ProfileActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  maintenanceCalories?: number;
  bmr?: number;
};

export async function updateHealthProfileAction(
  previousState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  void previousState;

  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      message: "You must be signed in to update your profile",
    };
  }

  const values = {
    age: formData.get("age"),
    gender: formData.get("gender"),
    height: formData.get("height"),
    weight: formData.get("weight"),
  };

  const validation = healthProfileSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  let profile;

  try {
    profile = await saveHealthProfile(user.userId, validation.data);
  } catch (error) {
    if (error instanceof Error && error.message === "User not found") {
      const refreshedUser = await findUserByEmail(user.email);

      if (!refreshedUser) {
        return {
          success: false,
          message: "Your session is stale. Please sign in again.",
        };
      }

      const token = signAuthToken({
        userId: refreshedUser.id,
        email: refreshedUser.email,
        name: refreshedUser.name,
      });

      await setAuthCookie(token);
      profile = await saveHealthProfile(refreshedUser.id, validation.data);
    } else {
      console.error("[profile] Unable to update profile", error);

      return {
        success: false,
        message: "Unable to update profile",
      };
    }
  }

  try {
    revalidatePath("/");
  } catch (error) {
    console.error("[profile] Unable to revalidate profile page", error);
  }

  return {
    success: true,
    message: "Profile updated",
    bmr: profile.bmr,
    maintenanceCalories: profile.maintenanceCalories,
  };
}
