/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './shared/logger/logger.module';
import { validate } from 'src/shared/config';
import { getLoggerOptions } from 'src/shared/config/logger.config';
import { HealthModule } from './api/restful/health/health.module';
import { RepositoryModule } from 'src/infra/postgres/repository/repository.module';
import { GreetingModule } from './api/grpc/greeting/greeting.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validate,
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          config: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
            db: parseInt(configService.get('REDIS_DB'), 10),
          },
        };
      },
      inject: [ConfigService],
    }),
    LoggerModule.forRoot(getLoggerOptions()),
    RepositoryModule,
    HealthModule,
    GreetingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
