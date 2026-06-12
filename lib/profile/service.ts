import { healthProfileSchema } from "@/lib/schemas/health-profile.schema";
import type { HealthProfileResponseDto, UpsertHealthProfileDto } from "./dto";
import { calculateHealthProfileMetrics } from "./calories";
import { findHealthProfileByUserId, upsertHealthProfile } from "./repository";
import type { HealthProfile } from "./types";

function toResponseDto(profile: HealthProfile): HealthProfileResponseDto {
  return {
    ...profile,
    ...calculateHealthProfileMetrics(profile),
  };
}

export async function getHealthProfile(userId: string): Promise<HealthProfileResponseDto | null> {
  const profile = await findHealthProfileByUserId(userId);

  return profile ? toResponseDto(profile) : null;
}

export async function saveHealthProfile(
  userId: string,
  data: UpsertHealthProfileDto
): Promise<HealthProfileResponseDto> {
  const profile = healthProfileSchema.parse(data);
  const savedProfile = await upsertHealthProfile(userId, profile);

  return toResponseDto(savedProfile);
}
