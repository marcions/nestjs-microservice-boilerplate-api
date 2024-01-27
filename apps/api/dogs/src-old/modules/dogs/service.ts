/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateDogDto, UpdateDogDto } from 'core/dto/dogs';
import { ResponseTypeDto } from 'core/dto/general';
import { MicroserviceProxy } from 'libs/infra/queue';

import { Microservice, UserPattern } from '@/libs/utils/enum';

@Injectable()
export class UserService {
  constructor(@Inject(MicroserviceProxy.MICROSERVICE_PROXY_SERVICE) private publish: MicroserviceProxy) {}

  async getUser(headers): Promise<ResponseTypeDto> {
    const { data } = await this.publish.message(Microservice.USER, UserPattern.GET_USER, { headers: headers });

    if (data.result.length === 0)
      return {
        data: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Nenhum registro encontrado.'
        }
      };

    return data;
  }

  async createUser(user: CreateDogDto): Promise<any> {
    const { data } = await this.publish.message(Microservice.USER, UserPattern.POST_USER, user);

    return data;
  }

  async updateUser(user: UpdateDogDto, id: number): Promise<any> {
    const { data } = await this.publish.message(Microservice.USER, UserPattern.UPDATE_USER, {
      id,
      user
    });

    return data;
  }

  async deleteUser(id: number): Promise<ResponseTypeDto> {
    const { data } = await this.publish.message(Microservice.USER, UserPattern.REMOVE_USER, id);

    return data;
  }
}
