import { Inject, Injectable } from '@nestjs/common';
import { MicroserviceProxy } from 'libs/infra/queue';
import { CreatedModel } from 'libs/infra/repository';
import { DatabaseOptionsType } from 'libs/utils/database/sequelize';
import { ValidateSchema } from 'libs/utils/decorators/validate-schema.decorator';
import { ApiTrancingInput } from 'libs/utils/request';
import { z } from 'zod';

import { DogsPattern, Microservice } from '@/libs/utils/enum';

import { DogsEntity, DogsEntitySchema } from '../entity/dogs';
import { IDogsRepository } from '../repository/dogs';

export const DogsCreateSchema = DogsEntitySchema.pick({
  name: true,
  breed: true,
  age: true
});

export type DogsCreateInput = z.infer<typeof DogsCreateSchema>;
export type DogsCreateOutput = CreatedModel;
@Injectable()
export class DogsCreateUsecase {
  constructor(private readonly dogsRepository: IDogsRepository) {}

  @ValidateSchema(DogsCreateSchema)
  async execute(input: DogsCreateInput, { tracing, user }: ApiTrancingInput): Promise<DogsCreateOutput> {
    const entity = new DogsEntity(input);
    entity.setCreated(user);

    const transaction = await this.dogsRepository.startSession();
    try {
      const dogs = await this.dogsRepository.create<DatabaseOptionsType>(entity, { transaction });

      await transaction.commit();

      tracing.logEvent('dogs-created', `dogs created by: ${user.login}`);

      return dogs;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

@Injectable()
export class DogsCreateUsecaseQueue {
  constructor(@Inject(MicroserviceProxy.MICROSERVICE_PROXY_SERVICE) private publish: MicroserviceProxy) {}

  @ValidateSchema(DogsCreateSchema)
  async execute(input: DogsCreateInput, { tracing, user }: ApiTrancingInput): Promise<unknown> {
    try {
      // const { data } = await this.publish.message(Microservice.DOGS, DogsPattern.POST_DOGS, input);
      await this.publish.message(Microservice.DOGS, DogsPattern.POST_DOGS, input);
      const data = 'Queued';

      tracing.logEvent('dogs-send-to-queue', `dogs queued by: ${user.login}`);

      return data;
    } catch (error) {
      throw error;
    }
  }
}
