/* eslint-disable sonarjs/no-nested-template-literals */
import { ConfigService } from '@nestjs/config';
import { blue, bold, gray } from 'colorette';
import { config } from 'dotenv';
import { writeFileSync } from 'fs';
import { CatsSchema } from 'libs/infra/database/postgres/schemas/cats';
import { DogsSchema } from 'libs/infra/database/postgres/schemas/dogs';
import { Sequelize } from 'sequelize-typescript';

config();

const configService = new ConfigService();

const connection = `postgresql://${configService.get('POSTGRES_USER')}:${configService.get(
  'POSTGRES_PASSWORD'
)}@${configService.get('POSTGRES_HOST')}:${configService.get('POSTGRES_PORT')}/${configService.get(
  'POSTGRES_DATABASE'
)}`;

const sequelizeConfig = new Sequelize(connection, {
  dialect: 'postgres',
  benchmark: true,
  minifyAliases: true,
  // eslint-disable-next-line no-console
  logging: (msm, timing) => console.log(blue(`[sequelize]`), gray(msm), `${blue(bold(`${timing}ms`))}`)
});

sequelizeConfig.addModels([CatsSchema]);
sequelizeConfig.addModels([DogsSchema]);

export { sequelizeConfig };

const databaseConfigMap = {
  DEV: 'development',
  TEST: 'test',
  PRD: 'production'
}[configService.get('ENV')];

const postgresConfig = sequelizeConfig.config.dialectOptions;

writeFileSync(
  'libs/infra/database/postgres/database.json',
  JSON.stringify({
    [databaseConfigMap]: { ...postgresConfig, username: postgresConfig['user'], user: undefined, dialect: 'postgres' }
  })
);
