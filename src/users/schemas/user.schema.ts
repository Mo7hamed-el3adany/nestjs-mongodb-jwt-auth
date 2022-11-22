import { Schema } from 'mongoose';

export const UserSchema = new Schema(
  {
    id: { type: String, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);
