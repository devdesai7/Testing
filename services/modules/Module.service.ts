import { Service } from 'typedi';
import { ResponseHandler } from '../response-handler/ResponseHandler.service';
import { createModuleAdminDataValidation } from '../../utils/validators/moduleAdmin.validations';

import Module from '../../models/Module';
import { STATUS_CODES } from '../../utils/constant';
import { ICreateModuleAdmin, IModuleDocument } from '../../types/module.type';
import mongoose from 'mongoose';

@Service()
export class ModuleAdminService extends ResponseHandler {
  async createModuleAdmin(moduleAdminData: ICreateModuleAdmin) {
    try {
      const { error } = createModuleAdminDataValidation(moduleAdminData);

      if (error)
        return this.catchErrorHandler(
          error?.details?.[0]?.message,
          STATUS_CODES.BAD_REQUEST,
        );

      let displayOrder = 1;
      const siblings = await Module.find({
        parentId: moduleAdminData.parentId || null,
      });
      displayOrder = Math.max(...siblings.map((s) => s.displayOrder), 0) + 1;

      const module = new Module({
        ...moduleAdminData,
        displayOrder: displayOrder,
      });

      await module.save();

      // Update parent's childModules array
      if (moduleAdminData.parentId) {
        await Module.findByIdAndUpdate(moduleAdminData.parentId, {
          $push: { childModules: module._id },
        });
      }

      return this.responseHandler(
        module,
        'Module created successfully',
        STATUS_CODES.OK,
      );
    } catch (error: any) {
      return this.catchErrorHandler(error?.message, STATUS_CODES.BAD_REQUEST);
    }
  }
  async getAllModules() {
    try {
      // Get all root modules (no parent)
      const rootModules = await Module.find({ parentId: null }).sort({
        displayOrder: 1,
      });

      // Recursive function to build tree
      const buildTree = async (modules: IModuleDocument[]) => {
        const tree = [];

        for (const module of modules) {
          const children = await Module.find({
            _id: { $in: module.childModules },
          }).sort({ displayOrder: 1 });

          const node = module.toObject();
          if (children.length > 0) {
            node.childModules = await buildTree(children);
          }
          tree.push(node);
        }

        return tree;
      };

      const tree = await buildTree(rootModules);

      return this.responseHandler(tree, 'Success', STATUS_CODES.OK);
    } catch (error: any) {
      return this.catchErrorHandler(error?.message, STATUS_CODES.BAD_REQUEST);
    }
  }

  //search Api
  async searchModules(moduleName: string) {
    try {
      if (moduleName.length < 3) {
        return this.responseHandler(
          [],
          'Please enter Module Name Greater than or equal to 3',
          STATUS_CODES.OK,
        );
      }

      const searchResults = (
        await Module.find({ name: new RegExp(moduleName, 'i') })
      ).map((item) => item.name);

      return this.responseHandler(searchResults, 'Success', STATUS_CODES.OK);
    } catch (error: any) {
      return this.catchErrorHandler(error?.message, STATUS_CODES.BAD_REQUEST);
    }
  }
  async getAllParents() {
    try {
      const modules = await Module.find();

      let parentsArray = [];
      let str = '';
      let id = null;

      // Finding Parents of the current Module via recursion
      const findAllParents = async (module: IModuleDocument, str: string) => {
        const parent = await Module.findOne({
          _id: module.parentId,
        });
        str = parent.name + ' > ' + str;

        if (parent.parentId !== null) {
          str = await findAllParents(parent, str);
        }
        return str;
      };

      for (const module of modules) {
        str = '';
        id = null;
        if (module.parentId !== null) {
          id = module._id;
          str = str + module.name;
          const newStr = await findAllParents(module, str);
          parentsArray.push({
            id: id,
            parent: newStr,
          });
        } else {
          parentsArray.push({
            id: module._id,
            parent: module.name,
          });
        }
      }

      return this.responseHandler(parentsArray, 'Success', STATUS_CODES.OK);
    } catch (error: any) {
      return this.catchErrorHandler(error?.message, STATUS_CODES.BAD_REQUEST);
    }
  }
  async updateModuleDetails(id: string, clientAdmin: IModuleDocument) {
    try {
      const updatedClientAdmin = await Module.findByIdAndUpdate(
        id,
        {
          name: clientAdmin.name,
          url: clientAdmin.url,
          status: clientAdmin.status,
          description: clientAdmin.description,
        },
        { new: true },
      );

      return this.responseHandler(
        updatedClientAdmin,
        'Client Updated successfully',
        STATUS_CODES.OK,
      );
    } catch (error: any) {
      return this.catchErrorHandler(error?.message, STATUS_CODES.BAD_REQUEST);
    }
  }
  async updateDisplayOrder(id: string, new_order: number) {
    try {
      const module = await Module.findById(id);
      if (!module) {
        throw this.catchErrorHandler(
          'Module Not Found',
          STATUS_CODES.BAD_REQUEST,
        );
      }

      const siblings = await Module.find({
        parentId: module.parentId,
      }).sort({ displayOrder: 1 });

      // Reorder siblings
      const currentIndex = siblings.findIndex((m) => m._id.equals(module._id));
      const newIndex =
        new_order > siblings.length ? siblings.length - 1 : new_order - 1;

      if (currentIndex === newIndex) return module;

      // Update display orders
      if (currentIndex < newIndex) {
        // Moving down
        for (let i = currentIndex + 1; i <= newIndex; i++) {
          await Module.findByIdAndUpdate(siblings[i]._id, {
            displayOrder: siblings[i].displayOrder - 1,
          });
        }
      } else {
        // Moving up
        for (let i = newIndex; i < currentIndex; i++) {
          await Module.findByIdAndUpdate(siblings[i]._id, {
            displayOrder: siblings[i].displayOrder + 1,
          });
        }
      }

      module.displayOrder = newIndex + 1;
      await module.save();

      return module;
    } catch (error: any) {
      throw this.catchErrorHandler(error?.message, STATUS_CODES.BAD_REQUEST);
    }
  }
  async deleteModule(id: string) {
    try {
      const module = await Module.findById(id);
      if (!module) {
        return this.catchErrorHandler(
          'Module Not Found',
          STATUS_CODES.BAD_REQUEST,
        );
      }

      // Recursively delete all child modules
      const deleteChildren = async (childIds: mongoose.Types.ObjectId[]) => {
        for (const childId of childIds) {
          const child = await Module.findById(childId);
          if (child && child.childModules.length > 0) {
            await deleteChildren(child.childModules);
          }
          await Module.findByIdAndDelete(childId);
        }
      };

      await deleteChildren(module.childModules);

      // Update displayOrder of remaining siblings
      const siblings = await Module.find({
        parentId: module.parentId,
        displayOrder: { $gt: module.displayOrder },
      });

      for (const sibling of siblings) {
        sibling.displayOrder -= 1;
        await sibling.save();
      }

      // Remove from parent's childModules array
      if (module.parentId) {
        await Module.findByIdAndUpdate(module.parentId, {
          $pull: { childModules: module._id },
        });
      }

      await Module.findByIdAndDelete(id);
      return { message: 'Module deleted successfully' };
    } catch (error: any) {
      return this.catchErrorHandler(error?.message, STATUS_CODES.BAD_REQUEST);
    }
  }
}
