import mongoose from "mongoose";
import type { UserDocument } from "./types";

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
  },
  {
    timestamps: true,
  }
);

const UserModel =
  (mongoose.models.User as mongoose.Model<UserDocument>) ||
  mongoose.model<UserDocument>("User", userSchema);

export default UserModel;