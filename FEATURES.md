# NestJS DDD Boilerplate - Features

## 🎯 Core Features

### 1. Database - PostgreSQL with Drizzle ORM
- ✅ PostgreSQL database (migrated from MySQL)
- ✅ Drizzle ORM for type-safe queries
- ✅ Migration system
- ✅ Connection pooling

### 2. Authentication & Authorization
- ✅ User registration & login
- ✅ JWT authentication (access & refresh tokens)
- ✅ API key authentication
- ✅ Social login support (Google, Facebook, GitHub, Apple)
- ✅ Password hashing with bcrypt
- ✅ Email verification support
- ✅ Account activation/deactivation

**Guards:**
- `JwtAuthGuard` - For JWT token authentication
- `ApiKeyGuard` - For API key authentication

### 3. Observability & Monitoring

#### OpenTelemetry (OTEL)
- ✅ Distributed tracing
- ✅ Automatic instrumentation
- ✅ OTLP exporter support
- ✅ Service name & version tracking
- ✅ Compatible with Jaeger, Tempo, etc.

#### Logging
- ✅ Request/response logging
- ✅ Error logging with stack traces
- ✅ Sensitive data redaction
- ✅ Request ID correlation
- ✅ Performance metrics (duration)
- ✅ Structured logging with Pino

### 4. API Documentation

#### Hono Swagger UI
- ✅ Interactive Swagger UI at `/swagger`
- ✅ OpenAPI spec at `/swagger/spec.json`
- ✅ Auto-generated from decorators
- ✅ Bearer JWT authentication support
- ✅ API key authentication support
- ✅ Request/response examples

### 5. HTTP Framework - Hono
- ✅ High-performance HTTP adapter
- ✅ CORS support
- ✅ Middleware support
- ✅ Fast routing

### 6. Validation & Transformation
- ✅ Class-validator for DTO validation
- ✅ Class-transformer for serialization
- ✅ Automatic whitelist filtering
- ✅ Transform pipes

### 7. Response Formatting
- ✅ Standardized API response format
- ✅ Success/error handling
- ✅ Metadata (requestId, platform, IP)
- ✅ Pagination support

### 8. Additional Features
- ✅ Redis integration
- ✅ RabbitMQ integration
- ✅ Event emitter
- ✅ Cron jobs (Schedule)
- ✅ Health checks
- ✅ Rate limiting support
- ✅ Resilience patterns
- ✅ Request context

## 📁 Project Structure

```
src/
├── common/              # Common utilities and contexts
├── exceptions/          # Custom exceptions
├── filters/            # Exception filters
├── interceptors/       # Interceptors (logging, response transform)
├── interfaces/         # TypeScript interfaces
├── modules/
│   ├── auth/          # Authentication module
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── guards/
│   │   └── dto/
│   ├── hello/         # Example module
│   └── health/        # Health check module
└── shared/
    ├── database/      # Database service & schema
    ├── redis/         # Redis service
    ├── rabbitmq/      # RabbitMQ service
    ├── services/      # Shared services
    ├── swagger/       # Swagger setup
    └── telemetry/     # OpenTelemetry setup
```

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Setup database
createdb boilerplate
bun run db:push

# Generate Swagger spec
bun run swagger:generate

# Start development server
bun run start:dev

# Access:
# - API: http://localhost:8080/api
# - Swagger: http://localhost:8080/swagger
# - Health: http://localhost:8080/api/health
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/social-login` - Social login
- `POST /api/auth/api-key` - Generate API key (protected)
- `GET /api/auth/me` - Get current user (protected)

### Health
- `GET /api/health` - Health check
- `GET /api/health/ping` - Simple ping

### Hello (Example)
- `GET /api/hello` - Example endpoint

## 🔧 Configuration

### Environment Variables

```env
# Server
NODE_ENV=development
PORT=8080
HOST=0.0.0.0

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=
DB_DATABASE_NAME=boilerplate

# Authentication
JWT_SECRET=your-secret-key

# OpenTelemetry
OTEL_ENABLED=false
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# RabbitMQ (optional)
RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

## 🛠️ Development

```bash
# Build
bun run build

# Format code
bun run format

# Lint
bun run lint

# Test
bun run test

# Database
bun run db:generate    # Generate migration
bun run db:push        # Push schema to DB
bun run db:studio      # Open Drizzle Studio
```

## 📖 Documentation

- [AUTH_SETUP.md](./AUTH_SETUP.md) - Authentication system setup
- [OBSERVABILITY.md](./OBSERVABILITY.md) - Monitoring and logging
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Migration guide

## 🔐 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token expiration
- API key validation
- Sensitive data redaction in logs
- CORS configuration
- Input validation
- SQL injection prevention (Drizzle ORM)
- XSS protection (class-validator)

## 🎨 Code Quality

- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Husky git hooks
- Commitlint
- Pre-commit validation

## 📦 Tech Stack

- **Framework:** NestJS 10
- **HTTP:** Hono 4
- **Database:** PostgreSQL + Drizzle ORM
- **Authentication:** JWT + bcrypt
- **Validation:** class-validator + class-transformer
- **Documentation:** Swagger/OpenAPI
- **Monitoring:** OpenTelemetry
- **Logging:** Pino
- **Cache:** Redis (optional)
- **Queue:** RabbitMQ (optional)
- **Package Manager:** Bun
