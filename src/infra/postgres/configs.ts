import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import DatabaseLogger from './util/database.logger';
import { DBConnections } from 'src/shared/enum';

const internalLogger = new Logger('PG-INTERNAL');
const odsLogger = new Logger('PG-ODS');
const bookingCdcLogger = new Logger('PG-BOOKING-CDC');

// For internal
export function optionsFactory(configService: ConfigService): TypeOrmModuleOptions {
  return {
    name: DBConnections.INTERNAL,
    type: 'postgres',
    host: configService.get('DATABASE_HOST'),
    port: configService.get('DATABASE_PORT'),
    username: configService.get('DATABASE_USER'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_NAME'),
    schema: configService.get('DATABASE_SCHEMA'),
    entities: [__dirname + '/schema/*{.ts,.js}'],
    synchronize: JSON.parse(process.env['DATABASE_SYNCHRONIZE']),
    autoLoadEntities: true,
    migrationsTableName: 'migrations',
    migrations: [__dirname + '/migration/*{.ts,.js}'],
    migrationsRun: true,
    verboseRetryLog: true,
    logger: new DatabaseLogger(),
    connectTimeoutMS: 10000,
    maxQueryExecutionTime: 20000,
    poolSize: configService.get('DATABASE_POOL_SIZE', 10, { infer: true }),
    extra: {
      idleTimeoutMillis: 60000,
      log: function (msg, err) {
        if (err) {
          internalLogger.error(msg + '.Detail: ' + err.message, err.stack);
        } else {
          internalLogger.verbose(msg);
        }
      },
    },
  };
}

// For cdcDb
export function optionsCdcDbFactory(configService: ConfigService): TypeOrmModuleOptions {
  return {
    name: DBConnections.BOOKING_CDC,
    type: 'postgres',
    host: configService.get('BOOKING_CDC_DATABASE_HOST'),
    port: configService.get('BOOKING_CDC_DATABASE_PORT'),
    username: configService.get('BOOKING_CDC_DATABASE_USER'),
    password: configService.get('BOOKING_CDC_DATABASE_PASSWORD'),
    database: configService.get('BOOKING_CDC_DATABASE_NAME'),
    schema: configService.get('BOOKING_CDC_DATABASE_SCHEMA'),
    entities: [__dirname + '/schema-cdc/*{.ts,.js}'],
    synchronize: JSON.parse(process.env['BOOKING_CDC_DATABASE_SYNCHRONIZE']),
    autoLoadEntities: true,
    verboseRetryLog: true,
    logger: new DatabaseLogger(),
    connectTimeoutMS: 10000,
    maxQueryExecutionTime: 20000,
    poolSize: configService.get('BOOKING_CDC_DATABASE_POOL_SIZE', 10, { infer: true }),
    extra: {
      idleTimeoutMillis: 60000,
      log: function (msg, err) {
        if (err) {
          bookingCdcLogger.error(msg + '.Detail: ' + err.message, err.stack);
        } else {
          bookingCdcLogger.verbose(msg);
        }
      },
    },
  };
}

// For ods
export function optionsOdsFactory(configService: ConfigService): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: configService.get('ODS_DATABASE_HOST'),
    port: configService.get('ODS_DATABASE_PORT'),
    username: configService.get('ODS_DATABASE_USER'),
    password: configService.get('ODS_DATABASE_PASSWORD'),
    database: configService.get('ODS_DATABASE_NAME'),
    schema: configService.get('ODS_DATABASE_SCHEMA'),
    entities: [__dirname + '/schema-ods/*{.ts,.js}'],
    synchronize: JSON.parse(process.env['DATABASE_SYNCHRONIZE']),
    autoLoadEntities: true,
    verboseRetryLog: true,
    logger: new DatabaseLogger(),
    connectTimeoutMS: 10000,
    maxQueryExecutionTime: 20000,
    poolSize: configService.get('ODS_DATABASE_POOL_SIZE', 10, { infer: true }),
    extra: {
      idleTimeoutMillis: 60000,
      log: function (msg, err) {
        if (err) {
          odsLogger.error(msg + '.Detail: ' + err.message, err.stack);
        } else {
          odsLogger.verbose(msg);
        }
      },
    },
  };
}

// Manual load config when run from the cli
if (!process.env['DATABASE_HOST'] && (!process.env['NODE_ENV'] || process.env['NODE_ENV'] === 'local' || process.env['NODE_ENV'] === 'test')) {
  // eslint-disable-next-line
  require('dotenv').config();
}

// For cli migration - internal db only
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env['DATABASE_HOST'],
  port: parseInt(process.env['DATABASE_PORT']),
  username: process.env['DATABASE_USER'],
  password: process.env['DATABASE_PASSWORD'],
  database: process.env['DATABASE_NAME'],
  schema: process.env['DATABASE_SCHEMA'],
  entities: [__dirname + '/schema/*.ts'],
  synchronize: JSON.parse(process.env['DATABASE_SYNCHRONIZE']),
  logger: new DatabaseLogger(),
  migrationsRun: false,
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/migration/*{.ts,.js}'],
});
