import { Module } from '@nestjs/common';
import { PostgresModule } from 'src/infra/postgres/postgres.module';
import { RepositoryModule } from 'src/infra/postgres/repository/repository.module';
import { BookingController } from './booking.controller';
import EdhEventBookingUseCase from './usecase/edh-event-booking.usecase';
import { BookingService, BookingServiceName } from 'src/core/port/service';
import { BookingServiceImpl } from 'src/core/service/impl';
import { MessageBrokerProducer, MessageBrokerProducerName } from 'src/core/port/client';
import { DocQueueRepository, DocQueueRepositoryName } from 'src/core/port/repository';
import { InfraClientModule } from 'src/infra/client/infra-client.module';
import BlinkEventBookingUseCase from './usecase/blink-event-booking.usecase';

const providers = [
  {
    provide: BookingServiceName,
    useFactory: (kafkaProducer: MessageBrokerProducer, docQueueRepository: DocQueueRepository): BookingService => {
      return new BookingServiceImpl(kafkaProducer, docQueueRepository);
    },
    inject: [MessageBrokerProducerName, DocQueueRepositoryName],
  },
];

@Module({
  imports: [RepositoryModule, PostgresModule, InfraClientModule],
  controllers: [BookingController],
  providers: [EdhEventBookingUseCase, BlinkEventBookingUseCase, ...providers],
})
export class BookingModule {}
