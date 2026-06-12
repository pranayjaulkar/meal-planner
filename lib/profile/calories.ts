import type { HealthProfile, HealthProfileCalculations } from "./types";

const SEDENTARY_ACTIVITY_FACTOR = 1.2;

/**
 * Calculates basal metabolic rate with the Mifflin-St Jeor formula.
 * Height is centimeters and weight is kilograms.
 */
export function calculateBmr({ age, gender, height, weight }: HealthProfile): number {
  const genderOffset = gender === "male" ? 5 : -161;

  return Math.round(10 * weight + 6.25 * height - 5 * age + genderOffset);
}

/**
 * Estimates maintenance calories from BMR.
 * The current profile only captures age, gender, height, and weight, so the
 * maintenance estimate uses the standard sedentary activity multiplier.
 */
export function calculateMaintenanceCalories(bmr: number): number {
  return Math.round(bmr * SEDENTARY_ACTIVITY_FACTOR);
}

export function calculateHealthProfileMetrics(profile: HealthProfile): HealthProfileCalculations {
  const bmr = calculateBmr(profile);

  return {
    bmr,
    maintenanceCalories: calculateMaintenanceCalories(bmr),
  };
}
