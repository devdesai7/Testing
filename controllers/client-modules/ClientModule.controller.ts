import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  Res,
} from 'routing-controllers';
import { Response } from 'express';
import { ResponseHandler } from '../../services/response-handler/ResponseHandler.service';
import { ClientModuleService } from '../../services/client-modules/ClientModule.service';
import { ICreateModuleAdmin, IModuleDocument } from '../../types/module.type';

@JsonController('/client-module')
export class ClientModuleController {
  constructor(
    private moduleAdminService: ClientModuleService,
    private responseService: ResponseHandler,
  ) {}

  @Post('/')
  async createModuleAdmin(
    @Body() clientAdmin: ICreateModuleAdmin,
    @Res() res: Response,
  ) {
    const data = await this.moduleAdminService.createModuleAdmin(clientAdmin);
    return this.responseService.apiResponseHandler(res, data);
  }

  @Get('/')
  async getNavItems(@Res() res: Response) {
    const data = await this.moduleAdminService.getAllModules();
    return this.responseService.apiResponseHandler(res, data);
  }

  @Get('/search/:moduleName')
  async searchModules(
    @Param('moduleName') moduleName: string,
    @Res() res: Response,
  ) {
    const data = await this.moduleAdminService.searchModules(moduleName);
    return this.responseService.apiResponseHandler(res, data);
  }

  @Get('/allParents')
  async getAllParents(@Res() res: Response) {
    const data = await this.moduleAdminService.getAllParents();
    return this.responseService.apiResponseHandler(res, data);
  }

  @Put('/updateDisplayOrder')
  async updateDisplayOrder(
    @Body() body: { id: string; new_order: number },
    @Res() res: Response,
  ) {
    const data = await this.moduleAdminService.updateDisplayOrder(
      body.id,
      body.new_order,
    );
    return this.responseService.apiResponseHandler(res, data);
  }

  @Put('/:id')
  async updateModuleDetails(
    @Param('id') id: string,
    @Body() clientAdmin: IModuleDocument,
    @Res() res: Response,
  ) {
    const data = await this.moduleAdminService.updateModuleDetails(
      id,
      clientAdmin,
    );
    return this.responseService.apiResponseHandler(res, data);
  }

  @Delete('/:id')
  async removeClientAdmin(@Param('id') id: string, @Res() res: Response) {
    const data = await this.moduleAdminService.deleteModule(id);
    return this.responseService.apiResponseHandler(res, data);
  }
}
