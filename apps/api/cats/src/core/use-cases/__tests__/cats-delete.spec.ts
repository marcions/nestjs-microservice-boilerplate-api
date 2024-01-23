import { Test } from '@nestjs/testing';
import { ILoggerAdapter, LoggerModule } from 'libs/infra/logger';
import { ApiNotFoundException } from 'libs/utils/exception';
import { RequestMock } from 'libs/utils/tests/mocks/request';
import { expectZodError, getMockUUID } from 'libs/utils/tests/tests';

import { ICatsDeleteAdapter } from '@/api/cats/src/modules/cats/adapter';

import { CatsEntity } from '../../entity/cats';
import { ICatsRepository } from '../../repository/cats';
import { CatsDeleteUsecase } from '../cats-delete';

const catMock = new CatsEntity({
  id: getMockUUID(),
  age: 10,
  breed: 'dummy',
  name: 'dummy'
});

describe('CatsDeleteUsecase', () => {
  let usecase: ICatsDeleteAdapter;
  let repository: ICatsRepository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        {
          provide: ICatsRepository,
          useValue: {}
        },
        {
          provide: ICatsDeleteAdapter,
          useFactory: (catsRepository: ICatsRepository) => {
            return new CatsDeleteUsecase(catsRepository);
          },
          inject: [ICatsRepository, ILoggerAdapter]
        }
      ]
    }).compile();

    usecase = app.get(ICatsDeleteAdapter);
    repository = app.get(ICatsRepository);
  });

  test('when no input is specified, should expect an error', async () => {
    await expectZodError(
      () => usecase.execute({}, RequestMock.trancingMock),
      (issues) => {
        expect(issues).toEqual([{ message: 'Required', path: CatsEntity.nameOf('id') }]);
      }
    );
  });

  test('when cats not found, should expect an error', async () => {
    repository.findById = jest.fn().mockResolvedValue(null);
    await expect(usecase.execute({ id: getMockUUID() }, RequestMock.trancingMock)).rejects.toThrowError(
      ApiNotFoundException
    );
  });

  test('when cats deleted successfully, should expect a cats that has been deleted', async () => {
    repository.findById = jest.fn().mockResolvedValue(catMock);
    repository.updateOne = jest.fn();
    await expect(usecase.execute({ id: getMockUUID() }, RequestMock.trancingMock)).resolves.toEqual({
      ...catMock,
      deletedAt: expect.any(Date)
    });
  });
});
