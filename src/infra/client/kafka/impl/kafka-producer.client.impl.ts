import { firstValueFrom } from 'rxjs';
import { Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaEmitEvent } from '../dto/kafka-emit-event.dto';
import { KAFKA_CLIENT } from 'src/shared/config';
import { MessageBrokerProducer } from 'src/core/port/client/message-broker-producer.client';
import { plainToInstance } from 'class-transformer';

export class MessageBrokerProducerImpl implements MessageBrokerProducer {
  constructor(
    @Inject(KAFKA_CLIENT)
    private readonly client: ClientKafka,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async emitData(data: any) {
    try {
      const processedData = plainToInstance(KafkaEmitEvent, data);

      await firstValueFrom(
        this.client.emit(processedData.topic, {
          key: processedData.key,
          value: JSON.stringify(processedData.value),
        }),
      );
    } catch (ex) {
      const error = ex as Error;
      Logger.error(`Process event error , Message: ${error.message} `, error.stack);
    }
  }
}
