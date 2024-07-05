import { Controller, Inject, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcApiResponse } from 'src/app/shared/response';
import { SayGreetingPortDto } from 'src/core/port/dto';
import GreetingUseCase from '../usecase/greeting.usecase';
import { helloRequestToDomain } from '../mapping/hello-request.mapping';
import { HelloRequest, HelloResponse } from '../proto/greeting';

@Controller()
export class GreetingController {
  private logger = new Logger(GreetingController.name);

  constructor(
    @Inject(GreetingUseCase)
    private readonly greetingUseCase: GreetingUseCase,
  ) {}

  @GrpcMethod('BlinkGreetingService', 'hello')
  async hello(req: HelloRequest): Promise<GrpcApiResponse<HelloResponse>> {
    const input: SayGreetingPortDto = helloRequestToDomain(req);
    const greetingData = await this.greetingUseCase.execute(input);
    return GrpcApiResponse.success(greetingData);
  }
}
