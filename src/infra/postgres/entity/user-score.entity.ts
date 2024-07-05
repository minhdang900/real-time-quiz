import { UserScore } from 'src/core/domain/entity';
import { BaseEntity } from './base.entity';
import { UserScorePortDto } from 'src/core/port/dto';

export class UserScoreEntity extends BaseEntity {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;

  constructor(init?: Partial<UserScoreEntity>) {
    super();
    Object.assign(this, init);
  }

  equals(entity: BaseEntity): boolean {
    if (!(entity instanceof UserScoreEntity)) return false;

    return this.id === entity.id;
  }

  public static toDomain(productEntity: UserScoreEntity): UserScore {
    return new UserScore({
      id: productEntity.id,
      name: productEntity.name,
      description: productEntity.description,
      imageUrl: productEntity.imageUrl,
      price: productEntity.price,
      createdAt: productEntity.createdAt,
      updatedAt: productEntity.updatedAt,
    });
  }

  public fromDomain(userScore: UserScorePortDto) {
    this.id = userScore.id;
    this.name = userScore.name;
  }
}
