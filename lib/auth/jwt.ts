import jwt from "jsonwebtoken";

export interface AuthTokenPayload {
  userId: string;
  email: string;
  name: string;
}

export function signAuthToken(payload: AuthTokenPayload): string {
  if (!process.env.JWT_SECRET) throw new Error("Missing JWT secret environment variable");
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  if (!process.env.JWT_SECRET) throw new Error("Missing JWT secret environment variable");

  const payload = jwt.verify(token, process.env.JWT_SECRET);

  if (
    typeof payload === "string" ||
    typeof payload.userId !== "string" ||
    typeof payload.email !== "string" ||
    typeof payload.name !== "string"
  ) {
    throw new Error("Invalid auth token");
  }

  return {
    userId: payload.userId,
    email: payload.email,
    name: payload.name,
  };
}
