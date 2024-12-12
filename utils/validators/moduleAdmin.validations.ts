import Joi from 'joi';
import { ICreateModuleAdmin } from '../../types/module.type';

export const createModuleAdminDataValidation = (data: ICreateModuleAdmin) => {
  const createModuleAdminSchema = Joi.object({
    name: Joi.string().trim().label('Name').exist().min(3).messages({
      'any.required': 'Name is required.',
      'string.min': 'Name must be at least 3 characters long.',
    }),
    description: Joi.string().trim().label('Description').exist().messages({
      'any.required': 'Description is required.',
    }),
    childModules: Joi.array().items(Joi.string()),
    parentId: Joi.string().allow(null).label('Parent id'),
    url: Joi.string().label('Url').exist().messages({
      'any.required': 'Url is required.',
    }),
    status: Joi.string().label('Value').exist().messages({
      'any.required': 'Value is required.',
    }),
  });
  return createModuleAdminSchema.validate(data);
};
