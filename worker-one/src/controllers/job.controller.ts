import { Controller, Logger } from '@nestjs/common';
import { QueueService } from '../services/queue.service';
import { CreateJobEvent } from '../events/create-job.event';
import { Payload, MessagePattern } from '@nestjs/microservices';

@Controller()
export class JobController {
  private readonly logger = new Logger(JobController.name);
  constructor(private readonly queueService: QueueService) {}

  @MessagePattern({ cmd: 'createJob1' })
  async handleJobCreation(@Payload() data: CreateJobEvent) {
    this.logger.log(
      `Received job creation at Microservice 1, event with payload: ${JSON.stringify(data)}`,
    );
    try {
      const job = await this.queueService.addJob(data.payload);
      return { status: `Job created successfully, Microservice 1: ${job.id}` };
    } catch (error) {
      this.logger.error(
        `Failed to create job at Microservice 1: ${error.message}`,
      );
    }
  }
}
