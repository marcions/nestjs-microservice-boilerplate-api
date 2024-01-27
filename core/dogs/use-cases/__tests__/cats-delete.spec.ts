import { Test } from '@nestjs/testing';
import { IDogsDeleteAdapter } from '@/apps/api/dogs/src-old/modules/dogs/adapter';
import { ILoggerAdapter, LoggerModule } from 'libs/infra/logger';
import { ApiNotFoundException } from 'libs/utils/exception';
import { RequestMock } from 'libs/utils/tests/mocks/request';
import { expectZodError, getMockUUID } from 'libs/utils/tests/tests';

import { DogsEntity } from '../../entity/dogs';
import { IDogsRepository } from '../../repository/dogs';
import { DogsDeleteUsecase } from '../dogs-delete';

const catMock = new DogsEntity({
  id: getMockUUID(),
  age: 10,
  breed: 'dummy',
  name: 'dummy'
});

describe('DogsDeleteUsecase', () => {
  let usecase: IDogsDeleteAdapter;
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
          provide: IDogsDeleteAdapter,
          useFactory: (dogsRepository: IDogsRepository) => {
            return new DogsDeleteUsecase(dogsRepository);
          },
          inject: [IDogsRepository, ILoggerAdapter]
        }
      ]
    }).compile();

    usecase = app.get(IDogsDeleteAdapter);
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

  test('when dogs deleted successfully, should expect a dogs that has been deleted', async () => {
    repository.findById = jest.fn().mockResolvedValue(catMock);
    repository.updateOne = jest.fn();
    await expect(usecase.execute({ id: getMockUUID() }, RequestMock.trancingMock)).resolves.toEqual({
      ...catMock,
      deletedAt: expect.any(Date)
    });
  });
});
