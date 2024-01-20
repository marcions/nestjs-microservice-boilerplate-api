import { z } from 'zod';

import { CreatedModel } from '@@/libs/infra/repository';
import { DatabaseOptionsType } from '@@/libs/utils/database/sequelize';
import { ValidateSchema } from '@@/libs/utils/decorators/validate-schema.decorator';
import { ApiTrancingInput } from '@@/libs/utils/request';

import { ICatsRepository } from '../repository/cats';
import { CatsEntity, CatsEntitySchema } from '../entity/cats';

export const CatsCreateSchema = CatsEntitySchema.pick({
  name: true,
  breed: true,
  age: true
});

export type CatsCreateInput = z.infer<typeof CatsCreateSchema>;
export type CatsCreateOutput = CreatedModel;

export class CatsCreateUsecase {
  constructor(private readonly catsRepository: ICatsRepository) {}

  @ValidateSchema(CatsCreateSchema)
  async execute(input: CatsCreateInput, { tracing, user }: ApiTrancingInput): Promise<CatsCreateOutput> {
    const entity = new CatsEntity(input);
    entity.setCreated(user);

    const transaction = await this.catsRepository.startSession();
    try {
      const cats = await this.catsRepository.create<DatabaseOptionsType>(entity, { transaction });

      await transaction.commit();

      tracing.logEvent('cats-created', `cats created by: ${user.login}`);

      return cats;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
