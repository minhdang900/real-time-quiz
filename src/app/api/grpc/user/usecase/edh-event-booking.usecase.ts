import { Inject, Injectable } from '@nestjs/common';
import { EdhEventPortDto } from 'src/core/port/dto';
import { BookingService, BookingServiceName } from 'src/core/port/service';

@Injectable()
export default class EdhEventBookingUseCase {
  constructor(@Inject(BookingServiceName) private bookingService: BookingService) {}

  public async execute(payload: EdhEventPortDto): Promise<void> {
    await this.bookingService.process(payload);
    return;
  }
}
