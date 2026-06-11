import jwt from "jsonwebtoken";

export interface AuthTokenPayload {
  userId: string;
  email: string;
  name: string;
}

export function signAuthToken(payload: AuthTokenPayload): string {
  if (!process.env.JWT_SECRET) throw new Error("Missing JWT secrete environment variable");
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}
