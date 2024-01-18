import { Test } from '@nestjs/testing';

import { ILoggerAdapter } from '@/infra/logger';
import { IDogsCreateAdapter } from '@/modules/dogs/adapter';
import { ApiInternalServerException } from '@/utils/exception';
import { expectZodError, generateUUID } from '@/utils/tests/tests';

import { DogsEntity } from '../../entity/dogs';
import { IDogsRepository } from '../../repository/dogs';
import { DogsCreateInput, DogsCreateOutput, DogsCreateUsecase } from '../dogs-create';

const successInput: DogsCreateInput = {
  name: 'dummy'
};

const failureInput: DogsCreateInput = {};

describe('DogsCreateUsecase', () => {
  let usecase: IDogsCreateAdapter;
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
          provide: IDogsCreateAdapter,
          useFactory: (dogsRepository: IDogsRepository, logger: ILoggerAdapter) => {
            return new DogsCreateUsecase(dogsRepository, logger);
          },
          inject: [IDogsRepository, ILoggerAdapter]
        }
      ]
    }).compile();

    usecase = app.get(IDogsCreateAdapter);
    repository = app.get(IDogsRepository);
  });

  test('when no input is specified, should expect an error', async () => {
    await expectZodError(
      () => usecase.execute(failureInput),
      (issues) => {
        expect(issues).toEqual([{ message: 'Required', path: DogsEntity.nameof('name') }]);
      }
    );
  });

  test('when dogs created successfully, should expect a dogs that has been created', async () => {
    const createOutput: DogsCreateOutput = { created: true, id: generateUUID() };

    repository.create = jest.fn().mockResolvedValue(createOutput);
    repository.startSession = jest.fn().mockResolvedValue({
      commit: jest.fn()
    });

    await expect(usecase.execute(successInput)).resolves.toEqual(createOutput);
  });

  test('when transaction throw an error, should expect an error', async () => {
    repository.startSession = jest.fn().mockResolvedValue({
      commit: jest.fn(),
      rollback: jest.fn()
    });
    repository.create = jest.fn().mockRejectedValue(new ApiInternalServerException());

    await expect(usecase.execute(successInput)).rejects.toThrow(ApiInternalServerException);
  });
});
