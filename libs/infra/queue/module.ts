import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASS
      }
    }),
    BullModule.registerQueue({
      name: 'sendMail-queue'
    })
  ]
})
export class QueueModule {}
