/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConfigService } from '@nestjs/config';

export class MailerConfig {
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
    this.host = this.configService.get('MAILER_HOST');
    this.port = this.configService.get('MAILER_PORT');
    this.username = this.configService.get('MAILER_USER');
    this.password = this.configService.get('MAILER_PASSWORD');
  }

  public getOptions(): any {
    return {
      transport: {
        host: this.host,
        port: this.port,
        auth: {
          user: this.username,
          pass: this.password
        }
      }
    };
  }
}
