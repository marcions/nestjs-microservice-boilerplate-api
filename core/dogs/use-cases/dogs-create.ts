/* eslint-disable no-console */
import { Inject, Injectable } from '@nestjs/common';
import { CreateDogsDto, ResponseTypeDto } from 'core/dto';
import { ILoggerAdapter } from 'libs/infra/logger';
import { MicroserviceProxy } from 'libs/infra/queue';
import { CreatedModel } from 'libs/infra/repository';
import { DogsPattern, Microservice } from 'libs/utils/enum';
import { ApiTrancingInput } from 'libs/utils/request';
import { z } from 'zod';

import { DogsEntitySchema } from '../entity/dogs';

export const DogsCreateSchema = DogsEntitySchema.pick({
  name: true,
  breed: true,
  age: true
});

export type DogsCreateInput = z.infer<typeof DogsCreateSchema>;
export type DogsCreateOutput = CreatedModel;
@Injectable()
export class DogsCreateUsecase {
  constructor(
    @Inject(MicroserviceProxy.MICROSERVICE_PROXY_SERVICE) private publish: MicroserviceProxy,
    private readonly loggerService: ILoggerAdapter
  ) {}

  async execute(input: DogsCreateInput, { tracing, user }: ApiTrancingInput): Promise<DogsCreateOutput> {
    try {
      const logMsg = { message: 'created', obj: { data: input } };
      const tracMsg = `dogs created by: ${user.login}`;

      this.loggerService.info(logMsg);

      tracing.logEvent('dogs-created', tracMsg);

      console.log(input);

      const { data } = await this.publish.message(Microservice.DOGS, DogsPattern.POST_DOGS, input);

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
