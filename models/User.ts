import mongoose, { Schema, Model, models } from 'mongoose';

export type UserRole = 'citizen' | 'city_manager' | 'infra_manager' | 'issue_resolver' | 'contractor';

export interface IUser {
  _id?: string;
  email: string;
  name: string;
  clerkId?: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  city?: string; // City name for filtering
  managedAreas?: string[]; // For managers: array of area/ward IDs they manage
  municipalityId?: string; // Reference to Municipality
  isActive?: boolean;
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
    role: {
      type: String,
      enum: ['citizen', 'city_manager', 'infra_manager', 'issue_resolver', 'contractor'],
      default: 'citizen',
      required: true,
    },
    city: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    managedAreas: {
      type: [String],
      default: [],
    },
    municipalityId: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const User: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
