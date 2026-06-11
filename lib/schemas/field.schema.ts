import { z } from "zod";
const nameRegex = /^[\p{L}0-9'\-.\s]+$/u;

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be at most 100 characters")
  .regex(nameRegex, "Name contains invalid characters");

export const emailSchema = z.string().trim().toLowerCase().email("Please enter a valid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters")
  .regex(/^(?=.*[A-Za-z])(?=.*\d).*$/, "Password must contain at least one letter and one number");
