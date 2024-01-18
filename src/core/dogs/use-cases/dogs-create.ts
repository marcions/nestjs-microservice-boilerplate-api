import { z } from 'zod';

import { ILoggerAdapter } from '@/infra/logger';
import { CreatedModel } from '@/infra/repository';
import { DatabaseOptionsType } from '@/utils/database/sequelize';
import { ValidateSchema } from '@/utils/decorators/validate-schema.decorator';
import { ApiTrancingInput } from '@/utils/request';

import { IDogsRepository } from '../repository/dogs';
import { DogsEntity, DogsEntitySchema } from './../entity/dogs';

export const DogsCreateSchema = DogsEntitySchema.pick({
  name: true,
  breed: true,
  age: true
});

export type DogsCreateInput = z.infer<typeof DogsCreateSchema>;
export type DogsCreateOutput = CreatedModel;

export class DogsCreateUsecase {
  constructor(private readonly dogsRepository: IDogsRepository, private readonly loggerService: ILoggerAdapter) {}

  @ValidateSchema(DogsCreateSchema)
  async execute(input: DogsCreateInput, { tracing, user }: ApiTrancingInput): Promise<DogsCreateOutput> {
    const entity = new DogsEntity(input);
    entity.setCreated(user);

    const transaction = await this.dogsRepository.startSession();
    try {
      const dogs = await this.dogsRepository.create<DatabaseOptionsType>(entity, { transaction });

      await transaction.commit();

      this.loggerService.info({ message: 'dogs created.', obj: { dogs } });
      tracing.logEvent('dogs-created', `dogs created by: ${user.login}`);

      return dogs;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
