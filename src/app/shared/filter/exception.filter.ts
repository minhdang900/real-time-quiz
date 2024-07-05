/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArgumentsHost, BadRequestException, Catch, HttpStatus, Logger, RpcExceptionFilter } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { ValidateException, InternalException } from '../exception';
import { status } from '@grpc/grpc-js';
import { ConfigService } from '@nestjs/config';
import { Environment } from 'src/shared/enum';
import { MetadataEx } from '../util/grpc-metadata.util';
import { ErrorCode } from '../enum';
import { KafkaContext } from '@nestjs/microservices';

@Catch()
export class DefaultExceptionFilter<T = unknown> implements RpcExceptionFilter<T> {
  private readonly logger = new Logger(DefaultExceptionFilter.name);

  constructor(private config: ConfigService) {}

  catch(exception: T, host: ArgumentsHost): Observable<unknown> {
    const protocolType = host.getType();

    const kafkaContext = host.switchToRpc().getContext<KafkaContext>();
    if (exception instanceof BadRequestException && protocolType === 'rpc' && kafkaContext instanceof KafkaContext) {
      this.logger.error({
        error: 'Consume Kafka message failed by validation pipeline. Skipped it.',
        message: kafkaContext.getMessage(),
      });

      return of(
        kafkaContext.getConsumer().commitOffsets([
          {
            topic: kafkaContext.getTopic(),
            partition: kafkaContext.getPartition(),
            offset: kafkaContext.getMessage().offset,
          },
        ]),
      );
    }

    if (exception instanceof InternalException) {
      if (protocolType === 'http') {
        return this.httpThrowException(host, exception.code, HttpStatus.INTERNAL_SERVER_ERROR, exception);
      }
      return this.grpcThrowException(exception.code, status.INTERNAL, exception);
    }

    if (exception instanceof ValidateException) {
      if (protocolType === 'http') {
        return this.httpThrowException(host, exception.code, HttpStatus.BAD_REQUEST, exception);
      }
      return this.grpcThrowException(exception.code, status.INVALID_ARGUMENT, exception);
    }

    const unknownException = exception as Error;
    if (protocolType === 'http') {
      return this.httpThrowException(host, ErrorCode.UNKNOWN, HttpStatus.INTERNAL_SERVER_ERROR, unknownException);
    }

    return this.grpcThrowException(ErrorCode.UNKNOWN, status.UNKNOWN, unknownException);
  }

  httpThrowException(host: ArgumentsHost, errorCode: number, httpStatus: number, exception: Error): Observable<any> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(httpStatus).send({
      code: errorCode,
      message: exception.message,
      stack: !(Object.values([Environment.Staging, Environment.Production]) as string[]).includes(this.config.get('NODE_ENV') as string)
        ? exception.stack
        : undefined,
    });

    return;
  }

  grpcThrowException(errorCode: number, grpcStatus: number, exception: Error): Observable<any> {
    const metadata = new MetadataEx();
    metadata.add('error-code', errorCode.toString());

    return throwError(() => ({ code: grpcStatus, message: exception.message, metadata: metadata }));
  }
}
