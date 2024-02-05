import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule } from 'libs/infra/rabbitmq';
import { PrismaModule } from 'prisma';

import { DogsController } from './controller';
import { DogsService } from './service';

@Module({
  imports: [ConfigModule.forRoot(), RabbitMQModule],
  controllers: [DogsController],
  providers: [],
  exports: []
})
export class DogsModule {}
