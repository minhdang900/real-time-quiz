import { plainToInstance, Transform } from 'class-transformer';
import { Allow, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator';
import { Environment } from '../enum';

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  HOST: string;

  @IsNotEmpty()
  @IsNumber()
  PORT: number;

  @IsNotEmpty()
  @IsString()
  ENV: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_HOST: string;

  @IsNotEmpty()
  @IsNumber()
  DATABASE_PORT: number;

  @IsNotEmpty()
  @IsString()
  DATABASE_USER: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_NAME: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_SCHEMA: string;

  @Transform(({ obj }) => {
    return [true, 'enabled', 'true'].indexOf(obj.DATABASE_SYNCHRONIZE) > -1;
  })
  @IsNotEmpty()
  @IsBoolean()
  DATABASE_SYNCHRONIZE: boolean;

  @Allow()
  DATABASE_POOL_SIZE: number;

  @IsNotEmpty()
  @IsString()
  KAFKA_DEFAULT_BROKER_URL: string;

  @IsNotEmpty()
  @IsString()
  KAFKA_DEFAULT_CLIENT_ID: string;

  @IsNotEmpty()
  @IsString()
  KAFKA_DEFAULT_GROUP_ID: string;

  @Transform(({ obj }) => {
    return [true, 'enabled', 'true'].indexOf(obj.KAFKA_DEFAULT_AUTO_CREATE_TOPIC) > -1;
  })
  @IsNotEmpty()
  @IsBoolean()
  KAFKA_DEFAULT_AUTO_CREATE_TOPIC: boolean;

  @Transform(({ obj }) => {
    return [true, 'enabled', 'true'].indexOf(obj.KAFKA_DEFAULT_SSL) > -1;
  })
  @IsNotEmpty()
  @IsBoolean()
  KAFKA_DEFAULT_SSL: boolean;

  @IsString()
  KAFKA_DEFAULT_MECHANISM: string;

  @IsString()
  KAFKA_DEFAULT_USERNAME: string;

  @IsString()
  KAFKA_DEFAULT_PASSWORD: string;

  @IsNumber()
  KAFKA_DEFAULT_REQUEST_TIMEOUT: number;

  @IsNumber()
  KAFKA_DEFAULT_CONCURRENTLY: number;

  @Allow()
  KAFKA_LOG_LEVEL: number;

  @IsString()
  REDIS_HOST: string;

  @IsNumber()
  REDIS_PORT: number;

  @Allow()
  REDIS_PASS: string;

  @IsNumber()
  REDIS_DB: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

export { Environment };
