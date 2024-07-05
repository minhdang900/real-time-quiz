import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class BlinkEventData {
  @Expose({ name: 'booking_no' })
  @IsNotEmpty()
  bookingNumber: string;

  constructor(init?: Partial<BlinkEventData>) {
    Object.assign(this, init);
  }
}
