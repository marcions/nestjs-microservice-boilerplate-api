import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HealthService } from './health.service';
@Controller()
@ApiTags('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get(['/health', '/'])
  async getHealth(): Promise<string> {
    return this.healthService.getHello();
  }
}
