import { Test } from '@nestjs/testing';
import { IDogsListAdapter } from 'apps/api/dogs/src/modules/dogs/adapter';
import { ILoggerAdapter, LoggerModule } from 'libs/infra/logger';
import { expectZodError, getMockUUID } from 'libs/utils/tests/tests';

import { DogsEntity } from '../../entity/dogs';
import { IDogsRepository } from '../../repository/dogs';
import { DogsListUsecase } from '../dogs-list';

const dogsMock = [
  new DogsEntity({
    id: getMockUUID(),
    age: 10,
    breed: 'dummy',
    name: 'dummy',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  })
];

describe('DogsListUsecase', () => {
  let usecase: IDogsListAdapter;
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
          provide: IDogsListAdapter,
          useFactory: (dogsRepository: IDogsRepository) => {
            return new DogsListUsecase(dogsRepository);
          },
          inject: [IDogsRepository, ILoggerAdapter]
        }
      ]
    }).compile();

    usecase = app.get(IDogsListAdapter);
    repository = app.get(IDogsRepository);
  });

  test('when no input is specified, should expect an error', async () => {
    await expectZodError(
      () => usecase.execute({ search: null, sort: null, limit: 10, page: 1 }),
      (issues) => {
        expect(issues).toEqual([{ message: 'Expected object, received null', path: 'sort' }]);
      }
    );
  });

  test('when dogs are found, should expect an user list', async () => {
    const response = { docs: dogsMock, page: 1, limit: 1, total: 1 };
    repository.paginate = jest.fn().mockResolvedValue(response);
    await expect(usecase.execute({ limit: 1, page: 1, search: {}, sort: { createdAt: -1 } })).resolves.toEqual({
      docs: dogsMock,
      page: 1,
      limit: 1,
      total: 1
    });
  });

  test('when dogs not found, should expect an empty list', async () => {
    const response = { docs: [], page: 1, limit: 1, total: 1 };
    repository.paginate = jest.fn().mockResolvedValue(response);
    await expect(usecase.execute({ limit: 1, page: 1, search: {}, sort: { createdAt: -1 } })).resolves.toEqual(
      response
    );
  });
});
