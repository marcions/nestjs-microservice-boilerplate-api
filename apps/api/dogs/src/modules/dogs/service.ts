/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateDogsDto, ResponseTypeDto, UpdateDogsDto } from 'core/dto';
import { MicroserviceProxy } from 'libs/infra/queue';
import { DogsPattern, Microservice } from 'libs/utils/enum';

@Injectable()
export class DogsService {
  constructor(@Inject(MicroserviceProxy.MICROSERVICE_PROXY_SERVICE) private publish: MicroserviceProxy) {}

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

  async createDogs(dogs: CreateDogsDto): Promise<any> {
    const { data } = await this.publish.message(Microservice.DOGS, DogsPattern.POST_DOGS, dogs);
    return data;
  }

  async updateDogs(dogs: UpdateDogsDto, id: number): Promise<any> {
    const { data } = await this.publish.message(Microservice.DOGS, DogsPattern.UPDATE_DOGS, {
      id,
      dogs
    });
    return data;
  }

  async deleteDogs(id: number): Promise<ResponseTypeDto> {
    const { data } = await this.publish.message(Microservice.DOGS, DogsPattern.REMOVE_DOGS, id);
    return data;
  }
}
