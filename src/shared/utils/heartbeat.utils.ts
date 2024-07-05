import { KafkaContext } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

const logger = new Logger('Kafka] [Heartbeat]');

export class KeepAliveModel {
  context: KafkaContext;
  handler: NodeJS.Timeout;

  constructor(init?: Partial<KeepAliveModel>) {
    Object.assign(this, init);
  }
}

export function keepAlive(context: KafkaContext, interval: number): KeepAliveModel {
  const heartbeat = getSafeHeartbeat(context);
  const timer = setInterval(() => {
    logger.log('Heart beating...');
    heartbeat();
  }, interval);

  return new KeepAliveModel({
    context: context,
    handler: timer,
  });
}

export function dead(model: KeepAliveModel) {
  clearInterval(model.handler);
}

export function getSafeHeartbeat(context: KafkaContext): () => Promise<void> {
  return async () => {
    try {
      await context.getHeartbeat()();
    } catch (error) {
      logger.warn({
        message: 'Failed to call heartbeat',
        error: error,
      });
    }
  };
}
