import { Test } from '@nestjs/testing';
import { ILoggerAdapter, LoggerModule } from 'libs/infra/logger';
import { expectZodError, getMockUUID } from 'libs/utils/tests/tests';

import { ICatsListAdapter } from '@/apps/cats/src/modules/cats/adapter';

import { CatsEntity } from '../../entity/cats';
import { ICatsRepository } from '../../repository/cats';
import { CatsListUsecase } from '../cats-list';

const catsMock = [
  new CatsEntity({
    id: getMockUUID(),
    age: 10,
    breed: 'dummy',
    name: 'dummy',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  })
];

describe('CatsListUsecase', () => {
  let usecase: ICatsListAdapter;
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
          provide: ICatsListAdapter,
          useFactory: (catsRepository: ICatsRepository) => {
            return new CatsListUsecase(catsRepository);
          },
          inject: [ICatsRepository, ILoggerAdapter]
        }
      ]
    }).compile();

    usecase = app.get(ICatsListAdapter);
    repository = app.get(ICatsRepository);
  });

  test('when no input is specified, should expect an error', async () => {
    await expectZodError(
      () => usecase.execute({ search: null, sort: null, limit: 10, page: 1 }),
      (issues) => {
        expect(issues).toEqual([{ message: 'Expected object, received null', path: 'sort' }]);
      }
    );
  });

  test('when cats are found, should expect an user list', async () => {
    const response = { docs: catsMock, page: 1, limit: 1, total: 1 };
    repository.paginate = jest.fn().mockResolvedValue(response);
    await expect(usecase.execute({ limit: 1, page: 1, search: {}, sort: { createdAt: -1 } })).resolves.toEqual({
      docs: catsMock,
      page: 1,
      limit: 1,
      total: 1
    });
  });

  test('when cats not found, should expect an empty list', async () => {
    const response = { docs: [], page: 1, limit: 1, total: 1 };
    repository.paginate = jest.fn().mockResolvedValue(response);
    await expect(usecase.execute({ limit: 1, page: 1, search: {}, sort: { createdAt: -1 } })).resolves.toEqual(
      response
    );
  });
});
