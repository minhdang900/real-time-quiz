import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HealthCheckService } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { MockLoggerService } from 'src/app/shared/logger/services/mock-logger.service';

describe('HealthController', () => {
  let controller: HealthController;
  let mockHealthService: DeepMocked<HealthCheckService>;

  beforeEach(async () => {
    mockHealthService = createMock<HealthCheckService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: HealthCheckService,
          useValue: mockHealthService,
        },
      ],
      controllers: [HealthController],
    })
      .setLogger(new MockLoggerService())
      .compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
