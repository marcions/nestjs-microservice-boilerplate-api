import { Test } from '@nestjs/testing';

import { IDogsGetByIDAdapter } from '@/modules/dogs/adapter';
import { ApiNotFoundException } from '@/utils/exception';
import { expectZodError, generateUUID } from '@/utils/tests/tests';

import { IDogsRepository } from '../../repository/dogs';
import { DogsGetByIDInput, DogsGetByIDOutput, DogsGetByIdUsecase } from '../dogs-getByID';
import { DogsEntity } from './../../entity/dogs';

const successInput: DogsGetByIDInput = {
  id: generateUUID()
};

const failureInput: DogsGetByIDInput = {};

describe('DogsGetByIdUsecase', () => {
  let usecase: IDogsGetByIDAdapter;
  let repository: IDogsRepository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
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
          inject: [IDogsRepository]
        }
      ]
    }).compile();

    usecase = app.get(IDogsGetByIDAdapter);
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

  test('when dogs found, should expect a dogs that has been found', async () => {
    const findByIdOutput: DogsGetByIDOutput = new DogsEntity({
      id: generateUUID(),
      name: 'dummy'
    });
    repository.findById = jest.fn().mockResolvedValue(findByIdOutput);

    await expect(usecase.execute(successInput)).resolves.toEqual(findByIdOutput);
  });
});
