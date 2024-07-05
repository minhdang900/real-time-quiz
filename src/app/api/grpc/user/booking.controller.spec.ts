import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { BookingController } from './booking.controller';
import EdhEventBookingUseCase from './usecase/edh-event-booking.usecase';
import BlinkEventBookingUseCase from './usecase/blink-event-booking.usecase';

describe(`${BookingController.name}`, () => {
  let controller: BookingController;
  let mockEdhEventBookingUseCase: DeepMocked<EdhEventBookingUseCase>;
  let mockBlinkEventBookingUseCase: DeepMocked<BlinkEventBookingUseCase>;

  beforeEach(async () => {
    mockEdhEventBookingUseCase = createMock<EdhEventBookingUseCase>();
    mockBlinkEventBookingUseCase = createMock<BlinkEventBookingUseCase>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        {
          provide: EdhEventBookingUseCase,
          useValue: mockEdhEventBookingUseCase,
        },
        {
          provide: BlinkEventBookingUseCase,
          useValue: mockBlinkEventBookingUseCase,
        },
      ],
    }).compile();

    controller = module.get<BookingController>(BookingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
