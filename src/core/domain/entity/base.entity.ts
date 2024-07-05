export abstract class BaseEntity {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;

  constructor(init?: Partial<BaseEntity>) {
    Object.assign(this, init);
  }

  protected abstract equals(entity: BaseEntity): boolean;
}
