import { Transaction } from 'sequelize';

import { IRepository } from '@/infra/repository';
import { DatabaseOptionsType } from '@/utils/database/sequelize';

import { DogsEntity } from '../entity/dogs';
import { DogsListInput, DogsListOutput } from '../use-cases/dogs-list';

export abstract class IDogsRepository extends IRepository<DogsEntity> {
  abstract paginate<TOptions = DatabaseOptionsType>(input: DogsListInput, options?: TOptions): Promise<DogsListOutput>;
  abstract startSession<TTransaction = Transaction>(): Promise<TTransaction>;
}
