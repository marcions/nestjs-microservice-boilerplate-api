/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable sonarjs/no-duplicate-string */
import { Controller, Delete, Get, Headers, Param, Post, Put, UsePipes, ValidationPipe, Version } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { CreateDogsDto, ResponseTypeDto, UpdateDogsDto } from 'core/dto';
import { UserRole } from 'core/user/entity/user';
import { Roles } from 'libs/utils/decorators/role.decorator';

import { DogsService } from './service';
import { SwagggerRequest, SwagggerResponse } from './swagger';

@ApiTags('Dogs')
@Controller()
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer {{ access_token }}',
  required: true
})
@ApiBearerAuth()
@Roles(UserRole.USER)
export class DogsController {
  constructor(private readonly dogsService: DogsService) {}

  @Get()
  @ApiOkResponse({ type: ResponseTypeDto, description: 'Dogs found.' })
  @ApiBadRequestResponse({
    type: ResponseTypeDto,
    description: 'An error ocurred. A message explaining will be notified.'
  })
  @ApiNotFoundResponse({ type: ResponseTypeDto, description: 'No records found with these parameters.' })
  @ApiInternalServerErrorResponse({
    type: ResponseTypeDto,
    description: 'An error ocurred. A message explaining will be notified.'
  })
  @ApiUnauthorizedResponse({ type: ResponseTypeDto, description: 'Unauthorized' })
  @ApiQuery(SwagggerRequest.listQuery.pagination.limit)
  @ApiQuery(SwagggerRequest.listQuery.pagination.page)
  @ApiQuery(SwagggerRequest.listQuery.sort)
  @ApiQuery(SwagggerRequest.listQuery.search)
  @ApiResponse(SwagggerResponse.list[200])
  @Version('1')
  async getDogs(@Headers() headers: any): Promise<any> {
    return this.dogsService.getDogs(headers);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @ApiResponse(SwagggerResponse.getByID[200])
  @ApiResponse(SwagggerResponse.getByID[404])
  @Version('1')
  async getDogsByID(@Headers() headers: any): Promise<any> {
    return this.dogsService.getDogs(headers);
  }

  @Post()
  // @UsePipes(
  //   new ValidationPipe({ transform: true, whitelist: true, forbidUnknownValues: true, forbidNonWhitelisted: true })
  // )
  // @ApiBody({
  //   type: CreateDogsDto,
  //   description: 'The body request is a json.'
  // })
  // @ApiCreatedResponse({ type: ResponseTypeDto, description: 'The dogs has been successfully created.' })
  // @ApiBadRequestResponse({
  //   type: ResponseTypeDto,
  //   description: 'An error occurred. A message explaining will be notified.'
  // })
  // @ApiInternalServerErrorResponse({
  //   type: ResponseTypeDto,
  //   description: 'An error occurred. A message explaining will be notified.'
  // })
  // @ApiUnauthorizedResponse({ type: ResponseTypeDto, description: 'Unauthorized' })
  @ApiResponse(SwagggerResponse.create[200])
  @ApiBody(SwagggerRequest.createBody)
  @Version('1')
  async createDogs(@Payload() data: CreateDogsDto): Promise<ResponseTypeDto> {
    return this.dogsService.createDogs(data);
  }

  @Put('/:id')
  @UsePipes(
    new ValidationPipe({ transform: true, whitelist: true, forbidUnknownValues: true, forbidNonWhitelisted: true })
  )
  @ApiBody({
    type: UpdateDogsDto,
    description: 'The body request is a json.'
  })
  @ApiCreatedResponse({ type: ResponseTypeDto, description: 'The dogs has been successfully updated.' })
  @ApiBadRequestResponse({
    type: ResponseTypeDto,
    description: 'An error occurred. A message explaining will be notified.'
  })
  @ApiInternalServerErrorResponse({
    type: ResponseTypeDto,
    description: 'An error occurred. A message explaining will be notified.'
  })
  @ApiUnauthorizedResponse({ type: ResponseTypeDto, description: 'Unauthorized' })
  @ApiResponse(SwagggerResponse.update[200])
  @ApiResponse(SwagggerResponse.update[404])
  @ApiBody(SwagggerRequest.updateBody)
  @Version('1')
  async updateDogs(@Param('id') id: string, @Payload() data: UpdateDogsDto): Promise<any> {
    return this.dogsService.updateDogs(data, Number(id));
  }

  @Delete('/:id')
  @ApiOkResponse({ type: ResponseTypeDto, description: 'The dogs has been successfully deleted.' })
  @ApiBadRequestResponse({
    type: ResponseTypeDto,
    description: 'An error occurred. A message explaining will be notified.'
  })
  @ApiInternalServerErrorResponse({
    type: ResponseTypeDto,
    description: 'An error occurred. A message explaining will be notified.'
  })
  @ApiUnauthorizedResponse({ type: ResponseTypeDto, description: 'Unauthorized' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse(SwagggerResponse.delete[200])
  @ApiResponse(SwagggerResponse.delete[404])
  @Version('1')
  async deleteDogs(@Param('id') id: string): Promise<ResponseTypeDto> {
    return this.dogsService.deleteDogs(Number(id));
  }
}
