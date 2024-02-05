/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConfigService } from '@nestjs/config';

export class QueueConfig {
  private host: string;
  private port: string;
  private username: string;
  private password: string;
  private configService: ConfigService;

  constructor() {
    this.configService = new ConfigService();
    this.setVariables();
  }

  public setVariables(): void {
    this.host = this.configService.get('REDIS_HOST');
    this.port = this.configService.get('REDIS_PORT');
    this.username = this.configService.get('REDIS_USER');
    this.password = this.configService.get('REDIS_PASSWORD');
  }

  public getOptions(): any {
    return {
      redis: {
        host: this.host,
        port: this.port,
        username: this.username,
        password: this.password
      }
    };
  }
}
