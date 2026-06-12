import { connectToDatabase } from "@/lib/db";
import { signAuthToken } from "./jwt";
import { comparePassword, hashPassword } from "./hash";
import UserModel from "./model";
import type { UserResponseDto } from "./dto";
import { createUserSchema } from "../schemas/user.schema";
import { loginSchema } from "../schemas/auth.schema";

function sanitizeUser(user: {
  _id: { toString: () => string };
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}): UserResponseDto {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export async function registerUser(data: unknown) {
  const userData = createUserSchema.parse(data);

  await connectToDatabase();

  const existingUser = await UserModel.findOne({
    email: userData.email,
  }).lean();

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await hashPassword(userData.password);

  const createdUser = await UserModel.create({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
  });

  const user = sanitizeUser(createdUser);

  const token = signAuthToken({
    userId: user.id,
    email: user.email,
    name: user.name,
  });

  return { user, token };
}

export async function loginUser(data: unknown) {
  const credentials = loginSchema.parse(data);
  await connectToDatabase();

  const user = await UserModel.findOne({
    email: credentials.email,
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isValidPassword = await comparePassword(credentials.password, user.password);

  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  const sanitizedUser = sanitizeUser(user);

  const token = signAuthToken({
    userId: sanitizedUser.id,
    email: sanitizedUser.email,
    name: sanitizedUser.name,
  });

  return { user: sanitizedUser, token };
}

export async function findUserByEmail(email: string): Promise<UserResponseDto | null> {
  await connectToDatabase();

  const user = await UserModel.findOne({
    email,
  });

  return user ? sanitizeUser(user) : null;
}
