import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { BlinkEventPortDto } from 'src/core/port/dto';
import { BlinkEventData } from './blink-event-data.dto';

export class BlinkEventPayload {
  @Expose({ name: 'code' })
  @IsNotEmpty()
  code: string;

  @Expose({ name: 'data' })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BlinkEventData)
  data: BlinkEventData;

  constructor(init?: Partial<BlinkEventPayload>) {
    Object.assign(this, init);
  }

  public static toDomainDto(blinkEventPayload: BlinkEventPayload): BlinkEventPortDto {
    if (!blinkEventPayload) return null;

    const blinkEventPortDto = new BlinkEventPortDto({
      code: blinkEventPayload.code,
    });

    if (blinkEventPayload?.data) {
      blinkEventPortDto.data = new BlinkEventData({ bookingNumber: blinkEventPayload.data?.bookingNumber });
    }

    return blinkEventPortDto;
  }
}
