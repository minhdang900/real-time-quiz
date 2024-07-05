/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutionContext } from '@nestjs/common';
import { isSilentResponseBody } from '../decorators/silent-response-body.decorators';
import { Reflector } from '@nestjs/core';

export function transformHttpResponseBody(reflector: Reflector, context: ExecutionContext, body: any) {
  const isSilentBody = isSilentResponseBody(reflector, context);
  if (!isSilentBody) {
    return body;
  }

  return '(silent)';
}

export function transformKafkaResponseBody(reflector: Reflector, context: ExecutionContext, body: any) {
  const isSilentBody = isSilentResponseBody(reflector, context);
  if (!isSilentBody) {
    return body;
  }

  return '(silent)';
}
