/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateDogsDto, ResponseTypeDto, UpdateDogsDto } from 'core/dto';
import { ILoggerAdapter } from 'libs/infra/logger';
import { MicroserviceProxy } from 'libs/infra/rabbitmq';
import { DogsPattern, Microservice } from 'libs/utils/enum';
import { ApiTrancingInput } from 'libs/utils/request';

@Injectable()
export class DogsService {
  constructor(
    @Inject(MicroserviceProxy.MICROSERVICE_PROXY_SERVICE) private publish: MicroserviceProxy,
    private loggerService: ILoggerAdapter
  ) {}

  async getDogs(headers): Promise<ResponseTypeDto> {
    const { data } = await this.publish.message(Microservice.DOGS, DogsPattern.GET_DOGS, { headers: headers });
    if (data.result.length === 0)
      return {
        data: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Nenhum registro encontrado.'
        }
      };
    return data;
  }

  async createDogs(body: CreateDogsDto, { tracing, user }: ApiTrancingInput): Promise<ResponseTypeDto> {
    try {
      const logMsg = { message: 'created', obj: { data: body } };
      const tracMsg = `dogs created by: ${user.login}`;

      this.loggerService.info(logMsg);
      tracing.logEvent('dogs-created', tracMsg);

      const { data } = await this.publish.message(Microservice.DOGS, DogsPattern.POST_DOGS, body);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateDogs(body: UpdateDogsDto, id: number): Promise<any> {
    const { data } = await this.publish.message(Microservice.DOGS, DogsPattern.UPDATE_DOGS, {
      id,
      body
    });
    return data;
  }

  async deleteDogs(id: number): Promise<ResponseTypeDto> {
    const { data } = await this.publish.message(Microservice.DOGS, DogsPattern.REMOVE_DOGS, id);
    return data;
  }
}
