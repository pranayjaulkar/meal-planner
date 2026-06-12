import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getCurrentUser } from "@/lib/auth/session";
import { createUserIngredient, listUserIngredients } from "@/lib/ingredients/service";

export async function GET(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim() || undefined;
  const ingredients = await listUserIngredients(user.userId, { query });

  return NextResponse.json({ ingredients });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const ingredient = await createUserIngredient(user.userId, body);

    return NextResponse.json({ ingredient }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors.map((item) => item.message).join(", ") }, { status: 422 });
    }

    return NextResponse.json({ error: "Unable to create ingredient" }, { status: 400 });
  }
}
