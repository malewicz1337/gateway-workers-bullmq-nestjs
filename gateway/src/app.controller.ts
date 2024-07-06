import {
  Controller,
  Inject,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { CreateJobRequest } from './dto';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreateJobEvent } from './events';

@Controller()
export class AppController {
  private readonly commandMap = {
    cmd1: 'createJob1',
    cmd2: 'createJob2',
    cmd3: 'createJob3',
  };

  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Post('createJob')
  createJob(@Body() createJobRequest: CreateJobRequest): Observable<any> {
    const { identifier, payload } = createJobRequest;

    const command = this.commandMap[identifier];
    if (!command) {
      throw new BadRequestException('Invalid identifier');
    }

    return this.natsClient.send({ cmd: command }, new CreateJobEvent(payload));
  }
}
