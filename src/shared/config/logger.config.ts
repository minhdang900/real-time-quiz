import { LoggerModuleOptions } from 'src/app/shared/logger/model/logger.option';
import { Environment } from './env.validation';
import { LogLevel } from '../constant';

export function getLogLevels(): LogLevel {
  if (process.env['LOG_LEVEL']) {
    return process.env['LOG_LEVEL'] as LogLevel;
  }

  if (process.env['NODE_ENV'] === Environment.Local) {
    return 'debug';
  }

  if (process.env['NODE_ENV'] === Environment.Production) {
    return 'info';
  }

  if (process.env['NODE_ENV'] === Environment.Staging) {
    return 'info';
  }

  return 'debug';
}

export function getLoggerOptions(): LoggerModuleOptions {
  return {
    global: true,
    output: process.env['NODE_ENV'] === Environment.Local ? 'text' : 'json',
    gcpProperties: process.env['NODE_ENV'] !== Environment.Local,
    source: ![Environment.Staging, Environment.Production].includes(process.env['NODE_ENV'] as Environment),
    level: getLogLevels(),
    logFile: process.env['LOG_FILE'],
  };
}
