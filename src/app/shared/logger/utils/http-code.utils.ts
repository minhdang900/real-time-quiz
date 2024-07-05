import { HttpStatus } from '@nestjs/common';
import { BaseException, InternalException, ValidateException } from 'src/app/shared/exception';

export function getHttpCode(error: BaseException): HttpStatus {
  if (error instanceof ValidateException) {
    return HttpStatus.BAD_REQUEST;
  }

  if (error instanceof InternalException) {
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  return null;
}
