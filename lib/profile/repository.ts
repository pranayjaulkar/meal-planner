import mongoose from "mongoose";

import { connectToDatabase } from "@/lib/db";
import UserModel from "@/lib/auth/model";
import type { HealthProfile } from "./types";

export async function findHealthProfileByUserId(userId: string): Promise<HealthProfile | null> {
  if (!mongoose.isValidObjectId(userId)) {
    return null;
  }

  await connectToDatabase();

  const user = await UserModel.findById(userId).select("healthProfile").lean<{
    healthProfile?: HealthProfile;
  } | null>();

  return user?.healthProfile ?? null;
}

export async function upsertHealthProfile(userId: string, profile: HealthProfile): Promise<HealthProfile> {
  if (!mongoose.isValidObjectId(userId)) {
    throw new Error("User not found");
  }

  await connectToDatabase();

  const user = await UserModel.findByIdAndUpdate(
    userId,
    { $set: { healthProfile: profile } },
    { new: true, runValidators: true }
  ).lean<{ healthProfile?: HealthProfile } | null>();

  if (!user?.healthProfile) {
    throw new Error("User not found");
  }

  return user.healthProfile;
}
