import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { RabbitMQResilientService } from './rabbitmq-resilient.service';

@Module({
  providers: [RabbitMQService, RabbitMQResilientService],
  exports: [RabbitMQService, RabbitMQResilientService],
})
export class RabbitMQModule {}
