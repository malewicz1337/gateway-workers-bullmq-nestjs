import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { NatsClientModule } from './nats-client/nats-client.module';

@Module({
  imports: [NatsClientModule],
  controllers: [AppController],
})
export class AppModule {}
