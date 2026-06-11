import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { registerUser } from "@/lib/auth/service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await registerUser(body);
    return NextResponse.json(result, { status: 201 });
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
