import 'libs/utils/tracing';

import { HttpStatus, RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { description, name, version } from 'apps/users/package.json';
import bodyParser from 'body-parser';
import { bold } from 'colorette';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { IUserRepository } from 'libs/core/user/repository/user';
import { UserAdminSeed } from 'libs/infra/database/mongo/seed/create-user-admin';
import { UserHubcontrolSeed } from 'libs/infra/database/mongo/seed/create-user-hub';
import { ILoggerAdapter } from 'libs/infra/logger/adapter';
import { ISecretsAdapter } from 'libs/infra/secrets';
import { ApiInternalServerException } from 'libs/utils/exception';
import { AppExceptionFilter } from 'libs/utils/filters/http-exception.filter';
import { ExceptionInterceptor } from 'libs/utils/interceptors/http-exception.interceptor';
import { HttpLoggerInterceptor } from 'libs/utils/interceptors/http-logger.interceptor';
import { MetricsInterceptor } from 'libs/utils/interceptors/metrics.interceptor';
import { TracingInterceptor } from 'libs/utils/interceptors/tracing.interceptor';

import { MainModule } from './modules/module';

async function bootstrap() {
  const app = await NestFactory.create(MainModule, {
    bufferLogs: true,
    cors: true
  });

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.PRECONDITION_FAILED
    })
  );

  const loggerService = app.get(ILoggerAdapter);

  loggerService.setApplication(name);

  app.useLogger(loggerService);

  app.useGlobalFilters(new AppExceptionFilter(loggerService));

  app.useGlobalInterceptors(
    new ExceptionInterceptor(loggerService),
    new HttpLoggerInterceptor(loggerService),
    new TracingInterceptor(loggerService),
    new MetricsInterceptor()
  );

  app.use(helmet());

  const {
    USERS: { PORT, HOST },
    ENV,
    MONGO_URL,
    POSTGRES_URL,
    ZIPKIN_URL,
    PROMETHUES_URL,
    RATE_LIMIT_BY_USER,
    PGADMIN_URL,
    MONGO_EXPRESS_URL,
    RABBITMQ_URL
  } = app.get(ISecretsAdapter);

  const MINUTES = 15 * 60 * 1000;
  const limiter = rateLimit({
    windowMs: MINUTES,
    limit: RATE_LIMIT_BY_USER,
    standardHeaders: 'draft-7',
    legacyHeaders: false
  });

  app.use(limiter);

  app.use(bodyParser.urlencoded({ extended: true }));

  app.enableVersioning({ type: VersioningType.URI });

  app.setGlobalPrefix('users');

  process.on('uncaughtException', (error) => {
    loggerService.error(new ApiInternalServerException(error.message));
  });

  process.on('unhandledRejection', (error) => {
    loggerService.error(new ApiInternalServerException(error['message'] ?? (error as string)));
  });

  const config = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .addBearerAuth()
    .setVersion(version)
    .addServer(HOST)
    .addTag('Swagger Documentation')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  loggerService.log(`🟢 ${name}-api listening at ${bold(PORT)} on ${bold(ENV.toUpperCase())} 🟢
`);

  await app.listen(PORT, () => {
    loggerService.log(`Application Successfully Started\n`);
    loggerService.log(`🟢 ${name} listening at ${bold(PORT)} on ${bold(ENV?.toUpperCase())} 🟢\n`);
    loggerService.log(`🟢 Swagger listening at ${bold(`${HOST}/docs`)} 🟢\n`);
  });

  loggerService.log(`🔵 Postgres listening at ${bold(POSTGRES_URL)}`);
  loggerService.log(`🔶 PgAdmin listening at ${bold(PGADMIN_URL)}\n`);
  loggerService.log(`🔵 Mongo listening at ${bold(MONGO_URL)}`);
  loggerService.log(`🔶 Mongo express listening at ${bold(MONGO_EXPRESS_URL)}\n`);
  loggerService.log(`⚪ Zipkin[${bold('Tracing')}] listening at ${bold(ZIPKIN_URL)}`);
  loggerService.log(`⚪ Promethues[${bold('Metrics')}] listening at ${bold(PROMETHUES_URL)}`);
  loggerService.log(`🔵 RabbitMQ listening at ${bold(RABBITMQ_URL)}\n`);

  const userRepository = app.get(IUserRepository);

  await userRepository.seed([UserAdminSeed]);
  await userRepository.seed([UserHubcontrolSeed]);
}
bootstrap();
