import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

const configService = new ConfigService();

const dataSource = new DataSource({
  type: 'mysql',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DATABASE'),
  migrationsTableName: 'migrations_table',
  synchronize: configService.get<string>('ENV').toLowerCase() !== 'prd',
  migrations: ['src/infra/database/postgres/migrations/*.ts'],
  entities: ['src/infra/database/postgres/schemas/*.ts']
});

export default dataSource;
