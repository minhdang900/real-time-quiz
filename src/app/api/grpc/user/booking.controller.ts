import { Controller, Inject, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { ErrorCode } from 'src/app/shared/enum';
import { ValidateException } from 'src/app/shared/exception';
import { KafkaTopics } from 'src/shared/config';
import { keepAlive, dead } from 'src/shared/utils/heartbeat.utils';
import { ApiTags } from '@nestjs/swagger';
import { SilentResponseLog } from 'src/app/shared/logger/decorators/silent-response-log.decorators';
import { BlinkEventPayload, EdhEventFilterPayload } from './dto';
import EdhEventBookingUseCase from './usecase/edh-event-booking.usecase';
import BlinkEventBookingUseCase from './usecase/blink-event-booking.usecase';

@Controller('booking-event')
@ApiTags('booking-event')
export class BookingController {
  private logger = new Logger(BookingController.name);

  constructor(
    @Inject(EdhEventBookingUseCase)
    private readonly edhEventBookingUseCase: EdhEventBookingUseCase,
    @Inject(BlinkEventBookingUseCase)
    private readonly blinkEventBookingUseCase: BlinkEventBookingUseCase,
  ) {}

  @SilentResponseLog()
  @EventPattern(KafkaTopics.EDH_EVENT_TOPIC_INTERNAL)
  @UsePipes(new ValidationPipe({ transform: true }))
  async consumerEdhEvent(@Payload() payload: EdhEventFilterPayload, @Ctx() context: KafkaContext): Promise<void> {
    const heart = keepAlive(context, 3000);
    try {
      if (!payload) {
        throw new ValidateException(ErrorCode.PAYLOAD_IS_NULL, 'Payload is null');
      }

      await this.edhEventBookingUseCase.execute(EdhEventFilterPayload.toDomainDto(payload));
    } catch (error) {
      if (error instanceof ValidateException) {
        this.logger.warn({
          error: error,
          message: 'Processing edh-event failed by validation',
        });
      } else {
        this.logger.error({
          error: error,
          message: 'Processing edh-event failed',
        });
      }
    } finally {
      dead(heart);
    }
  }

  @SilentResponseLog()
  @EventPattern(KafkaTopics.ONE_OM_BLINK_EVENT_PRIVATE)
  @UsePipes(new ValidationPipe({ transform: true }))
  async consumerCDCBookingEvent(@Payload() payload: BlinkEventPayload, @Ctx() context: KafkaContext): Promise<void> {
    const heart = keepAlive(context, 3000);
    try {
      if (!payload) {
        throw new ValidateException(ErrorCode.PAYLOAD_IS_NULL, 'Payload is null');
      }

      await this.blinkEventBookingUseCase.execute(BlinkEventPayload.toDomainDto(payload));
    } catch (error) {
      if (error instanceof ValidateException) {
        this.logger.warn({
          error: error,
          message: 'Processing blink-event failed by validation',
        });
      } else {
        this.logger.error({
          error: error,
          message: 'Processing blink-event failed',
        });
      }
    } finally {
      dead(heart);
    }
  }
}
