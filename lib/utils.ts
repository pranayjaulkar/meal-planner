import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import mongoose from "mongoose";

export function serializeDocument<T>(value: T): T {
  return serialize(value) as T;
}

function serialize(value: unknown): unknown {
  if (value == null) {
    return value;
  }

  if (value instanceof mongoose.Types.ObjectId) {
    return value.toString();
  }

  if (value instanceof Date) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(serialize);
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toObject" in value &&
    typeof (value as { toObject: () => unknown }).toObject === "function"
  ) {
    return serialize((value as { toObject: () => unknown }).toObject());
  }

  if (typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, serialize(val)]));
  }

  return value;
}
