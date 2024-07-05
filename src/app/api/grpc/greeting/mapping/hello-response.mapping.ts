import { GreetingPortDto } from 'src/core/port/dto';
import { GreetingData } from '../proto/greeting';

export function helloResponseFromDomain(res: GreetingPortDto): GreetingData {
  return GreetingData.create({ greeting: res.msg });
}
