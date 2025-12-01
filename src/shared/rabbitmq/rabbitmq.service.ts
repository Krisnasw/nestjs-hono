import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Connection, Consumer, Publisher } from 'rabbitmq-client';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: Connection;
  private publisher: Publisher;

  async onModuleInit() {
    const url = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

    this.connection = new Connection(url);

    this.connection.on('error', err => {
      this.logger.error('RabbitMQ connection error', err);
    });

    this.connection.on('connection', () => {
      this.logger.log('RabbitMQ connected');
    });

    this.publisher = this.connection.createPublisher({
      confirm: true,
      maxAttempts: 3,
    });

    this.logger.log('RabbitMQ service initialized');
  }

  async onModuleDestroy() {
    await this.publisher?.close();
    await this.connection?.close();
    this.logger.log('RabbitMQ connection closed');
  }

  async publish(exchange: string, routingKey: string, message: any) {
    await this.publisher.send({ exchange, routingKey }, message);
  }

  createConsumer(
    queue: string,
    onMessage: (message: any) => Promise<void>,
  ): Consumer {
    return this.connection.createConsumer({ queue }, async msg => {
      try {
        await onMessage(msg.body);
        // Message is automatically acknowledged when callback completes successfully
      } catch (error) {
        this.logger.error(`Error processing message from ${queue}`, error);
        // Throw error to nack the message
        throw error;
      }
    });
  }

  getConnection(): Connection {
    return this.connection;
  }
}
