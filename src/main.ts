import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SharedModule } from './shared/shared.module';
import { SettingService } from './shared/services/setting.service';
import {
  ClassSerializerInterceptor,
  NestInterceptor,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { HonoAdapter } from '@kiyasov/platform-hono';
import { initializeOtel } from './shared/telemetry/otel';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { setupHonoSwagger } from './shared/swagger/hono-swagger.setup';
import { ResponseExceptionFilter } from './exceptions/response.exception';

// Initialize OpenTelemetry before anything else
initializeOtel();

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const adapter = new HonoAdapter();
  const app = await NestFactory.create(AppModule, adapter as any, {
    bufferLogs: true,
  });

  const settingService = app.select(SharedModule).get(SettingService);
  const httpAdapterHost = app.get(HttpAdapterHost);

  // Global interceptors
  const globalInterceptors: NestInterceptor[] = [
    new LoggingInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  ];

  // Enable CORS using Hono's CORS middleware
  adapter.enableCors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['*'],
  });

  app.useGlobalInterceptors(...globalInterceptors);
  app.useGlobalFilters(new ResponseExceptionFilter(httpAdapterHost));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validationError: {
        target: false,
      },
    }),
  );

  // Setup Hono Swagger UI
  if (['development', 'staging'].includes(settingService.nodeEnv)) {
    setupHonoSwagger(adapter);
  }

  app.setGlobalPrefix('api');

  const port = settingService.getNumber('PORT') || 4000;
  const host = settingService.get('HOST') || '0.0.0.0';
  await app.listen(port, host);

  logger.log(`🚀 Server running on http://${host}:${port}`);
  logger.log(`📚 Swagger UI available at http://${host}:${port}/swagger`);
  logger.log(`📊 API Docs at http://${host}:${port}/swagger/spec.json`);
}

bootstrap();
