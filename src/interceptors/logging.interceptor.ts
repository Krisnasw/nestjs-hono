import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { randomUUID } from 'crypto';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, headers, body, ip } = request;

    const requestId = headers['x-request-id'] || randomUUID();
    const userAgent = headers['user-agent'] || 'unknown';
    const startTime = Date.now();

    // Log incoming request
    this.logger.log({
      type: 'request',
      requestId,
      method,
      url,
      ip,
      userAgent,
      body: this.sanitizeBody(body),
    });

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCode = response.statusCode;

        this.logger.log({
          type: 'response',
          requestId,
          method,
          url,
          statusCode,
          duration: `${duration}ms`,
          success: true,
        });
      }),
      catchError(error => {
        const duration = Date.now() - startTime;
        const statusCode = error?.status || 500;

        this.logger.error({
          type: 'error',
          requestId,
          method,
          url,
          statusCode,
          duration: `${duration}ms`,
          error: error?.message || 'Unknown error',
          stack: error?.stack,
        });

        throw error;
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return undefined;

    const sanitized = { ...body };
    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'apiKey',
      'accessToken',
    ];

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    }

    return sanitized;
  }
}
