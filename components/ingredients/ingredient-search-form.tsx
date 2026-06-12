import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function IngredientSearchForm({ query }: { query?: string }) {
  return (
    <form action="/" className="flex flex-col gap-2 sm:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input name="ingredientQuery" defaultValue={query ?? ""} placeholder="Search ingredients" className="pl-8" />
      </div>
      <Button type="submit" variant="outline" className="w-full sm:w-fit">
        Search
      </Button>
    </form>
  );
}
