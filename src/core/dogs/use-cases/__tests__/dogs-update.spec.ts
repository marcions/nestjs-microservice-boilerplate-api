import { Test } from '@nestjs/testing';

import { ILoggerAdapter } from '@/infra/logger';
import { IDogsUpdateAdapter } from '@/modules/dogs/adapter';
import { ApiNotFoundException } from '@/utils/exception';
import { expectZodError, generateUUID } from '@/utils/tests/tests';

import { IDogsRepository } from '../../repository/dogs';
import { DogsUpdateInput, DogsUpdateOutput, DogsUpdateUsecase } from '../dogs-update';
import { DogsEntity } from './../../entity/dogs';

const successInput: DogsUpdateInput = {
  id: generateUUID()
};

const failureInput: DogsUpdateInput = {};

describe('DogsUpdateUsecase', () => {
  let usecase: IDogsUpdateAdapter;
  let repository: IDogsRepository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        {
          provide: IDogsRepository,
          useValue: {}
        },
        {
          provide: ILoggerAdapter,
          useValue: {
            info: jest.fn()
          }
        },
        {
          provide: IDogsUpdateAdapter,
          useFactory: (dogsRepository: IDogsRepository, logger: ILoggerAdapter) => {
            return new DogsUpdateUsecase(dogsRepository, logger);
          },
          inject: [IDogsRepository, ILoggerAdapter]
        }
      ]
    }).compile();

    usecase = app.get(IDogsUpdateAdapter);
    repository = app.get(IDogsRepository);
  });

  test('when no input is specified, should expect an error', async () => {
    await expectZodError(
      () => usecase.execute(failureInput),
      (issues) => {
        expect(issues).toEqual([{ message: 'Required', path: DogsEntity.nameof('id') }]);
      }
    );
  });

  test('when dogs not found, should expect an error', async () => {
    repository.findById = jest.fn().mockResolvedValue(null);

    await expect(usecase.execute(successInput)).rejects.toThrowError(ApiNotFoundException);
  });

  test('when dogs updated successfully, should expect an dogs that has been updated', async () => {
    const findByIdOutput: DogsUpdateOutput = new DogsEntity({
      id: generateUUID(),
      name: 'dummy'
    });

    repository.findById = jest.fn().mockResolvedValue(findByIdOutput);
    repository.updateOne = jest.fn().mockResolvedValue(null);

    await expect(usecase.execute(successInput)).resolves.toEqual(findByIdOutput);
  });
});
