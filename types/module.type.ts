import mongoose from 'mongoose';

export interface IModuleDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  childModules: mongoose.Types.ObjectId[];
  parentId: mongoose.Types.ObjectId | null;
  url: string;
  status: 'active' | 'inactive' | 'archived';
  displayOrder: number;
}

export type ICreateModuleAdmin = Omit<IModuleDocument, '_id'>;

export enum MODULES_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}
