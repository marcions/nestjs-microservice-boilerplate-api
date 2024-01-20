import { LogoutInput, LogoutOutput } from '@@/apps/common-old/src/core/user/use-cases/user-logout';
import { ApiTrancingInput } from '@@/libs/utils/request';

export abstract class ILogoutAdapter {
  abstract execute(input: LogoutInput, trace: ApiTrancingInput): Promise<LogoutOutput>;
}
