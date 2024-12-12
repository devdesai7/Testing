import mongoose, { Schema } from 'mongoose';
import { IUserDocument, UserStatus } from 'src/types/user.type';

const UserSchema = new Schema<IUserDocument>(
  {
    firestName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  },
);

const User = mongoose.model<IUserDocument>('User', UserSchema);

export default User;
