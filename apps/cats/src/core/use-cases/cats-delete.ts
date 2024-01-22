import { DatabaseOptionsType } from 'libs/utils/database/sequelize';
import { ValidateSchema } from 'libs/utils/decorators/validate-schema.decorator';
import { ApiNotFoundException } from 'libs/utils/exception';
import { ApiTrancingInput } from 'libs/utils/request';
import { z } from 'zod';

import { CatsEntity, CatsEntitySchema } from '../entity/cats';
import { ICatsRepository } from '../repository/cats';

export const CatsDeleteSchema = CatsEntitySchema.pick({
  id: true
});

export type CatsDeleteInput = z.infer<typeof CatsDeleteSchema>;
export type CatsDeleteOutput = CatsEntity;

export class CatsDeleteUsecase {
  constructor(private readonly catsRepository: ICatsRepository) {}

  @ValidateSchema(CatsDeleteSchema)
  async execute({ id }: CatsDeleteInput, { tracing, user }: ApiTrancingInput): Promise<CatsDeleteOutput> {
    const model = await this.catsRepository.findById<DatabaseOptionsType>(id);

    if (!model) {
      throw new ApiNotFoundException();
    }

    const cats = new CatsEntity(model);

    cats.setDeleted(user);

    await this.catsRepository.updateOne({ id: cats.id }, cats);

    tracing.logEvent('cats-deleted', `cats deleted by: ${user.login}`);

    return cats;
  }
}
