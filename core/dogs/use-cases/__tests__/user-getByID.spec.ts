import { Test } from '@nestjs/testing';
import { IDogsGetByIDAdapter } from 'api/dogs/src/modules/dogs/adapter';
import { ILoggerAdapter, LoggerModule } from 'libs/infra/logger';
import { ApiNotFoundException } from 'libs/utils/exception';
import { expectZodError, getMockUUID } from 'libs/utils/tests/tests';

import { DogsEntity } from '../../entity/dogs';
import { IDogsRepository } from '../../repository/dogs';
import { DogsGetByIdUsecase } from '../dogs-getByID';

const catMock = new DogsEntity({
  id: getMockUUID(),
  age: 10,
  breed: 'dummy',
  name: 'dummy'
});

describe('DogsGetByIdUsecase', () => {
  let usecase: IDogsGetByIDAdapter;
  let repository: IDogsRepository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        {
          provide: IDogsRepository,
          useValue: {}
        },
        {
          provide: IDogsGetByIDAdapter,
          useFactory: (dogsRepository: IDogsRepository) => {
            return new DogsGetByIdUsecase(dogsRepository);
          },
          inject: [IDogsRepository, ILoggerAdapter]
        }
      ]
    }).compile();

    usecase = app.get(IDogsGetByIDAdapter);
    repository = app.get(IDogsRepository);
  });

  test('when no input is specified, should expect an error', async () => {
    await expectZodError(
      () => usecase.execute({}),
      (issues) => {
        expect(issues).toEqual([{ message: 'Required', path: DogsEntity.nameOf('id') }]);
      }
    );
  });

  test('when dogs not found, should expect an error', async () => {
    repository.findById = jest.fn().mockResolvedValue(null);
    await expect(usecase.execute({ id: getMockUUID() })).rejects.toThrowError(ApiNotFoundException);
  });

  test('when dogs found, should expect a dogs that has been found', async () => {
    repository.findById = jest.fn().mockResolvedValue(catMock);
    await expect(usecase.execute({ id: getMockUUID() })).resolves.toEqual(catMock);
  });
});
