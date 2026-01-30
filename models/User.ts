import mongoose, { Schema, Model, models } from 'mongoose';

export interface IUser {
  _id?: string;
  email: string;
  name: string;
  clerkId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    clerkId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const User: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
