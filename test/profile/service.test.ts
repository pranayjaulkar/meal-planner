import { beforeEach, describe, expect, it, vi } from "vitest";

import type { HealthProfile } from "@/lib/profile/types";

vi.mock("@/lib/profile/repository", () => ({
  findHealthProfileByUserId: vi.fn(),
  upsertHealthProfile: vi.fn(),
}));

import { findHealthProfileByUserId, upsertHealthProfile } from "@/lib/profile/repository";
import { getHealthProfile, saveHealthProfile } from "@/lib/profile/service";

const findHealthProfileByUserIdMock = vi.mocked(findHealthProfileByUserId);
const upsertHealthProfileMock = vi.mocked(upsertHealthProfile);

const profile: HealthProfile = {
  age: 30,
  gender: "male",
  height: 180,
  weight: 80,
};

describe("health profile service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when a user has no profile", async () => {
    findHealthProfileByUserIdMock.mockResolvedValue(null);

    await expect(getHealthProfile("user-id")).resolves.toBeNull();
  });

  it("adds calorie calculations to a stored profile", async () => {
    findHealthProfileByUserIdMock.mockResolvedValue(profile);

    await expect(getHealthProfile("user-id")).resolves.toEqual({
      ...profile,
      bmr: 1780,
      maintenanceCalories: 2136,
    });
  });

  it("validates and saves profile data", async () => {
    upsertHealthProfileMock.mockResolvedValue(profile);

    await expect(saveHealthProfile("user-id", profile)).resolves.toEqual({
      ...profile,
      bmr: 1780,
      maintenanceCalories: 2136,
    });

    expect(upsertHealthProfileMock).toHaveBeenCalledWith("user-id", profile);
  });
});
