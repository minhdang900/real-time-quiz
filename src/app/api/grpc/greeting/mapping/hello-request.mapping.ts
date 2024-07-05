import { SayGreetingPortDto } from 'src/core/port/dto';
import { HelloRequest } from '../proto/greeting';

export function helloRequestToDomain(req: HelloRequest): SayGreetingPortDto {
  return new SayGreetingPortDto({ name: req.name });
}
