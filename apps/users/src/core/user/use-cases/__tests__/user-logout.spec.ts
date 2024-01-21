import { Test } from '@nestjs/testing';
import { ICacheAdapter } from 'libs/infra/cache';
import { ISecretsAdapter, SecretsModule } from 'libs/infra/secrets';
import { RequestMock } from 'libs/utils/tests/mocks/request';
import { expectZodError } from 'libs/utils/tests/tests';

import { TokenModule } from '@/libs/auth';
import { ILogoutAdapter } from '@/modules/logout/adapter';

import { LogoutUsecase } from '../user-logout';

describe('LogoutUsecase', () => {
  let usecase: ILogoutAdapter;
  let cache: ICacheAdapter;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [TokenModule, SecretsModule],
      providers: [
        {
          provide: ICacheAdapter,
          useValue: {
            set: jest.fn()
          }
        },
        {
          provide: ILogoutAdapter,
          useFactory: (cache: ICacheAdapter, secrets: ISecretsAdapter) => {
            return new LogoutUsecase(cache, secrets);
          },
          inject: [ICacheAdapter, ISecretsAdapter]
        }
      ]
    }).compile();

    usecase = app.get(ILogoutAdapter);
    cache = app.get(ICacheAdapter);
  });

  test('when no input is specified, should expect an error', async () => {
    await expectZodError(
      () => usecase.execute({}, RequestMock.trancingMock),
      (issues) => {
        expect(issues).toEqual([{ message: 'Required', path: 'token' }]);
      }
    );
  });

  test('when user logout, should expect set token to blacklist', async () => {
    cache.set = jest.fn();
    await expect(usecase.execute({ token: '12345678910' }, RequestMock.trancingMock)).resolves.toBeUndefined();
  });
});
