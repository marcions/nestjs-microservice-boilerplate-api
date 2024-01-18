import { z } from 'zod';

import { ICatsRepository } from '@/core/cats/repository/cats';
import { ILoggerAdapter } from '@/infra/logger';
import { DatabaseOptionsType } from '@/utils/database/sequelize';
import { ValidateSchema } from '@/utils/decorators/validate-schema.decorator';
import { ApiNotFoundException } from '@/utils/exception';
import { ApiTrancingInput } from '@/utils/request';

import { CatsEntity, CatsEntitySchema } from './../entity/cats';

export const CatsUpdateSchema = CatsEntitySchema.pick({
  id: true
}).merge(CatsEntitySchema.omit({ id: true }).partial());

export type CatsUpdateInput = z.infer<typeof CatsUpdateSchema>;
export type CatsUpdateOutput = CatsEntity;

export class CatsUpdateUsecase {
  constructor(private readonly catsRepository: ICatsRepository, private readonly loggerService: ILoggerAdapter) {}

  @ValidateSchema(CatsUpdateSchema)
  async execute(input: CatsUpdateInput, { tracing, user }: ApiTrancingInput): Promise<CatsUpdateOutput> {
    const cats = await this.catsRepository.findById<DatabaseOptionsType>(input.id);

    if (!cats) {
      throw new ApiNotFoundException();
    }

    const entity = new CatsEntity({ ...cats, ...input });

    entity.setUpdated(user);

    await this.catsRepository.updateOne({ id: entity.id }, entity);

    this.loggerService.info({ message: 'cats updated.', obj: { cats: input } });

    const updated = await this.catsRepository.findById<DatabaseOptionsType>(entity.id);

    tracing.logEvent('cats-updated', `cats updated by: ${user.login}`);

    return new CatsEntity(updated);
  }
}
