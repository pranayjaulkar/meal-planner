import { redirect } from "next/navigation";

import { IngredientCreateForm } from "@/components/ingredients/ingredient-create-form";
import { IngredientList } from "@/components/ingredients/ingredient-list";
import { IngredientSearchForm } from "@/components/ingredients/ingredient-search-form";
import { ProfileForm } from "@/components/profile/profile-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { listUserIngredients } from "@/lib/ingredients/service";
import { getHealthProfile } from "@/lib/profile/service";

type HomeProps = {
  searchParams: Promise<{
    ingredientQuery?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { ingredientQuery } = await searchParams;
  const query = ingredientQuery?.trim() || undefined;
  const profile = await getHealthProfile(user.userId);
  const ingredients = await listUserIngredients(user.userId, { query });

  return (
    <main className="w-full flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-5xl gap-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Meal planner</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Your nutrition dashboard</h1>
          <p className="text-muted-foreground">
            Manage your profile, ingredients, and calorie estimates from one place.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.8fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
              <CardDescription>Create, search, edit, and delete your ingredient library.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <IngredientCreateForm />
              <IngredientSearchForm query={query} />
              <IngredientList ingredients={ingredients} query={query} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Health profile</CardTitle>
              <CardDescription>Height is stored in centimeters and weight in kilograms.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm profile={profile} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
