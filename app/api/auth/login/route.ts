import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { loginUser } from "@/lib/auth/service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await loginUser(body);
    const response = NextResponse.json(result, { status: 200 });

    response.cookies.set(AUTH_COOKIE_NAME, result.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60,
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors.map((item) => item.message).join(", ") }, { status: 422 });
    }

    if (error instanceof Error) {
      const message = error.message;
      if (message.includes("Invalid email or password")) {
        return NextResponse.json({ error: message }, { status: 401 });
      }

      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ error: "Unable to authenticate user" }, { status: 500 });
  }
}
