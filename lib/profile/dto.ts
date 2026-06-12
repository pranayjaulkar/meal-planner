import type { Gender } from "./types";

export interface UpsertHealthProfileDto {
  age: number;
  gender: Gender;
  height: number;
  weight: number;
}

export interface HealthProfileResponseDto {
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  bmr: number;
  maintenanceCalories: number;
}
