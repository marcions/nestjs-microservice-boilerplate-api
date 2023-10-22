import { Test } from '@nestjs/testing';

import { IUserGetByIDAdapter } from '@/modules/user/adapter';
import { ApiNotFoundException } from '@/utils/exception';
import { UserResponseMock } from '@/utils/tests/mocks/user';
import { expectZodError, generateUUID } from '@/utils/tests/tests';

import { UserEntity } from '../../entity/user';
import { IUserRepository } from '../../repository/user';
import { UserGetByIdUsecase } from '../user-getByID';

describe('UserGetByIdUsecase', () => {
  let usecase: IUserGetByIDAdapter;
  let repository: IUserRepository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: IUserRepository,
          useValue: {}
        },
        {
          provide: IUserGetByIDAdapter,
          useFactory: (userRepository: IUserRepository) => {
            return new UserGetByIdUsecase(userRepository);
          },
          inject: [IUserRepository]
        }
      ]
    }).compile();

    usecase = app.get(IUserGetByIDAdapter);
    repository = app.get(IUserRepository);
  });

  test('when no input is specified, should expect an error', async () => {
    await expectZodError(
      () => usecase.execute({}),
      (issues) => {
        expect(issues).toEqual([{ message: 'Required', path: UserEntity.nameof('id') }]);
      }
    );
  });

  test('when user not found, should expect an errror', async () => {
    repository.findById = jest.fn().mockResolvedValue(null);
    await expect(usecase.execute({ id: generateUUID() })).rejects.toThrowError(ApiNotFoundException);
  });

  test('when user getById successfully, should expect a user', async () => {
    repository.findById = jest.fn().mockResolvedValue(UserResponseMock.userMock);
    await expect(usecase.execute({ id: generateUUID() })).resolves.toEqual(UserResponseMock.userMock);
  });
});
