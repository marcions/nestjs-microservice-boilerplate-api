import { z } from 'zod';

import { IDogsRepository } from '@/core/dogs/repository/dogs';
import { DatabaseOptionsType } from '@/utils/database/sequelize';
import { ValidateSchema } from '@/utils/decorators/validate-schema.decorator';
import { ApiNotFoundException } from '@/utils/exception';
import { ApiTrancingInput } from '@/utils/request';

import { DogsEntity, DogsEntitySchema } from '../entity/dogs';

export const DogsDeleteSchema = DogsEntitySchema.pick({
  id: true
});

export type DogsDeleteInput = z.infer<typeof DogsDeleteSchema>;
export type DogsDeleteOutput = DogsEntity;

export class DogsDeleteUsecase {
  constructor(private readonly dogsRepository: IDogsRepository) {}

  @ValidateSchema(DogsDeleteSchema)
  async execute({ id }: DogsDeleteInput, { tracing, user }: ApiTrancingInput): Promise<DogsDeleteOutput> {
    const model = await this.dogsRepository.findById<DatabaseOptionsType>(id);

    if (!model) {
      throw new ApiNotFoundException();
    }

    const dogs = new DogsEntity(model);

    dogs.setDeleted(user);

    await this.dogsRepository.updateOne({ id: dogs.id }, dogs);

    tracing.logEvent('dogs-deleted', `dogs deleted by: ${user.login}`);

    return dogs;
  }
}