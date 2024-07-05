import { Logger } from '@nestjs/common';
import { GreetingPortDto, SayGreetingPortDto } from 'src/core/port/dto';
import { GreetingService } from 'src/core/port/service';

export class GreetingServiceImpl implements GreetingService {
  private readonly logger = new Logger(GreetingServiceImpl.name);

  async greeting(sayGreetingPortDto: SayGreetingPortDto): Promise<GreetingPortDto> {
    return new GreetingPortDto({ msg: `Hello world, ${sayGreetingPortDto.name}` });
  }
}
