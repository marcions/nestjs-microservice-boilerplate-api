import { ICacheAdapter } from 'libs/infra/cache';
import { ISecretsAdapter } from 'libs/infra/secrets';
import { ValidateSchema } from 'libs/utils/decorators/validate-schema.decorator';
import { ApiTrancingInput } from 'libs/utils/request';
import { z } from 'zod';

export const LogoutSchema = z.object({ token: z.string().trim().min(10) });

export type LogoutInput = z.infer<typeof LogoutSchema>;
export type LogoutOutput = Promise<void>;

export class LogoutUsecase {
  constructor(private readonly redis: ICacheAdapter, private readonly secretes: ISecretsAdapter) {}

  @ValidateSchema(LogoutSchema)
  async execute(input: LogoutInput, { tracing, user }: ApiTrancingInput): LogoutOutput {
    await this.redis.set(input.token, input.token, { PX: this.secretes.TOKEN_EXPIRATION });
    tracing.logEvent('user-logout', `${user.login}`);
  }
}
