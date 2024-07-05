import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { KafkaMessage } from 'kafkajs';
import { serializeRequest } from './serializers.utils';
import { isSilentRequestBody } from '../decorators/silent-request-body.decorators';
import { Reflector } from '@nestjs/core';

export function transformHttpRequest(reflector: Reflector, context: ExecutionContext, request: Request) {
  const isSilentBody = isSilentRequestBody(reflector, context);
  const serializedRequest = serializeRequest(request);

  if (isSilentBody && serializedRequest['body']) {
    serializedRequest['body'] = '(silent)';
  }

  return serializedRequest;
}

export function transformKafkaRequest(reflector: Reflector, context: ExecutionContext, message: KafkaMessage) {
  const isSilentBody = isSilentRequestBody(reflector, context);
  const serializedMessage = Object.assign({}, message);

  if (isSilentBody && serializedMessage.value) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    serializedMessage.value = '(silent)';
  }

  return serializedMessage;
}
