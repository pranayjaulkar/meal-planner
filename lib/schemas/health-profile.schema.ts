import { z } from "zod";

import { GENDERS } from "../profile/types";

const numericString = (field: string) =>
  z.coerce.number({
    invalid_type_error: `${field} must be a number`,
  });

export const healthProfileSchema = z.object({
  age: numericString("Age")
    .int("Age must be a whole number")
    .min(13, "Age must be at least 13")
    .max(120, "Age must be 120 or less"),
  gender: z.enum(GENDERS, {
    errorMap: () => ({ message: "Gender must be male or female" }),
  }),
  height: numericString("Height")
    .min(100, "Height must be at least 100 cm")
    .max(250, "Height must be 250 cm or less"),
  weight: numericString("Weight")
    .min(30, "Weight must be at least 30 kg")
    .max(300, "Weight must be 300 kg or less"),
});

export type HealthProfileInput = z.infer<typeof healthProfileSchema>;
