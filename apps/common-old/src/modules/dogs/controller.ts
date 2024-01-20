import { Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { DogsCreateInput, DogsCreateOutput } from '@@/apps/common-old/src/core/dogs/use-cases/dogs-create';
import { DogsDeleteInput, DogsDeleteOutput } from '@@/apps/common-old/src/core/dogs/use-cases/dogs-delete';
import { DogsGetByIDInput, DogsGetByIDOutput } from '@@/apps/common-old/src/core/dogs/use-cases/dogs-getByID';
import { DogsListInput, DogsListOutput } from '@@/apps/common-old/src/core/dogs/use-cases/dogs-list';
import { DogsUpdateInput, DogsUpdateOutput } from '@@/apps/common-old/src/core/dogs/use-cases/dogs-update';
import { UserRole } from '@@/apps/common-old/src/core/user/entity/user';
import { Roles } from '@@/libs/utils/decorators/role.decorator';
import { ApiRequest } from '@@/libs/utils/request';
import { SearchHttpSchema } from '@@/libs/utils/search';
import { SortHttpSchema } from '@@/libs/utils/sort';

import {
  IDogsCreateAdapter,
  IDogsDeleteAdapter,
  IDogsGetByIDAdapter,
  IDogsListAdapter,
  IDogsUpdateAdapter
} from './adapter';
import { SwagggerRequest, SwagggerResponse } from './swagger';

@Controller('dogs')
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
  async create(@Req() { body }: ApiRequest): Promise<DogsCreateOutput> {
    return await this.dogsCreate.execute(body as DogsCreateInput);
  }

  @Put()
  @ApiResponse(SwagggerResponse.update[200])
  @ApiResponse(SwagggerResponse.update[404])
  @ApiBody(SwagggerRequest.updateBody)
  async update(@Req() { body }: ApiRequest): Promise<DogsUpdateOutput> {
    return await this.dogsUpdate.execute(body as DogsUpdateInput);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @ApiResponse(SwagggerResponse.getByID[200])
  @ApiResponse(SwagggerResponse.getByID[404])
  async getById(@Req() { params }: ApiRequest): Promise<DogsGetByIDOutput> {
    return await this.dogsGetByID.execute(params as DogsGetByIDInput);
  }

  @Get()
  @ApiQuery(SwagggerRequest.listQuery.pagination.limit)
  @ApiQuery(SwagggerRequest.listQuery.pagination.page)
  @ApiQuery(SwagggerRequest.listQuery.sort)
  @ApiQuery(SwagggerRequest.listQuery.search)
  @ApiResponse(SwagggerResponse.list[200])
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
  async delete(@Req() { params }: ApiRequest): Promise<DogsDeleteOutput> {
    return await this.dogsDelete.execute(params as DogsDeleteInput);
  }
}
