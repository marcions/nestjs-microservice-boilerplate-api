import { DatabaseOptionsType } from 'libs/utils/database/sequelize';
import { ValidateSchema } from 'libs/utils/decorators/validate-schema.decorator';
import { ApiNotFoundException } from 'libs/utils/exception';
import { ApiTrancingInput } from 'libs/utils/request';
import { z } from 'zod';

import { DogsEntity, DogsEntitySchema } from '../entity/dogs';
import { IDogsRepository } from '../repository/dogs';

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
