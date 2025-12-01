# Observability & Documentation

## Features Implemented

### 1. OpenTelemetry (OTEL) Integration

OpenTelemetry provides distributed tracing for monitoring and debugging your application.

**Configuration (.env):**
```env
OTEL_ENABLED=true
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces
```

**Features:**
- Automatic instrumentation for HTTP, database, and other operations
- Distributed tracing across services
- Performance monitoring
- Error tracking

**Setup with Jaeger (for local development):**
```bash
# Run Jaeger all-in-one
docker run -d --name jaeger \
  -e COLLECTOR_OTLP_ENABLED=true \
  -p 16686:16686 \
  -p 4318:4318 \
  jaegertracing/all-in-one:latest

# Access Jaeger UI at http://localhost:16686
```

### 2. Logging Interceptor

Comprehensive request/response logging with sensitive data redaction.

**Features:**
- Request logging (method, URL, IP, user-agent)
- Response logging (status code, duration)
- Error logging with stack traces
- Automatic redaction of sensitive fields (password, token, secret, apiKey, accessToken)
- Request ID tracking for correlation

**Log Format:**
```json
{
  "type": "request",
  "requestId": "uuid",
  "method": "POST",
  "url": "/api/auth/login",
  "ip": "127.0.0.1",
  "userAgent": "Mozilla/5.0...",
  "body": { "email": "user@example.com", "password": "***REDACTED***" }
}
```

### 3. Hono Swagger UI

Interactive API documentation using Hono's Swagger UI.

**Endpoints:**
- `/swagger` - Interactive Swagger UI
- `/swagger/spec.json` - OpenAPI specification JSON

**Generate Swagger Spec:**
```bash
bun run swagger:generate
```

**Features:**
- Interactive API testing
- Request/response examples
- Authentication support (Bearer JWT & API Key)
- Auto-generated from NestJS decorators

**Swagger Decorators:**
```typescript
import { ApiTags, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @Post('login')
  @ApiBearerAuth()
  async login(@Body() dto: LoginDto) {
    // ...
  }
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password: string;
}
```

## Usage

### Development Mode

```bash
# Start server with logging and Swagger UI
bun run start:dev

# Access:
# - API: http://localhost:8080/api
# - Swagger UI: http://localhost:8080/swagger
# - Swagger JSON: http://localhost:8080/swagger/spec.json
```

### Production Mode

```bash
# Enable OTEL for production monitoring
OTEL_ENABLED=true bun run start:prod
```

## Monitoring Stack Recommendations

### Local Development
- **Jaeger** - Distributed tracing UI
- **Logs** - Console output with pino-pretty

### Production
- **Jaeger/Tempo** - Distributed tracing
- **Grafana** - Visualization
- **Loki** - Log aggregation
- **Prometheus** - Metrics collection

## Best Practices

1. **Always use request IDs** for correlation across logs and traces
2. **Redact sensitive data** in logs (already implemented)
3. **Monitor error rates** and response times
4. **Set up alerts** for critical errors
5. **Use structured logging** for better searchability
6. **Keep Swagger docs updated** by regenerating after API changes

## Environment Variables

```env
# OpenTelemetry
OTEL_ENABLED=false                                    # Enable/disable OTEL
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces  # OTLP endpoint

# Application
NODE_ENV=development                                  # Environment
PORT=8080                                            # Server port
APP_NAME=NEST_BOILERPLATE                            # Service name for OTEL
```

## Troubleshooting

### Swagger UI not showing
1. Ensure you're in development/staging mode
2. Run `bun run swagger:generate` to create spec file
3. Check `/swagger/spec.json` is accessible

### OTEL not working
1. Verify `OTEL_ENABLED=true` in .env
2. Check OTLP endpoint is accessible
3. Ensure Jaeger/collector is running
4. Check logs for OTEL initialization message

### Logs not appearing
1. Check `NODE_ENV` is set correctly
2. Verify LoggingInterceptor is registered in main.ts
3. Check console output or log files
