import { ILoggerAdapter } from 'libs/infra/logger';
import { DatabaseOptionsType } from 'libs/utils/database/sequelize';
import { ValidateSchema } from 'libs/utils/decorators/validate-schema.decorator';
import { ApiNotFoundException } from 'libs/utils/exception';
import { ApiTrancingInput } from 'libs/utils/request';
import { z } from 'zod';

import { DogsEntity, DogsEntitySchema } from '../entity/dogs';
import { IDogsRepository } from '../repository/dogs';

export const DogsUpdateSchema = DogsEntitySchema.pick({
  id: true
}).merge(DogsEntitySchema.omit({ id: true }).partial());

export type DogsUpdateInput = z.infer<typeof DogsUpdateSchema>;
export type DogsUpdateOutput = DogsEntity;

export class DogsUpdateUsecase {
  constructor(private readonly dogsRepository: IDogsRepository, private readonly loggerService: ILoggerAdapter) {}

  @ValidateSchema(DogsUpdateSchema)
  async execute(input: DogsUpdateInput, { tracing, user }: ApiTrancingInput): Promise<DogsUpdateOutput> {
    const dogs = await this.dogsRepository.findById<DatabaseOptionsType>(input.id);

    if (!dogs) {
      throw new ApiNotFoundException();
    }

    const entity = new DogsEntity({ ...dogs, ...input });

    entity.setUpdated(user);

    await this.dogsRepository.updateOne({ id: entity.id }, entity);

    this.loggerService.info({ message: 'dogs updated.', obj: { dogs: input } });

    const updated = await this.dogsRepository.findById<DatabaseOptionsType>(entity.id);

    tracing.logEvent('dogs-updated', `dogs updated by: ${user.login}`);

    return new DogsEntity(updated);
  }
}
