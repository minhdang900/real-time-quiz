import { BookingService, BookingServiceName } from 'src/core/port/service';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import EdhEventBookingUseCase from './edh-event-booking.usecase';
import { EdhEventFilterPayload } from '../dto';
import { BookingEventTypeCode } from 'src/shared/enum/booking.enum';

const mockEdhEventFilterPayload = new EdhEventFilterPayload({
  code: BookingEventTypeCode.DCT_CHANGED,
  data: { bookingNumber: 'bookingNumber' },
});

describe(`${EdhEventBookingUseCase.name}`, () => {
  let useCase: EdhEventBookingUseCase;
  let bookingService: DeepMocked<BookingService>;

  beforeEach(async () => {
    bookingService = createMock<BookingService>();
    const moduleRef = await Test.createTestingModule({
      providers: [
        EdhEventBookingUseCase,
        {
          provide: BookingServiceName,
          useValue: bookingService,
        },
      ],
    }).compile();

    useCase = moduleRef.get<EdhEventBookingUseCase>(EdhEventBookingUseCase);
  });

  it('should send data to service', async () => {
    await useCase.execute(mockEdhEventFilterPayload);
    expect(bookingService.process).toHaveBeenCalledTimes(1);
  });
});
