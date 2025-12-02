# NestJS DDD Boilerplate

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-1.0.0+-ff69b4)](https://bun.sh/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0+-red)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)

A production-ready NestJS boilerplate implementing Domain-Driven Design (DDD) with modern technologies including Hono, Drizzle ORM, and Bun runtime.

## 🌟 Features

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

## 📋 Table of Contents

- [🚀 Quick Start](#-quick-start)
- [📋 Prerequisites](#-prerequisites)
- [🛠️ Installation](#️-installation)
- [🗄️ Database Setup](#️-database-setup)
- [🏃 Running the Application](#-running-the-application)
- [🧪 Testing](#-testing)
- [📁 Project Structure](#-project-structure)
- [🔧 Configuration](#-configuration)
- [📚 Usage Examples](#-usage-examples)
- [📖 Documentation](#-documentation)
- [🔄 Migration Guide](#-migration-guide)
- [🤝 Contributing](#-contributing)
- [📝 Changelog](#-changelog)
- [📄 License](#-license)

## 🚀 Quick Start

Get your NestJS DDD application running in minutes:

```bash
# Clone the repository
git clone https://github.com/your-username/nestjs-ddd-trst.git
cd nestjs-ddd-trst

# Install dependencies
bun install

# Setup environment
cp .env.example .env

# Create database and run migrations
mysql -u root -p -e "CREATE DATABASE boilerplate;"
bun run db:push

# Start development server
bun run start:dev

# Open API documentation
open http://localhost:3000/api-docs
```

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

- [Contributing Guide](./CONTRIBUTING.md) - How to contribute to this project
- [Changelog](./CHANGELOG.md) - Version history and changes
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

We welcome contributions of all kinds! Whether you're fixing bugs, adding features, improving documentation, or reporting issues, we appreciate your help.

📖 **See our [Contributing Guide](./CONTRIBUTING.md)** for detailed information on:
- Development environment setup
- Code standards and conventions
- Pull request process
- How to report bugs and request features
- Community guidelines

### Quick Ways to Contribute
- 🐛 [Report a bug](https://github.com/your-username/nestjs-ddd-trst/issues)
- 💡 [Request a feature](https://github.com/your-username/nestjs-ddd-trst/issues)
- 📝 [Improve documentation](https://github.com/your-username/nestjs-ddd-trst/edit/main/README.md)
- 🔧 [Submit a pull request](https://github.com/your-username/nestjs-ddd-trst/compare)

## 📝 Changelog

See our [CHANGELOG.md](./CHANGELOG.md) for a detailed history of changes, including:
- New features and enhancements
- Bug fixes and security updates
- Breaking changes and migration guides
- Version release notes

## 📄 License

This project is [MIT licensed](LICENSE).

## 🙏 Acknowledgments

This boilerplate is built with cutting-edge technologies and follows industry best practices:

### Core Technologies
- [NestJS](https://nestjs.com/) - Progressive Node.js framework for building efficient server-side applications
- [Bun](https://bun.sh/) - Ultra-fast JavaScript runtime, bundler, transpiler, and package manager
- [Hono](https://hono.dev/) - Ultrafast web framework with CloudFlare Workers compatibility
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe SQL toolkit for TypeScript & JavaScript
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript that compiles to plain JavaScript

### Database & Caching
- [MySQL](https://www.mysql.com/) - World's most popular open source database
- [Redis](https://redis.io/) - In-memory data structure store used as database, cache, and message broker
- [RabbitMQ Client](https://github.com/cody-greene/node-rabbitmq-client) - Modern, stable, and well-maintained RabbitMQ client

### Development & Testing
- [Jest](https://jestjs.io/) - Delightful JavaScript Testing Framework
- [ESLint](https://eslint.org/) - Find and fix problems in your JavaScript code
- [Prettier](https://prettier.io/) - An opinionated code formatter
- [Husky](https://typicode.github.io/husky/) - Git hooks made easy

### Security & Validation
- [class-validator](https://github.com/typestack/class-validator) - Decorator-based property validation
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Library to help you hash passwords
- [CSRF Protection](https://github.com/Psifi-Solutions/csrf-csrf) - Double Submit CSRF Protection

### Monitoring & Observability
- [OpenTelemetry](https://opentelemetry.io/) - Observability framework for cloud-native software
- [Pino](https://github.com/pinojs/pino) - Super fast, all natural JSON logger
- [Winston](https://github.com/winstonjs/winston) - A logger for just about everything

### API & Documentation
- [TRPC](https://trpc.io/) - End-to-end typesafe APIs
- [Swagger/OpenAPI](https://swagger.io/) - API documentation for humans
- [Zod](https://zod.dev/) - TypeScript-first schema validation

### Special Thanks
- The open-source community for creating amazing tools and libraries
- All contributors who help improve this project
- The NestJS team for creating such an amazing framework

---

## 📞 Support

- 📖 [Documentation](./src/shared/README.md)
- 🐛 [Report Issues](https://github.com/your-username/nestjs-ddd-trst/issues)
- 💡 [Feature Requests](https://github.com/your-username/nestjs-ddd-trst/issues)
- 💬 [Discussions](https://github.com/your-username/nestjs-ddd-trst/discussions)

---

**⭐ If this project helps you, consider giving it a star on GitHub!**
