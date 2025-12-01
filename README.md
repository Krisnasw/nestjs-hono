# NestJS DDD Boilerplate

A modern NestJS boilerplate with Hono, Drizzle ORM, and Bun runtime.

## 🚀 Features

- **Bun Runtime**: Ultra-fast JavaScript runtime and package manager
- **Hono Adapter**: High-performance HTTP server (3x faster than Express)
- **Drizzle ORM**: Type-safe SQL with MySQL support
- **RabbitMQ**: Message queue with automatic reconnection and resilience
- **Redis**: Caching and session management
- **TRPC**: End-to-end typesafe APIs
- **Swagger**: API documentation
- **JWT Authentication**: Secure authentication
- **Validation**: Class-validator and class-transformer
- **Logging**: Pino logger with pretty printing
- **Testing**: Jest for unit and e2e tests

## 📋 Prerequisites

- [Bun](https://bun.sh) >= 1.0.0
- MySQL >= 8.0
- Redis (optional)
- RabbitMQ (optional)

## 🛠️ Installation

```bash
# Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
```

## 🗄️ Database Setup

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE boilerplate;"

# Push schema to database
bun run db:push

# Or generate and run migrations
bun run db:generate
bun run db:migrate

# Open Drizzle Studio (database GUI)
bun run db:studio
```

## 🏃 Running the Application

```bash
# Development mode with hot reload
bun run start:dev

# Production build
bun run build

# Production mode
bun run start:prod

# Debug mode
bun run start:debug
```

## 🧪 Testing

```bash
# Unit tests
bun run test

# E2E tests
bun run test:e2e

# Test coverage
bun run test:cov
```

## 📁 Project Structure

```
src/
├── common/          # Common utilities and contexts
├── exceptions/      # Custom exceptions
├── filters/         # Exception filters
├── interceptors/    # Custom interceptors
├── interfaces/      # TypeScript interfaces
├── modules/         # Feature modules
│   └── hello/       # Example module
├── shared/          # Shared services (global)
│   ├── database/    # Drizzle ORM setup
│   ├── rabbitmq/    # RabbitMQ service
│   ├── redis/       # Redis service
│   ├── services/    # Shared services
│   ├── swagger/     # Swagger configuration
│   └── utils/       # Utility functions
├── app.module.ts    # Root module
└── main.ts          # Application entry point
```

## 🔧 Configuration

All configuration is done via environment variables. See `.env.example` for available options.

### Database (MySQL)
```env
DATABASE_URL=mysql://root:@localhost:3306/boilerplate
```

### Redis
```env
REDIS_URL=redis://localhost:6379
REDIS_PREFIX=boilerplate:
```

### RabbitMQ
```env
RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

## 📚 Usage Examples

### Database (Drizzle ORM)

```typescript
import { DatabaseService } from './shared/database';
import { users } from './shared/database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserService {
  constructor(private db: DatabaseService) {}

  async findUser(id: number) {
    const [user] = await this.db.db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return user;
  }
}
```

### Redis

```typescript
import { RedisService } from './shared/redis';

@Injectable()
export class CacheService {
  constructor(private redis: RedisService) {}

  async cacheData(key: string, data: any, ttl = 3600) {
    await this.redis.set(key, JSON.stringify(data), ttl);
  }
}
```

### RabbitMQ

```typescript
import { RabbitMQResilientService } from './shared/rabbitmq';

@Injectable()
export class EventService {
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

## 📖 Documentation

- [Migration Guide](./MIGRATION_GUIDE.md) - Detailed migration information
- [Shared Services](./src/shared/README.md) - Documentation for shared services
- [RabbitMQ Module](./src/shared/rabbitmq/README.md) - RabbitMQ usage guide

## 🔄 Migration from Previous Version

This project has been migrated from:
- npm/pnpm → Bun
- Express → Hono
- Prisma → Drizzle ORM

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed migration steps.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is [MIT licensed](LICENSE).

## 🙏 Acknowledgments

Built with:
- [NestJS](https://nestjs.com/)
- [Bun](https://bun.sh/)
- [Hono](https://hono.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [RabbitMQ Client](https://github.com/cody-greene/node-rabbitmq-client)
