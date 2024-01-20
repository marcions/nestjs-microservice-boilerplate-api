import { Injectable } from '@nestjs/common';

import { name, version } from '@@/package.json';

@Injectable()
export class HealthService {
  getHello(): string {
    return `${name}:${version} available!`;
  }
}
