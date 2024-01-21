import { Module } from '@nestjs/common';
import { LoggerModule } from 'libs/infra/logger';

import { IHttpAdapter } from './adapter';
import { HttpService } from './service';

@Module({
  imports: [LoggerModule],
  providers: [
    {
      provide: IHttpAdapter,
      useClass: HttpService
    }
  ],
  exports: [IHttpAdapter]
})
export class HttpModule {}
