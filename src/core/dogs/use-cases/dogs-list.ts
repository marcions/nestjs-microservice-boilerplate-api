import { z } from 'zod';

import { DogsEntity } from '@/core/dogs/entity/dogs';
import { ValidateSchema } from '@/utils/decorators/validate-schema.decorator';
import { PaginationInput, PaginationOutput, PaginationSchema } from '@/utils/pagination';
import { SearchSchema } from '@/utils/search';
import { SortSchema } from '@/utils/sort';

import { IDogsRepository } from '../repository/dogs';

export const DogsListSchema = z.intersection(PaginationSchema, SortSchema.merge(SearchSchema));

export type DogsListInput = PaginationInput<DogsEntity>;
export type DogsListOutput = PaginationOutput<DogsEntity>;

export class DogsListUsecase {
  constructor(private readonly dogsRepository: IDogsRepository) {}

  @ValidateSchema(DogsListSchema)
  async execute(input: DogsListInput): Promise<DogsListOutput> {
    return await this.dogsRepository.paginate(input);
  }
}
