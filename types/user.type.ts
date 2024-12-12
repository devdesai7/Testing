import mongoose from 'mongoose';

export interface IUserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  firestName: string;
  lastName: string;
  email: string;
  phone: string;
  status: UserStatus;
  role: string;
  lastLogin: Date;
  createdBy: string;
  updatedBy: mongoose.Types.ObjectId;
}

export type ICreateUser = Omit<IUserDocument, '_id'>;

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  FLAGGED = 'flagged',
}
