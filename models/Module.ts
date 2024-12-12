import mongoose, { Schema } from 'mongoose';
import { IModuleDocument, MODULES_STATUS } from '../types/module.type';

const ModuleSchema = new Schema<IModuleDocument>(
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
        ref: 'Module',
      },
    ],
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Module',
      default: null,
    },
    displayOrder: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'modules',
  },
);

const Module = mongoose.model('Module', ModuleSchema);

export default Module;
