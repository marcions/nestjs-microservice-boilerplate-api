import { Test } from '@nestjs/testing';
import { IDogsUpdateAdapter } from '@/apps/api/dogs/src-old/modules/dogs/adapter';
import { ILoggerAdapter, LoggerModule } from 'libs/infra/logger';
import { ApiNotFoundException } from 'libs/utils/exception';
import { RequestMock } from 'libs/utils/tests/mocks/request';
import { expectZodError, getMockUUID } from 'libs/utils/tests/tests';

import { DogsEntity } from '../../entity/dogs';
import { IDogsRepository } from '../../repository/dogs';
import { DogsUpdateUsecase } from '../dogs-update';

const catMock = new DogsEntity({
  id: getMockUUID(),
  age: 10,
  breed: 'dummy',
  name: 'dummy'
});

describe('DogsUpdateUsecase', () => {
  let usecase: IDogsUpdateAdapter;
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
      () => usecase.execute({}, RequestMock.trancingMock),
      (issues) => {
        expect(issues).toEqual([{ message: 'Required', path: DogsEntity.nameOf('id') }]);
      }
    );
  });

  test('when dogs not found, should expect an error', async () => {
    repository.findById = jest.fn().mockResolvedValue(null);
    await expect(usecase.execute({ id: getMockUUID() }, RequestMock.trancingMock)).rejects.toThrowError(
      ApiNotFoundException
    );
  });

  test('when dogs updated successfully, should expect an dogs that has been updated', async () => {
    repository.findById = jest.fn().mockResolvedValue(catMock);
    repository.updateOne = jest.fn().mockResolvedValue(null);
    await expect(usecase.execute({ id: getMockUUID() }, RequestMock.trancingMock)).resolves.toEqual(catMock);
  });
});
