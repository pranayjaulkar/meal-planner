import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME } from "./constants";

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