import { EmitEvent } from 'src/core/port/client/dto/emit-event.dto';

export class KafkaEmitEvent extends EmitEvent {
  constructor(init?: Partial<KafkaEmitEvent>) {
    super();
    Object.assign(this, init);
  }
}
