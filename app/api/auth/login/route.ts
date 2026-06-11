import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { loginUser } from "@/lib/auth/service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await loginUser(body);
    return NextResponse.json(result, { status: 200 });
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
