import { NestFactory } from '@nestjs/core';
import { CatsModule } from './cats.module';

async function bootstrap() {
  const app = await NestFactory.create(CatsModule);
  await app.listen(3000);
}
bootstrap();
