import { LogoutInput, LogoutOutput } from 'core/user/use-cases/user-logout';
import { ApiTrancingInput } from 'libs/utils/request';

export abstract class ILogoutAdapter {
  abstract execute(input: LogoutInput, trace: ApiTrancingInput): Promise<LogoutOutput>;
}
