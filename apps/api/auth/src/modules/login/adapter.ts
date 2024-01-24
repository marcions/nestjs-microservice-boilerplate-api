import { ApiTrancingInput } from 'libs/utils/request';

import { LoginInput, LoginOutput } from '@/core/user/use-cases/user-login';

export abstract class ILoginAdapter {
  abstract execute(input: LoginInput, trace: ApiTrancingInput): Promise<LoginOutput>;
}
