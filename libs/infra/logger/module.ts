import { Module } from '@nestjs/common';

import { ISecretsAdapter, SecretsModule } from '@@/libs/infra/secrets';

import { ILoggerAdapter } from './adapter';
import { LoggerService } from './service';

@Module({
  imports: [SecretsModule],
  providers: [
    {
      provide: ILoggerAdapter,
      useFactory: ({ LOGER_LEVEL }: ISecretsAdapter) => {
        const logger = new LoggerService();
        logger.connect(LOGER_LEVEL);
        return logger;
      },
      inject: [ISecretsAdapter]
    }
  ],
  exports: [ILoggerAdapter]
})
export class LoggerModule {}
