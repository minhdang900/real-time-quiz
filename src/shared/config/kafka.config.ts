import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '.';
import { ClientProvider, Transport } from '@nestjs/microservices';
import { CompressionTypes, logLevel } from 'kafkajs';

export const KafkaTopics = {
  SI_RECEIVE_TOPIC_INTERNAL: `one-om-${process.env['CDC_ENV']}-filter-service-bkgrequest-inserted-private`,
  CALCULATE_DEADLINE_TOPIC_INTERNAL: `one-om-${process.env['CDC_ENV']}-blink-queue-backgroundtask-trigger_private`,
  EDH_EVENT_TOPIC_INTERNAL: `one-om-blink-${process.env['CDC_ENV']}-event-edh-filter-service-private`,
  ONE_OM_BLINK_EVENT_PRIVATE: `one-om-blink-${process.env['CDC_ENV']}-event_private`,
};

export const KAFKA_CLIENT = 'KAFKA_DEFAULT_CLIENT';

export function getKafkaConfigs(configService: ConfigService<EnvironmentVariables>): ClientProvider {
  const sasl =
    configService.get('KAFKA_DEFAULT_MECHANISM') === 'NONE'
      ? null
      : {
          mechanism: configService.get('KAFKA_DEFAULT_MECHANISM'),
          username: configService.get('KAFKA_DEFAULT_USERNAME'),
          password: configService.get('KAFKA_DEFAULT_PASSWORD'),
        };

  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: configService.get('KAFKA_DEFAULT_CLIENT_ID'),
        brokers: [configService.get('KAFKA_DEFAULT_BROKER_URL')],
        ssl: configService.get('KAFKA_DEFAULT_SSL', false, { infer: true }),
        sasl: sasl,
        requestTimeout: configService.get('KAFKA_DEFAULT_REQUEST_TIMEOUT', 30000, { infer: true }),
        enforceRequestTimeout: true,
        logLevel: getLogLevel(configService),
      },
      consumer: {
        groupId: configService.get('KAFKA_DEFAULT_GROUP_ID'),
        allowAutoTopicCreation: configService.get('KAFKA_DEFAULT_AUTO_CREATE_TOPIC', true, { infer: true }),
      },
      send: {
        timeout: configService.get('KAFKA_DEFAULT_REQUEST_TIMEOUT', 30000, {
          infer: true,
        }),
        compression: CompressionTypes.GZIP,
      },
      run: {
        partitionsConsumedConcurrently: configService.get('KAFKA_DEFAULT_CONCURRENTLY', 1, { infer: true }),
      },
    },
  };
}

export function configKafkaEventFactory(configService: ConfigService<EnvironmentVariables>): ClientProvider {
  return {
    ...getKafkaConfigs(configService),
  } as ClientProvider;
}

function getLogLevel(configService: ConfigService<EnvironmentVariables>) {
  if (configService.get('KAFKA_LOG_LEVEL', { infer: true })) {
    return configService.get('KAFKA_LOG_LEVEL', { infer: true });
  }

  if (configService.get('NODE_ENV') === 'production' || configService.get('NODE_ENV') === 'staging') {
    return logLevel.INFO;
  }

  return logLevel.INFO;
}
