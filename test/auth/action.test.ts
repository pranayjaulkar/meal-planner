import { beforeEach, describe, expect, it, vi } from "vitest";

const cookieSetMock = vi.hoisted(() => vi.fn());
const redirectMock = vi.hoisted(() =>
  vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  })
);

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    set: cookieSetMock,
  })),
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

vi.mock("@/lib/auth/service", () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
}));

import { loginUser, registerUser } from "@/lib/auth/service";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { loginAction, signupAction } from "@/app/actions/auth";

const loginUserMock = vi.mocked(loginUser);
const registerUserMock = vi.mocked(registerUser);

describe("auth actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sets the auth cookie and redirects home after login", async () => {
    loginUserMock.mockResolvedValue({
      token: "auth-token",
      user: {
        id: "user-id",
        name: "Test User",
        email: "test@example.com",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    });
    const formData = new FormData();
    formData.set("email", "test@example.com");
    formData.set("password", "password123");

    await expect(loginAction({ success: false, message: "" }, formData)).rejects.toThrow("NEXT_REDIRECT:/");
    expect(cookieSetMock).toHaveBeenCalledWith(
      AUTH_COOKIE_NAME,
      "auth-token",
      expect.objectContaining({
        httpOnly: true,
        path: "/",
        maxAge: 3600,
      })
    );
  });

  it("sets the auth cookie and redirects home after signup", async () => {
    registerUserMock.mockResolvedValue({
      token: "auth-token",
      user: {
        id: "user-id",
        name: "Test User",
        email: "test@example.com",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    });
    const formData = new FormData();
    formData.set("name", "Test User");
    formData.set("email", "test@example.com");
    formData.set("password", "password123");
    formData.set("confirmPassword", "password123");

    await expect(signupAction({ success: false, message: "" }, formData)).rejects.toThrow("NEXT_REDIRECT:/");
    expect(cookieSetMock).toHaveBeenCalledWith(AUTH_COOKIE_NAME, "auth-token", expect.any(Object));
  });
});
