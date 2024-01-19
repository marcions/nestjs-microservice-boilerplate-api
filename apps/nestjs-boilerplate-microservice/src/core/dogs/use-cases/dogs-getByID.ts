import { z } from 'zod';

import { DogsEntitySchema } from '@/core/dogs/entity/dogs';
import { DatabaseOptionsType } from '@/utils/database/sequelize';
import { ValidateSchema } from '@/utils/decorators/validate-schema.decorator';
import { ApiNotFoundException } from '@/utils/exception';

import { DogsEntity } from '../entity/dogs';
import { IDogsRepository } from '../repository/dogs';

export const DogsGetByIdSchema = DogsEntitySchema.pick({
  id: true
});

export type DogsGetByIDInput = z.infer<typeof DogsGetByIdSchema>;
export type DogsGetByIDOutput = DogsEntity;

export class DogsGetByIdUsecase {
  constructor(private readonly dogsRepository: IDogsRepository) {}

  @ValidateSchema(DogsGetByIdSchema)
  async execute({ id }: DogsGetByIDInput): Promise<DogsGetByIDOutput> {
    const dogs = await this.dogsRepository.findById<DatabaseOptionsType>(id);

    if (!dogs) {
      throw new ApiNotFoundException();
    }

    return new DogsEntity(dogs);
  }
}
