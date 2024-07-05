/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Logger, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DBConnections, Environment } from './enum/domain.enum';

@Injectable()
export class DataSourceLogger implements OnModuleInit, OnApplicationShutdown {
  private internalTimer: NodeJS.Timeout;
  // private odsTimer: NodeJS.Timeout;

  constructor(
    // @InjectDataSource(DBConnections.ODS)
    // private readonly odsDataSource: DataSource,
    @InjectDataSource(DBConnections.INTERNAL)
    private readonly internalDataSource: DataSource,
  ) {}

  onModuleInit() {
    if (process.env['NODE_ENV'] !== Environment.Local) {
      const internalLogger = new Logger('PG-INTERNAL');
      this.internalTimer = setInterval(() => {
        const pool = (this.internalDataSource.driver as any).master;
        internalLogger.log(
          `DB Pool Statistics [Max: ${pool.options.max}, Current: ${pool._clients.length}, Busy: ${pool._clients.length - pool._idle.length}, Idle: ${
            pool._idle.length
          }, Tasks: ${pool._pendingQueue.length}]`,
        );
      }, 30000);

      // const odsLogger = new Logger('PG-ODS');
      // this.odsTimer = setInterval(() => {
      //   const pool = (this.odsDataSource.driver as any).master;
      //   odsLogger.log(
      // eslint-disable-next-line max-len
      //     `DB Pool Statistics [Max: ${pool.options.max}, Current: ${pool._clients.length}, Busy: ${pool._clients.length - pool._idle.length}, Idle: ${
      //       pool._idle.length
      //     }, Tasks: ${pool._pendingQueue.length}]`,
      //   );
      // }, 30000);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onApplicationShutdown(_?: string) {
    if (this.internalTimer) {
      clearInterval(this.internalTimer);
    }

    // if (this.odsTimer) {
    //   clearInterval(this.odsTimer);
    // }
  }
}
