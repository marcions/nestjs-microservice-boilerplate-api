import { NestFactory } from '@nestjs/core';
import { DogModule } from './dog.module';

async function bootstrap() {
  const app = await NestFactory.create(DogModule);
  await app.listen(3000);
}
bootstrap();
