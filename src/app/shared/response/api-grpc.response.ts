/* eslint-disable @typescript-eslint/no-explicit-any */
import { status } from '@grpc/grpc-js';
import { ErrorCode } from '../enum';

export class GrpcApiResponse<T> {
  status: number;
  code: ErrorCode;
  message: string;
  data: unknown;

  constructor(init?: Partial<GrpcApiResponse<T>>) {
    Object.assign(this, init);
  }

  public static success<T>(data?: unknown): GrpcApiResponse<T> {
    return new GrpcApiResponse<T>({
      status: status.OK,
      code: ErrorCode.SUCCESS,
      message: 'Success',
      data: data,
    });
  }

  public static failed(status: number, code: ErrorCode, message: string): GrpcApiResponse<any> {
    return new GrpcApiResponse<any>({
      status: status,
      code: code,
      message: message,
      data: null,
    });
  }

  public static badRequest(code: ErrorCode, message: string): GrpcApiResponse<any> {
    return new GrpcApiResponse<any>({
      status: status.INVALID_ARGUMENT,
      code: code,
      message: message,
      data: null,
    });
  }

  public static internalError(code: ErrorCode, message: string): GrpcApiResponse<any> {
    return new GrpcApiResponse<any>({
      status: status.INTERNAL,
      code: code,
      message: message,
      data: null,
    });
  }

  public toString() {
    return JSON.stringify(this);
  }
}
