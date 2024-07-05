/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { MessageBrokerProducerImpl } from './kafka/impl/kafka-producer.client.impl';
import { ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { MessageBrokerProducerName } from 'src/core/port/client/message-broker-producer.client';
import { KAFKA_CLIENT, configKafkaEventFactory } from 'src/shared/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: KAFKA_CLIENT,
        useFactory: configKafkaEventFactory,
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    UserGrpcClientProvider,
    {
      provide: MessageBrokerProducerName,
      useClass: MessageBrokerProducerImpl,
    },
  ],
  exports: [
    MessageBrokerProducerName,
    ClientsModule,
  ],
})
export class InfraClientModule {}
