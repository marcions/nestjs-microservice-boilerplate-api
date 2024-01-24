import { Controller, Delete, Get, Post, Put, Req, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DogsCreateInput, DogsCreateOutput } from 'core/dogs/use-cases/dogs-create';
import { DogsDeleteInput, DogsDeleteOutput } from 'core/dogs/use-cases/dogs-delete';
import { DogsGetByIDInput, DogsGetByIDOutput } from 'core/dogs/use-cases/dogs-getByID';
import { DogsListInput, DogsListOutput } from 'core/dogs/use-cases/dogs-list';
import { DogsUpdateInput, DogsUpdateOutput } from 'core/dogs/use-cases/dogs-update';
import { UserRole } from 'core/user/entity/user';
import { Roles } from 'libs/utils/decorators/role.decorator';
import { ApiRequest } from 'libs/utils/request';
import { SearchHttpSchema } from 'libs/utils/search';
import { SortHttpSchema } from 'libs/utils/sort';

import {
  IDogsCreateAdapter,
  IDogsDeleteAdapter,
  IDogsGetByIDAdapter,
  IDogsListAdapter,
  IDogsUpdateAdapter
} from './adapter';
import { SwagggerRequest, SwagggerResponse } from './swagger';

@Controller()
@ApiTags('dogs')
@ApiBearerAuth()
@Roles(UserRole.USER)
export class DogsController {
  constructor(
    private readonly dogsCreate: IDogsCreateAdapter,
    private readonly dogsUpdate: IDogsUpdateAdapter,
    private readonly dogsGetByID: IDogsGetByIDAdapter,
    private readonly dogsList: IDogsListAdapter,
    private readonly dogsDelete: IDogsDeleteAdapter
  ) {}

  @Post()
  @ApiResponse(SwagggerResponse.create[200])
  @ApiBody(SwagggerRequest.createBody)
  @Version('1')
  async create(@Req() { body, user, tracing }: ApiRequest): Promise<DogsCreateOutput> {
    return await this.dogsCreate.execute(body as DogsCreateInput, { user, tracing });
  }

  @Put()
  @ApiResponse(SwagggerResponse.update[200])
  @ApiResponse(SwagggerResponse.update[404])
  @ApiBody(SwagggerRequest.updateBody)
  @Version('1')
  async update(@Req() { body, user, tracing }: ApiRequest): Promise<DogsUpdateOutput> {
    return await this.dogsUpdate.execute(body as DogsUpdateInput, { user, tracing });
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @ApiResponse(SwagggerResponse.getByID[200])
  @ApiResponse(SwagggerResponse.getByID[404])
  @Version('1')
  async getById(@Req() { params }: ApiRequest): Promise<DogsGetByIDOutput> {
    return await this.dogsGetByID.execute(params as DogsGetByIDInput);
  }

  @Get()
  @ApiQuery(SwagggerRequest.listQuery.pagination.limit)
  @ApiQuery(SwagggerRequest.listQuery.pagination.page)
  @ApiQuery(SwagggerRequest.listQuery.sort)
  @ApiQuery(SwagggerRequest.listQuery.search)
  @ApiResponse(SwagggerResponse.list[200])
  @Version('1')
  async list(@Req() { query }: ApiRequest): Promise<DogsListOutput> {
    const input: DogsListInput = {
      sort: SortHttpSchema.parse(query.sort),
      search: SearchHttpSchema.parse(query.search),
      limit: Number(query.limit),
      page: Number(query.page)
    };

    return await this.dogsList.execute(input);
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', required: true })
  @ApiResponse(SwagggerResponse.delete[200])
  @ApiResponse(SwagggerResponse.delete[404])
  @Version('1')
  async delete(@Req() { params, user, tracing }: ApiRequest): Promise<DogsDeleteOutput> {
    return await this.dogsDelete.execute(params as DogsDeleteInput, { user, tracing });
  }
}
