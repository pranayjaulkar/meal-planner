import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { registerUser } from "@/lib/auth/service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await registerUser(body);
    const response = NextResponse.json(result, { status: 201 });

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
      if (error.message.includes("already exists")) {
        return NextResponse.json({ error: error.message }, { status: 409 });
      }

      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Unable to register user" }, { status: 500 });
  }
}
