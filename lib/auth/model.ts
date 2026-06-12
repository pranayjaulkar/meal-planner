import mongoose from "mongoose";
import type { UserDocument } from "./types";

const healthProfileSchema = new mongoose.Schema(
  {
    age: {
      type: Number,
      required: true,
      min: 13,
      max: 120,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    height: {
      type: Number,
      required: true,
      min: 100,
      max: 250,
    },
    weight: {
      type: Number,
      required: true,
      min: 30,
      max: 300,
    },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
      validate: {
        validator: (value: string) => /^[\p{L}0-9'\-\.\s]+$/u.test(value),
        message: "Name contains invalid characters",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Email must be valid"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 128,
    },
    healthProfile: {
      type: healthProfileSchema,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const UserModel =
  (mongoose.models.User as mongoose.Model<UserDocument>) || mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
