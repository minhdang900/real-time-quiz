import { Injectable, Inject } from '@nestjs/common';
import { SayGreetingPortDto } from 'src/core/port/dto';
import { GreetingService, GreetingServiceName } from 'src/core/port/service/greeting.service';
import { GreetingData } from '../proto/greeting';
import { helloResponseFromDomain } from '../mapping';

@Injectable()
export default class GreetingUseCase {
  constructor(@Inject(GreetingServiceName) private greetingService: GreetingService) {}

  public async execute(input: SayGreetingPortDto): Promise<GreetingData> {
    const res = await this.greetingService.greeting(input);
    return helloResponseFromDomain(res);
  }
}
