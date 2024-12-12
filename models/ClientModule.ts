import mongoose, { Schema } from 'mongoose';
import { IModuleDocument, MODULES_STATUS } from '../types/module.type';

const ClientModuleSchema = new Schema<IModuleDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: MODULES_STATUS,
      default: 'active',
    },
    childModules: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ClientModule',
      },
    ],
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'ClientModule',
      default: null,
    },
    displayOrder: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'client_modules',
  },
);

const ClientModule = mongoose.model('ClientModule', ClientModuleSchema);

export default ClientModule;
