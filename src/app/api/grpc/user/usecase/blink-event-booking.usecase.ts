import { Inject, Injectable } from '@nestjs/common';
import { BlinkEventPortDto } from 'src/core/port/dto';
import { BookingService, BookingServiceName } from 'src/core/port/service';

@Injectable()
export default class BlinkEventBookingUseCase {
  constructor(@Inject(BookingServiceName) private bookingService: BookingService) {}

  public async execute(payload: BlinkEventPortDto): Promise<void> {
    await this.bookingService.process(payload);
    return;
  }
}
