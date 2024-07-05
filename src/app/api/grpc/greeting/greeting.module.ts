import { Module } from '@nestjs/common';
import { GreetingController } from './controller/greeting.controller';
import GreetingUseCase from './usecase/greeting.usecase';
import { GreetingService, GreetingServiceName } from 'src/core/port/service';
import { GreetingServiceImpl } from 'src/core/service/impl/greeting.service.impl';

const providers = [
  {
    provide: GreetingServiceName,
    useFactory: (): GreetingService => {
      return new GreetingServiceImpl();
    },
    inject: [],
  },
];

@Module({
  imports: [],
  controllers: [GreetingController],
  providers: [GreetingUseCase, ...providers],
})
export class GreetingModule {}
