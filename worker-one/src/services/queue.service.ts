import { Injectable, Logger } from '@nestjs/common';
import { Queue, Worker } from 'bullmq';
import * as path from 'path';
import { QUEUE_NAME } from '../utils/consts';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);
  private jobQueue: Queue;
  private workers: Worker[] = [];
  private readonly host: string;
  private readonly port: number;

  constructor(private configService: ConfigService) {
    this.host = process.env.REDIS_HOST || this.configService.get('REDIS_HOST');
    this.port =
      parseInt(process.env.REDIS_PORT, 10) ||
      this.configService.get('REDIS_PORT');

    this.jobQueue = new Queue(QUEUE_NAME, {
      connection: {
        host: this.host,
        port: this.port,
      },
    });

    const processorFile = path.join(__dirname, '../workers/worker.js');
    const workersCount = parseInt(process.env.COUNT_OF_WORKERS_ONE) || 1;

    for (let i = 0; i < workersCount; i++) {
      const worker = new Worker(QUEUE_NAME, processorFile, {
        useWorkerThreads: true,
        connection: {
          host: this.host,
          port: this.port,
        },
      });

      worker.on('completed', (job) => {
        this.logger.log(
          `Worker ${i}, Microservice 1: Job ${job.id} has completed!`,
        );
      });

      worker.on('failed', (job, err) => {
        this.logger.log(
          `Worker ${i}, Microservice 1: Job ${job.id} has failed with ${err.message}`,
        );
      });

      this.workers.push(worker);
    }
  }

  async addJob(data: any) {
    return this.jobQueue.add('job', data);
  }
}
