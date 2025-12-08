import { LoggerService } from '@/shared/services/logger.service';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { randomUUID } from 'crypto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly _logger: LoggerService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}
  contextName = 'CustomHttpError';
  catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const isValidStatus = (value?: number) =>
      typeof value === 'number' && value >= 200 && value <= 599;

    if (request) {
      const exceptionResponse = exception.getResponse();
      const rawStatus = exception.getStatus
        ? exception.getStatus()
        : undefined;
      const statusCode = isValidStatus(rawStatus)
        ? rawStatus
        : HttpStatus.INTERNAL_SERVER_ERROR;
      const requestId = request?.headers?.['x-request-id'] || randomUUID();
      const platform = request?.headers?.['x-platform'] || 'unknown';
      const ip =
        request?.headers?.['x-forwarded-for'] ||
        request?.headers?.['x-real-ip'] ||
        request?.ip ||
        '';

      const message =
        typeof exceptionResponse === 'object'
          ? (exceptionResponse as any).message || exception.message
          : exceptionResponse;

      const errorResponse = {
        success: false,
        message: message || 'Request failed',
        data:
          typeof exceptionResponse === 'object'
            ? (exceptionResponse as any).payload ?? null
            : null,
        meta: {
          requestId,
          platform,
          ip,
        },
        errors:
          (exceptionResponse as any)?.errors ||
          (exceptionResponse as any)?.message ||
          exception.message,
      };

      this._logger.formattedError(
        `${request.method} ${request.url} : ${exception.getResponse()}`,
        exception,
        {
          httpContext: ctx,
          errorResponse,
          contextName: this.contextName,
        },
      );

      httpAdapter.setHeader(response, 'Content-Type', 'application/json');
      return httpAdapter.reply(response, errorResponse, statusCode);
    } else {
      return exception;
    }
  }
}
