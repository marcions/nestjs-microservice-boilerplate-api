import { Injectable } from '@nestjs/common';
import { name, version } from 'apps/users/package.json';
import { ILoggerAdapter } from 'libs/infra/logger/adapter';

import { IHealthService } from './adapter';

@Injectable()
export class HealthService implements IHealthService {
  constructor(private readonly loggerService: ILoggerAdapter) {}

  async getText(): Promise<string> {
    const appName = `${name}-${version} UP!!`;
    this.loggerService.info({ message: appName, context: `HealthService/getText` });

    return appName;
  }
}
