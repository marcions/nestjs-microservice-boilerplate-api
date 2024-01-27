import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'libs/infra/logger/module';
import { RabbitMQModule } from 'libs/infra/queue';

import { PrismaModule } from '@/prisma';

import { DogsController } from './controller';
import { DogsService } from './service';

@Module({
  imports: [ConfigModule.forRoot(), RabbitMQModule, PrismaModule, LoggerModule],
  controllers: [DogsController],
  providers: [DogsService],
  exports: [DogsService]
})
export class DogsModule {}
