"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCreateMealModal } from "@/stores/create-meal-modal";
import { CardDescription, CardHeader, CardTitle } from "../ui/card";

export function MealsCardHeader() {
  const openModal = useCreateMealModal((state) => state.openModal);

  return (
    <CardHeader>
      <div className="flex items-start justify-between gap-4">
        <div>
          <CardTitle>Meals</CardTitle>
          <CardDescription>Create meals from ingredients.</CardDescription>
        </div>

        <Button size="icon" onClick={openModal} aria-label="Create meal">
          <Plus className="size-4" />
        </Button>
      </div>
    </CardHeader>
  );
}
