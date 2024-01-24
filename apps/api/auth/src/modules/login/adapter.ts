import { LoginInput, LoginOutput } from 'core/user/use-cases/user-login';
import { ApiTrancingInput } from 'libs/utils/request';

export abstract class ILoginAdapter {
  abstract execute(input: LoginInput, trace: ApiTrancingInput): Promise<LoginOutput>;
}
