import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule } from 'libs/infra/queue';
import { PrismaModule } from 'prisma';

import { DogsController } from './controller';
import { DogsService } from './service';

@Module({
  imports: [ConfigModule.forRoot(), RabbitMQModule, PrismaModule],
  controllers: [DogsController],
  providers: [DogsService],
  exports: [DogsService]
})
export class DogsModule {}
