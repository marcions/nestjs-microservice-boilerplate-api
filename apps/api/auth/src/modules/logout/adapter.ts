import { ApiTrancingInput } from 'libs/utils/request';

import { LogoutInput, LogoutOutput } from '@/core/user/use-cases/user-logout';

export abstract class ILogoutAdapter {
  abstract execute(input: LogoutInput, trace: ApiTrancingInput): Promise<LogoutOutput>;
}
