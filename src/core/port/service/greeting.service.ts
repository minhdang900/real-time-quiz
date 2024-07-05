import { GreetingPortDto, SayGreetingPortDto } from '../dto';

export const GreetingServiceName = 'GreetingService.Interface';

export interface GreetingService {
  greeting(sayGreetingPortDto: SayGreetingPortDto): Promise<GreetingPortDto>;
}
