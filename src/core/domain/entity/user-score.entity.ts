import { BaseEntity } from './base.entity';

export class UserScore extends BaseEntity {
  id: string;
  

  constructor(init?: Partial<UserScore>) {
    super();
    Object.assign(this, init);
  }

  equals(entity: UserScore): boolean {
    if (!(entity instanceof UserScore)) return false;

    return this.id === entity.id;
  }
}
