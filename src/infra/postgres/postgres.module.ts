import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { optionsCdcDbFactory, optionsFactory, optionsOdsFactory } from './configs';
import { DataSourceLogger } from './datasource.logger';
import { DBConnections } from './enum/domain.enum';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: DBConnections.INTERNAL,
      useFactory: optionsFactory,
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: DBConnections.ODS,
      useFactory: optionsOdsFactory,
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: DBConnections.BOOKING_CDC,
      useFactory: optionsCdcDbFactory,
      inject: [ConfigService],
    }),
  ],
  providers: [DataSourceLogger],
})
export class PostgresModule {}
