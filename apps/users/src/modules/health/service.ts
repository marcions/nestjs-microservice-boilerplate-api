import { Injectable } from '@nestjs/common';
import { name, version } from 'apps/users-api/package.json';
import { ILoggerService } from 'libs/modules/global/logger/adapter';

import { IHealthService } from './adapter';

@Injectable()
export class HealthService implements IHealthService {
  constructor(private readonly loggerService: ILoggerService) {}

  async getText(): Promise<string> {
    const appName = `${name}-${version} UP!!`;
    this.loggerService.info({ message: appName, context: `HealthService/getText` });

    return appName;
  }
}
