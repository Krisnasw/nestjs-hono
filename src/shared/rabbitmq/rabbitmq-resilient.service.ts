import { Injectable, Logger } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

@Injectable()
export class RabbitMQResilientService {
  private readonly logger = new Logger(RabbitMQResilientService.name);
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;

  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async publishWithResilience(
    exchange: string,
    routingKey: string,
    message: any,
    retries = 0,
  ): Promise<void> {
    try {
      await this.rabbitMQService.publish(exchange, routingKey, message);
      this.logger.log(`Message published to ${exchange}/${routingKey}`);
    } catch (error) {
      if (retries < this.maxRetries) {
        this.logger.warn(
          `Failed to publish message, retrying (${retries + 1}/${this.maxRetries})`,
        );
        await this.delay(this.retryDelay * Math.pow(2, retries));
        return this.publishWithResilience(
          exchange,
          routingKey,
          message,
          retries + 1,
        );
      }
      this.logger.error('Failed to publish message after max retries', error);
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
