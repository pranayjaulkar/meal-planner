import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getCurrentUser } from "@/lib/auth/session";
import { deleteUserIngredient, getUserIngredient, updateUserIngredient } from "@/lib/ingredients/service";

type IngredientRouteContext = {
  params: Promise<{
    ingredientId: string;
  }>;
};

export async function GET(_: Request, { params }: IngredientRouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ingredientId } = await params;
  const ingredient = await getUserIngredient(user.userId, ingredientId);

  if (!ingredient) {
    return NextResponse.json({ error: "Ingredient not found" }, { status: 404 });
  }

  return NextResponse.json({ ingredient });
}

export async function PATCH(request: Request, { params }: IngredientRouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { ingredientId } = await params;
    const body = await request.json();
    const ingredient = await updateUserIngredient(user.userId, ingredientId, body);

    return NextResponse.json({ ingredient });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors.map((item) => item.message).join(", ") }, { status: 422 });
    }

    if (error instanceof Error && error.message === "Ingredient not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: "Unable to update ingredient" }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: IngredientRouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { ingredientId } = await params;
    await deleteUserIngredient(user.userId, ingredientId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "Ingredient not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: "Unable to delete ingredient" }, { status: 400 });
  }
}
