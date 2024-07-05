/* istanbul ignore file */
import { INestApplication, LoggerService, ShutdownSignal, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CustomLoggerService } from './shared/logger/services/custom-logger.service';
import { ClsService, ClsServiceManager } from 'nestjs-cls';
import { RequestLoggingInterceptor } from './shared/logger/interceptors/request-logging.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { getLoggerOptions } from 'src/shared/config/logger.config';
import { Environment, getKafkaConfigs } from 'src/shared/config';
import { getSiQueueGrpcOption } from './api/grpc/grpc.helper';
import { KafkaRequestLoggingInterceptor } from './shared/logger/interceptors/kafka-request-logging.interceptor';
import { DefaultExceptionFilter } from './shared/filter/exception.filter';

const logger = createLogger();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,POST,DELETE',
    },
  });

  app.disable('x-powered-by');

  try {
    logAppEnv(logger);
    configure(app);

    await startHttp(app);
    await startGrpc(app);
    await startEvent(app);

    await app.startAllMicroservices();

    logAppPath(app, logger);
    logGrpcAppPath(app, logger);
  } catch (error) {
    const stack = error instanceof Error ? error.stack : '';
    logger.error(`Error starting server, ${error}`, stack, 'Bootstrap');
    process.exit();
  }
}

function configure(app: INestApplication) {
  const cls = app.get(ClsService);
  const reflector = app.get(Reflector);

  app.useLogger(app.get(CustomLoggerService));

  app.useGlobalInterceptors(new RequestLoggingInterceptor(cls, reflector));
  app.useGlobalInterceptors(new KafkaRequestLoggingInterceptor(cls, reflector));

  app.useGlobalFilters(new DefaultExceptionFilter(app.get(ConfigService)));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableShutdownHooks(Object.values(ShutdownSignal).filter((x) => x !== ShutdownSignal.SIGUSR2));
  useSwagger(app);
}

async function startHttp(app: INestApplication) {
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT', '3000'));
}

async function startEvent(app: INestApplication) {
  const configService = app.get(ConfigService);
  app.connectMicroservice(
    {
      ...getKafkaConfigs(configService),
    },
    {
      inheritAppConfig: true,
    },
  );
}

async function startGrpc(app: INestApplication) {
  const configService = app.get(ConfigService);
  app.connectMicroservice(
    {
      ...getSiQueueGrpcOption(configService),
    },
    {
      inheritAppConfig: true,
    },
  );
}

function useSwagger(app: INestApplication) {
  const configService = app.get(ConfigService);
  const APP_NAME = configService.get('APP_NAME', 'Container service');
  const APP_DESCRIPTION = configService.get('APP_DESCRIPTION', 'Receive message from distributed service and aggregate');
  const API_VERSION = configService.get('API_VERSION', 'v1');
  const options = new DocumentBuilder().setTitle(APP_NAME).setDescription(APP_DESCRIPTION).setVersion(API_VERSION).build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  SwaggerModule.setup('/', app, document);
}

function logAppEnv(logger: LoggerService) {
  logger.log(`Environment: ${process.env['NODE_ENV']?.toUpperCase()}`, 'Bootstrap');
  logger.log('IS_CAL_TIME_LEFT: ' + JSON.parse(process.env['IS_CAL_TIME_LEFT']));
}

function logAppPath(app: INestApplication, logger: LoggerService) {
  const configService = app.get(ConfigService);
  logger.log(`Node Environment: ${process.env['NODE_ENV']?.toUpperCase()}`, 'Bootstrap');
  const HOST = configService.get('HOST', 'localhost');
  const PORT = configService.get('PORT', '3000');

  process.env['NODE_ENV'] !== Environment.Production
    ? logger.log(`Server ready at http://${HOST}:${PORT}`, 'Bootstrap')
    : logger.log(`Server is listening on port ${PORT}`, 'Bootstrap');
}

function logGrpcAppPath(app: INestApplication, logger: LoggerService) {
  const configService = app.get(ConfigService);
  const grpcUrl = configService.get('GRPC_URL', 'localhost:5002');

  const HOST = grpcUrl.split(':')[0];
  const PORT = grpcUrl.split(':')[1];

  process.env['NODE_ENV'] !== Environment.Production
    ? logger.log(`GRPC-Server ready at ${HOST}:${PORT}`, 'Bootstrap')
    : logger.log(`GRPC-Server is listening on port ${PORT}`, 'Bootstrap');
}

function createLogger(): LoggerService {
  return new CustomLoggerService(ClsServiceManager.getClsService(), getLoggerOptions());
}

bootstrap().catch(async (e) => {
  const stack = e instanceof Error ? e.stack : '';
  logger.error(`Error starting server, ${e}`, stack, 'Bootstrap');
  throw e;
});
