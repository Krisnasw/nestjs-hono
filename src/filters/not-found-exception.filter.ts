import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { randomUUID } from 'crypto';

import { LoggerService } from '../shared/services/logger.service';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly _logger: LoggerService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  catch(_exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const message = 'Not Found';
    let code = HttpStatus.INTERNAL_SERVER_ERROR;
    const isValidStatus = (value?: number) =>
      typeof value === 'number' && value >= 200 && value <= 599;
    let detail = (_exception as any).message.message;

    if (request) {
      const requestId = request?.headers?.['x-request-id'] || randomUUID();
      const platform = request?.headers?.['x-platform'] || 'unknown';
      const ip =
        request?.headers?.['x-forwarded-for'] ||
        request?.headers?.['x-real-ip'] ||
        request?.ip ||
        '';

      switch (_exception.constructor) {
        case NotFoundException:
          code = HttpStatus.NOT_FOUND;
          detail = (_exception as NotFoundException).message;
          break;
        default:
          code = HttpStatus.INTERNAL_SERVER_ERROR;
      }

      if (!isValidStatus(code)) {
        code = HttpStatus.INTERNAL_SERVER_ERROR;
      }

      const errorResponse = {
        success: false,
        message: detail || message,
        data: null,
        meta: {
          requestId,
          platform,
          ip,
        },
        errors: detail || message,
      };

      httpAdapter.setHeader(response, 'Content-Type', 'application/json');
      return httpAdapter.reply(response, errorResponse, code);
    } else {
      return _exception;
    }
  }
}
