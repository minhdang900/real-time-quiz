import { Module } from '@nestjs/common';
import {
  UserScoreRepository
} from 'src/core/port/repository';
import { DBConnections } from '../enum/domain.enum';
import { PostgresModule } from '../postgres.module';
import { UserScoreSchema } from '../schema';
import { UserScoreRepositoryImpl } from './impl';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PostgresModule,
    TypeOrmModule.forFeature([UserScoreSchema], DBConnections.INTERNAL),
  ],
  providers: [
    {
      provide: UserScoreRepository,
      useClass: UserScoreRepositoryImpl,
    }
  ],
  exports: [
    TypeOrmModule,
    UserScoreSchema
  ],
})
export class RepositoryModule {}
