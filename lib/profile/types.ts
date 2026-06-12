export const GENDERS = ["male", "female"] as const;

export type Gender = (typeof GENDERS)[number];

export interface HealthProfile {
  age: number;
  gender: Gender;
  height: number;
  weight: number;
}

export interface HealthProfileCalculations {
  bmr: number;
  maintenanceCalories: number;
}

export interface HealthProfileWithCalculations extends HealthProfile, HealthProfileCalculations {}
