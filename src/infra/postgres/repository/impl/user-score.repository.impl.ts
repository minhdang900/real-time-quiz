import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DBConnections } from '../../enum/domain.enum';
import { UserScoreRepository } from 'src/core/port/repository';
import { UserScoreEntity } from '../../entity';

export class UserScoreRepositoryImpl implements UserScoreRepository {
  private readonly logger = new Logger(UserScoreRepositoryImpl.name);

  constructor(
    @InjectRepository(UserScoreEntity, DBConnections.INTERNAL)
    private repository: Repository<UserScoreEntity>,
  ) {}
}
