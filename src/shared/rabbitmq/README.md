# RabbitMQ Module

This module provides RabbitMQ integration using `rabbitmq-client` with resilience patterns via `nestjs-resilience`.

## Features

- Connection management with automatic reconnection
- Publisher with confirmation and retry logic
- Consumer creation with automatic ack/nack
- Circuit breaker and retry patterns for resilient message publishing

## Configuration

Add the following environment variables to your `.env` file:

```env
RABBITMQ_URL=amqp://guest:guest@localhost:5672
RABBITMQ_EXCHANGE=my-exchange
RABBITMQ_QUEUE=my-queue
```

## Usage

### Import the Module

```typescript
import { RabbitMQModule } from './modules/rabbitmq';

@Module({
  imports: [RabbitMQModule],
})
export class AppModule {}
```

### Publishing Messages

```typescript
import { RabbitMQService } from './modules/rabbitmq';

@Injectable()
export class MyService {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async sendMessage() {
    await this.rabbitMQService.publish(
      'my-exchange',
      'routing.key',
      { data: 'Hello RabbitMQ!' }
    );
  }
}
```

### Publishing with Resilience

```typescript
import { RabbitMQResilientService } from './modules/rabbitmq';

@Injectable()
export class MyService {
  constructor(private readonly rabbitMQResilientService: RabbitMQResilientService) {}

  async sendMessage() {
    // Automatically retries up to 3 times with exponential backoff
    // Circuit breaker opens after 5 failures
    await this.rabbitMQResilientService.publishWithResilience(
      'my-exchange',
      'routing.key',
      { data: 'Hello RabbitMQ!' }
    );
  }
}
```

### Consuming Messages

```typescript
import { RabbitMQService } from './modules/rabbitmq';

@Injectable()
export class MyService implements OnModuleInit {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async onModuleInit() {
    const consumer = this.rabbitMQService.createConsumer(
      'my-queue',
      async (message) => {
        console.log('Received message:', message);
        // Process message here
      }
    );
  }
}
```

## Resilience Configuration

The `RabbitMQResilientService` uses the following resilience patterns:

- **Circuit Breaker**: Opens after 5 failures, resets after 30 seconds
- **Retry**: Up to 3 attempts with 1 second initial delay and exponential backoff (2x)

You can customize these settings by modifying the decorators in `rabbitmq-resilient.service.ts`.
