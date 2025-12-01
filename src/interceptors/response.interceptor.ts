import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from '@/interfaces/api-response.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const requestId = request.headers['x-request-id'] || randomUUID();
    const platform = request.headers['x-platform'] || 'unknown';
    const ip =
      request.headers['x-forwarded-for'] ||
      request.headers['x-real-ip'] ||
      request.ip ||
      '';

    return next.handle().pipe(
      map(data => {
        const response: ApiResponse<T> = {
          success: true,
          message: data?.message || 'Request successful',
          data: data?.data !== undefined ? data.data : data,
          meta: {
            requestId,
            platform,
            ip,
          },
        };

        // Add pagination if present
        if (data?.pagination) {
          response.meta.pagination = data.pagination;
        }

        return response;
      }),
      catchError(error => {
        const statusCode =
          error?.status || context.switchToHttp().getResponse().statusCode;
        const message = error?.message || 'Something went wrong';

        throw new HttpException(
          {
            success: false,
            message,
            data: null,
            meta: {
              requestId,
              platform,
              ip,
            },
            errors: error?.response?.message || error?.message || error,
          },
          statusCode,
          {
            cause: error,
          },
        );
      }),
    );
  }
}
