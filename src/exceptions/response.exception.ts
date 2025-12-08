import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { randomUUID } from 'crypto';

@Catch()
export class ResponseExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const isValidStatus = (value?: number) =>
      typeof value === 'number' && value >= 200 && value <= 599;

    const statusFromException =
      exception instanceof HttpException ? exception.getStatus() : undefined;

    const status = isValidStatus(statusFromException)
      ? statusFromException
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const request = ctx.getRequest();
    const requestId = request?.headers?.['x-request-id'] || randomUUID();
    const platform = request?.headers?.['x-platform'] || 'unknown';
    const ip =
      request?.headers?.['x-forwarded-for'] ||
      request?.headers?.['x-real-ip'] ||
      request?.ip ||
      '';
    // Ensure content type aligns with JSON error body to avoid adapter warnings.
    httpAdapter.setHeader(
      ctx.getResponse(),
      'Content-Type',
      'application/json',
    );

    httpAdapter.reply(
      ctx.getResponse(),
      {
        success: false,
        message:
          exception instanceof HttpException
            ? exception.message
            : 'Internal server error',
        data: null,
        meta: {
          requestId,
          platform,
          ip,
        },
        errors:
          (exception as any)?.response?.message ||
          (exception as any)?.message ||
          exception,
      },
      status,
    );
  }
}
