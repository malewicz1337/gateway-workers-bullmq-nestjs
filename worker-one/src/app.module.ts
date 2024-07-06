import { Module } from '@nestjs/common';
import { JobController } from './controllers/job.controller';
import { QueueService } from './services/queue.service';
import { ConfigModule } from '@nestjs/config';
import { NatsClientModule } from './nats-client/nats-client.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NatsClientModule,
  ],
  controllers: [JobController],
  providers: [QueueService],
})
export class AppModule {}
