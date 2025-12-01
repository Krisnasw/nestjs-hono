# Shared Module

Global services and utilities available throughout the application.

## Services

### Database Service (Drizzle ORM)

Type-safe MySQL database access using Drizzle ORM.

```typescript
import { DatabaseService } from './shared/database';
import { users } from './shared/database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class MyService {
  constructor(private db: DatabaseService) {}

  async getUser(id: number) {
    const [user] = await this.db.db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return user;
  }
}
```

### Redis Service

Redis client with common operations.

```typescript
import { RedisService } from './shared/redis';

@Injectable()
export class MyService {
  constructor(private redis: RedisService) {}

  async cacheData(key: string, data: any, ttl = 3600) {
    await this.redis.set(key, JSON.stringify(data), ttl);
  }

  async getCachedData(key: string) {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }
}
```

### RabbitMQ Service

Message queue with automatic reconnection and resilience patterns.

```typescript
import { RabbitMQResilientService } from './shared/rabbitmq';

@Injectable()
export class MyService {
  constructor(private rabbitmq: RabbitMQResilientService) {}

  async publishEvent(event: any) {
    await this.rabbitmq.publishWithResilience(
      'events',
      'user.created',
      event
    );
  }
}
```

## Utilities

- **datetime-resolver.util.ts**: Date/time helpers
- **object.util.ts**: Object manipulation utilities
- **paginate.util.ts**: Pagination helpers
- **string.util.ts**: String manipulation utilities

## Configuration

All services are configured via environment variables. See `.env.example` for details.
