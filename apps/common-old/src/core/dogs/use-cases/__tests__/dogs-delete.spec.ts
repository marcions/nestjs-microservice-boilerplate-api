import { Test } from '@nestjs/testing';

import { DogsDeleteInput, DogsDeleteOutput, DogsDeleteUsecase } from '@@/apps/common-old/src/core/dogs/use-cases/dogs-delete';
import { IDogsDeleteAdapter } from '@@/apps/common-old/src/modules/dogs/adapter';
import { ApiNotFoundException } from '@@/libs/utils/exception';
import { expectZodError, generateUUID } from '@@/libs/utils/tests/tests';

import { IDogsRepository } from '../../repository/dogs';
import { DogsEntity } from '../../entity/dogs';

const successInput: DogsDeleteInput = {
  id: generateUUID()
};

const failureInput: DogsDeleteInput = {};

describe('DogsDeleteUsecase', () => {
  let usecase: IDogsDeleteAdapter;
  let repository: IDogsRepository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
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
          inject: [IDogsRepository]
        }
      ]
    }).compile();

    usecase = app.get(IDogsDeleteAdapter);
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

  test('when dogs deleted successfully, should expect a dogs that has been deleted', async () => {
    const findByIdOutput: DogsDeleteOutput = new DogsEntity({
      id: generateUUID(),
      name: 'dummy'
    });

    repository.findById = jest.fn().mockResolvedValue(findByIdOutput);
    repository.updateOne = jest.fn();

    await expect(usecase.execute(successInput)).resolves.toEqual({
      ...findByIdOutput,
      deletedAt: expect.any(Date)
    });
  });
});
