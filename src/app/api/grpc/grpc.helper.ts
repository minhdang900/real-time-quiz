import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { protobufPackage } from './doc-queue/proto/doc-queue';

export function getSiQueueGrpcOption(configService: ConfigService): ClientOptions {
  return {
    transport: Transport.GRPC,
    options: {
      package: protobufPackage,
      protoPath: [
        join(__dirname, './greeting/proto/greeting.proto'),
        join(__dirname, './doc-queue/proto/doc-queue.proto'),
        join(__dirname, './doc-queue-detail/proto/doc-queue-detail.proto'),
        join(__dirname, './time-left-calculation/proto/time-left-calculation.proto'),
        join(__dirname, './booking-queue-info/proto/booking-queue-info.proto'),
        join(__dirname, './queue-irqd/proto/doc-queue-irqd.proto'),
        join(__dirname, './doc-queue-history/proto/doc-queue-history.proto'),
        join(__dirname, './doc-queue/proto/doc-queue-email-si.proto'),
      ],
      url: configService.get('GRPC_URL'),
      maxSendMessageLength: 1024 * 1024 * configService.get('MAX_SEND_SIZE_IN_MB'),
      maxReceiveMessageLength: 1024 * 1024 * configService.get('MAX_RECEIVE_SIZE_IN_MB'),
      loader: {
        defaults: true,
      },
    },
  };
}
