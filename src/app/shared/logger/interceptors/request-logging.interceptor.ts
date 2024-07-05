/* eslint-disable  @typescript-eslint/no-explicit-any */
import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { serializeResponse } from '../utils/serializers.utils';
import { getHttpCode } from '../utils/http-code.utils';
import { transformHttpRequest } from '../utils/request.transformer';
import { transformHttpResponseBody } from '../utils/response.transformer';
import { Reflector } from '@nestjs/core';
import { isSilentRequestLog } from '../decorators/silent-request-log.decorators';
import { isSilentResponseLog } from '../decorators/silent-response-log.decorators';
import { BaseException } from 'src/app/shared/exception';
import { status } from '@grpc/grpc-js';
import { ClsService } from 'nestjs-cls';
import { HttpApiResponse } from '../../response';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger: Logger = new Logger(RequestLoggingInterceptor.name);

  constructor(
    private readonly cls: ClsService,
    private readonly reflector: Reflector,
  ) {}

  public intercept(context: ExecutionContext, call$: CallHandler): Observable<unknown> {
    const requestType = context.getType();
    if (requestType === 'http') {
      if (!isSilentRequestLog(this.reflector, context)) {
        this.logRequest(context, requestType);
      }

      return call$.handle().pipe(
        tap({
          next: (val: unknown): void => {
            if (!isSilentResponseLog(this.reflector, context)) {
              this.logResponse(val, context, requestType);
            }
          },
          error: (err: Error): void => {
            this.logError(err, context, requestType);
          },
        }),
      );
    }

    if (this.cls.get('requestType') !== 'KAFKA' && requestType === 'rpc') {
      if (!isSilentRequestLog(this.reflector, context)) {
        this.logGrpcRequest(context, requestType);
      }

      return call$.handle().pipe(
        tap({
          next: (val: unknown): void => {
            if (!isSilentResponseLog(this.reflector, context)) {
              this.logGrpcResponse(val, context, requestType);
            }
          },
          error: (err: Error): void => {
            this.logGrpcError(err, context, requestType);
          },
        }),
      );
    }

    return call$.handle();
  }

  private logGrpcRequest(context: ExecutionContext, protocol: string): void {
    const request = context.switchToRpc().getData();
    this.logger.log({
      message: `[${protocol}] Incoming request - ${context.getClass().name} - ${context.getHandler().name}`,
      request: request,
    });
  }

  private logGrpcResponse(body: any, context: ExecutionContext, protocol: string): void {
    const errorCode: number = body.code;
    const responseStatus: number = body.status;
    if (responseStatus !== status.OK) {
      this.logger.error({
        message: `[${protocol}] Outgoing response - ${responseStatus} - ${context.getClass().name} - ${context.getHandler().name}`,
        body: body.data,
        errorCode: errorCode,
      });
    } else {
      this.logger.log({
        message: `[${protocol}] Outgoing response - ${responseStatus} - ${context.getClass().name} - ${context.getHandler().name}`,
        body: body.data,
        errorCode: errorCode,
      });
    }
  }

  private logGrpcError(error: Error, context: ExecutionContext, protocol: string): void {
    this.logger.error({
      message: `[${protocol}] Outgoing response - Error - ${context.getClass().name} - ${context.getHandler().name}`,
      error: error,
    });
  }

  private logRequest(context: ExecutionContext, protocol: string): void {
    const request = context.switchToHttp().getRequest<Request>();
    this.logger.log({
      message: `[${protocol}] Incoming request - ${request.method} - ${request.url}`,
      request: transformHttpRequest(this.reflector, context, request),
    });
  }

  private logResponse(body: any, context: ExecutionContext, protocol: string): void {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const response: Response = context.switchToHttp().getResponse<Response>();
    const meta = {
      response: serializeResponse(response),
      body: transformHttpResponseBody(this.reflector, context, body),
    };

    if (response.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error({
        message: `[${protocol}] Outgoing response - ${response.statusCode} - ${request.method} - ${request.url}`,
        ...meta,
      });
    } else if (response.statusCode >= HttpStatus.BAD_REQUEST) {
      this.logger.warn({
        message: `[${protocol}] Outgoing response - ${response.statusCode} - ${request.method} - ${request.url}`,
        ...meta,
      });
    } else {
      this.logger.log({
        message: `[${protocol}] Outgoing response - ${response.statusCode} - ${request.method} - ${request.url}`,
        ...meta,
      });
    }
  }

  private logError(error: Error, context: ExecutionContext, protocol: string): void {
    const request: Request = context.switchToHttp().getRequest<Request>();

    if (error instanceof HttpException) {
      const statusCode: number = error.getStatus();
      if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
        this.logger.error(
          {
            message: `[${protocol}] Outgoing response - ${statusCode} - ${request.method} - ${request.url}`,
            error: error,
          },
          null,
        );
      } else {
        this.logger.warn({
          message: `[${protocol}] Outgoing response - ${statusCode} - ${request.method} - ${request.url}`,
          error: error,
        });
      }
    } else if (error instanceof BaseException) {
      this.logger.error({
        message: `[${protocol}] Outgoing response - ${getHttpCode(error)} - ${request.method} - ${request.url}`,
        error: error,
        response: new HttpApiResponse({
          code: error.code,
          message: error.message,
        }),
      });
    } else {
      this.logger.error({
        message: `[${protocol}] Outgoing response - ERROR - ${request.method} - ${request.url}`,
        error: error,
      });
    }
  }
}
