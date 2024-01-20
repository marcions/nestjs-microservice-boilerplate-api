import { Test } from '@nestjs/testing';

import { DogsListInput, DogsListOutput, DogsListUsecase } from '@@/apps/common-old/src/core/dogs/use-cases/dogs-list';
import { IDogsListAdapter } from '@@/apps/common-old/src/modules/dogs/adapter';
import { expectZodError, generateUUID } from '@@/libs/utils/tests/tests';

import { IDogsRepository } from '../../repository/dogs';
import { DogsEntity } from '../../entity/dogs';

const successInput: DogsListInput = { limit: 1, page: 1, search: {}, sort: { createdAt: -1 } };

const failureInput: DogsListInput = { search: null, sort: null, limit: 10, page: 1 };

describe('DogsListUsecase', () => {
  let usecase: IDogsListAdapter;
  let repository: IDogsRepository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
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
          inject: [IDogsRepository]
        }
      ]
    }).compile();

    usecase = app.get(IDogsListAdapter);
    repository = app.get(IDogsRepository);
  });

  test('when sort input is specified, should expect an error', async () => {
    await expectZodError(
      () => usecase.execute(failureInput),
      (issues) => {
        expect(issues).toEqual([{ message: 'Expected object, received null', path: 'sort' }]);
      }
    );
  });

  test('when dogs are found, should expect an dogs list', async () => {
    const doc = new DogsEntity({
      id: generateUUID(),
      name: 'dummy',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const paginateOutput: DogsListOutput = { docs: [doc], page: 1, limit: 1, total: 1 };

    repository.paginate = jest.fn().mockResolvedValue(paginateOutput);

    await expect(usecase.execute(successInput)).resolves.toEqual({
      docs: [doc],
      page: 1,
      limit: 1,
      total: 1
    });
  });

  test('when dogs not found, should expect an empty list', async () => {
    const paginateOutput: DogsListOutput = { docs: [], page: 1, limit: 1, total: 1 };

    repository.paginate = jest.fn().mockResolvedValue(paginateOutput);

    await expect(usecase.execute(successInput)).resolves.toEqual(paginateOutput);
  });
});
