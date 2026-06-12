import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/lib/auth/service", () => ({
  findUserByEmail: vi.fn(),
}));

vi.mock("@/lib/auth/jwt", () => ({
  signAuthToken: vi.fn(() => "fresh-token"),
}));

vi.mock("@/lib/auth/cookies", () => ({
  setAuthCookie: vi.fn(),
}));

vi.mock("@/lib/profile/service", () => ({
  saveHealthProfile: vi.fn(),
}));

import { revalidatePath } from "next/cache";
import { setAuthCookie } from "@/lib/auth/cookies";
import { signAuthToken } from "@/lib/auth/jwt";
import { getCurrentUser } from "@/lib/auth/session";
import { findUserByEmail } from "@/lib/auth/service";
import { saveHealthProfile } from "@/lib/profile/service";
import { updateHealthProfileAction } from "@/app/actions/profile";

const getCurrentUserMock = vi.mocked(getCurrentUser);
const findUserByEmailMock = vi.mocked(findUserByEmail);
const signAuthTokenMock = vi.mocked(signAuthToken);
const setAuthCookieMock = vi.mocked(setAuthCookie);
const saveHealthProfileMock = vi.mocked(saveHealthProfile);
const revalidatePathMock = vi.mocked(revalidatePath);

function profileFormData(overrides: Record<string, string> = {}) {
  const formData = new FormData();
  const values = {
    age: "30",
    gender: "male",
    height: "180",
    weight: "80",
    ...overrides,
  };

  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }

  return formData;
}

describe("updateHealthProfileAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthenticated submissions", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    await expect(updateHealthProfileAction({ success: false, message: "" }, profileFormData())).resolves.toEqual({
      success: false,
      message: "You must be signed in to update your profile",
    });
  });

  it("returns field errors for invalid profile data", async () => {
    getCurrentUserMock.mockResolvedValue({
      userId: "user-id",
      email: "test@example.com",
      name: "Test User",
    });

    const result = await updateHealthProfileAction(
      { success: false, message: "" },
      profileFormData({ age: "12", gender: "invalid" })
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe("Validation failed");
    expect(result.errors?.age).toContain("Age must be at least 13");
    expect(result.errors?.gender).toContain("Gender must be male or female");
    expect(saveHealthProfileMock).not.toHaveBeenCalled();
  });

  it("saves valid profile data for the authenticated user", async () => {
    getCurrentUserMock.mockResolvedValue({
      userId: "user-id",
      email: "test@example.com",
      name: "Test User",
    });
    saveHealthProfileMock.mockResolvedValue({
      age: 30,
      gender: "male",
      height: 180,
      weight: 80,
      bmr: 1780,
      maintenanceCalories: 2136,
    });

    await expect(updateHealthProfileAction({ success: false, message: "" }, profileFormData())).resolves.toEqual({
      success: true,
      message: "Profile updated",
      bmr: 1780,
      maintenanceCalories: 2136,
    });

    expect(saveHealthProfileMock).toHaveBeenCalledWith("user-id", {
      age: 30,
      gender: "male",
      height: 180,
      weight: 80,
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
  });

  it("refreshes a stale session by email and retries the save", async () => {
    getCurrentUserMock.mockResolvedValue({
      userId: "stale-user-id",
      email: "test@example.com",
      name: "Test User",
    });
    findUserByEmailMock.mockResolvedValue({
      id: "fresh-user-id",
      email: "test@example.com",
      name: "Test User",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
    saveHealthProfileMock
      .mockRejectedValueOnce(new Error("User not found"))
      .mockResolvedValueOnce({
        age: 30,
        gender: "male",
        height: 180,
        weight: 80,
        bmr: 1780,
        maintenanceCalories: 2136,
      });

    await expect(updateHealthProfileAction({ success: false, message: "" }, profileFormData())).resolves.toMatchObject({
      success: true,
      message: "Profile updated",
    });
    expect(findUserByEmailMock).toHaveBeenCalledWith("test@example.com");
    expect(signAuthTokenMock).toHaveBeenCalledWith({
      userId: "fresh-user-id",
      email: "test@example.com",
      name: "Test User",
    });
    expect(setAuthCookieMock).toHaveBeenCalledWith("fresh-token");
    expect(saveHealthProfileMock).toHaveBeenLastCalledWith("fresh-user-id", {
      age: 30,
      gender: "male",
      height: 180,
      weight: 80,
    });
  });

  it("returns a stale session message when the email cannot be recovered", async () => {
    getCurrentUserMock.mockResolvedValue({
      userId: "stale-user-id",
      email: "missing@example.com",
      name: "Missing User",
    });
    findUserByEmailMock.mockResolvedValue(null);
    saveHealthProfileMock.mockRejectedValue(new Error("User not found"));

    await expect(updateHealthProfileAction({ success: false, message: "" }, profileFormData())).resolves.toEqual({
      success: false,
      message: "Your session is stale. Please sign in again.",
    });
  });
});
