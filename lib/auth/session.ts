import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME } from "./constants";
import { verifyAuthToken } from "./jwt";

export async function getSession() {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    AUTH_COOKIE_NAME
  )?.value;

  return {
    isAuthenticated: !!token,
    token,
  };
}

export async function getCurrentUser() {
  const { token } = await getSession();

  if (!token) {
    return null;
  }

  try {
    return verifyAuthToken(token);
  } catch {
    return null;
  }
}
