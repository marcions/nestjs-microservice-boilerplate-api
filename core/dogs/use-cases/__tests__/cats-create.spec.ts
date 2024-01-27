import { Test } from '@nestjs/testing';
import { IDogsCreateAdapter } from '@/apps/api/dogs/src-old/modules/dogs/adapter';
import { LoggerModule } from 'libs/infra/logger';
import { ApiInternalServerException } from 'libs/utils/exception';
import { RequestMock } from 'libs/utils/tests/mocks/request';
import { expectZodError, getMockUUID } from 'libs/utils/tests/tests';

import { DogsEntity } from '../../entity/dogs';
import { IDogsRepository } from '../../repository/dogs';
import { DogsCreateUsecase } from '../dogs-create';

const catCreateMock = new DogsEntity({
  id: getMockUUID(),
  age: 10,
  breed: 'dummy',
  name: 'dummy'
});

describe('DogsCreateUsecase', () => {
  let usecase: IDogsCreateAdapter;
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
          provide: IDogsCreateAdapter,
          useFactory: (dogsRepository: IDogsRepository) => {
            return new DogsCreateUsecase(dogsRepository);
          },
          inject: [IDogsRepository]
        }
      ]
    }).compile();

    usecase = app.get(IDogsCreateAdapter);
    repository = app.get(IDogsRepository);
  });

  test('when no input is specified, should expect an error', async () => {
    await expectZodError(
      () => usecase.execute({}, RequestMock.trancingMock),
      (issues) => {
        expect(issues).toEqual([
          { message: 'Required', path: DogsEntity.nameOf('name') },
          { message: 'Required', path: DogsEntity.nameOf('breed') },
          { message: 'Required', path: DogsEntity.nameOf('age') }
        ]);
      }
    );
  });

  test('when dogs created successfully, should expect a dogs that has been created', async () => {
    repository.create = jest.fn().mockResolvedValue(catCreateMock);
    repository.startSession = jest.fn().mockResolvedValue({
      commit: jest.fn(),
      rollback: jest.fn()
    });
    await expect(usecase.execute(catCreateMock, RequestMock.trancingMock)).resolves.toEqual(catCreateMock);
  });

  test('when transaction throw an error, should expect an error', async () => {
    repository.startSession = jest.fn().mockResolvedValue({
      commit: jest.fn(),
      rollback: jest.fn()
    });
    repository.create = jest.fn().mockRejectedValue(new ApiInternalServerException());
    await expect(usecase.execute(catCreateMock, RequestMock.trancingMock)).rejects.toThrow(ApiInternalServerException);
  });
});
