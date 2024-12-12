import * as dotenv from 'dotenv';
import * as path from 'path';

import * as pkg from '../package.json';
import {
  getOsEnv,
  getOsEnvOptional,
  normalizePort,
  toBool,
  getOsPaths,
  toNumber,
} from './lib/env';

/**
 * Load .env file for prodduction or .env.development for development.
 */
const isTranspiled = __dirname.includes(path.join('dist', 'src'));
dotenv.config({
  path: path.join(
    process.cwd(),
    `${isTranspiled ? path.join('dist', '.env') : `.env${process.env.NODE_ENV === 'development' ? '.development' : ''}`}`,
  ),
});

/**
 * Environment variables
 */
export const env = {
  node: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isDevelopment: process.env.NODE_ENV === 'development',
  app: {
    name: getOsEnv('APP_NAME'),
    version: (pkg as any).version,
    description: (pkg as any).description,
    host: getOsEnv('APP_HOST'),
    schema: getOsEnv('APP_SCHEMA'),
    routePrefix: getOsEnv('APP_ROUTE_PREFIX'),
    port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
    banner: toBool(getOsEnv('APP_BANNER')),
    dirs: {
      // migrations: getOsPaths('TYPEORM_MIGRATIONS'),
      // migrationsDir: getOsPath('TYPEORM_MIGRATIONS_DIR'),
      // entities: getOsPaths('TYPEORM_ENTITIES'),
      // entitiesDir: getOsPath('TYPEORM_ENTITIES_DIR'),
      controllers: getOsPaths('CONTROLLERS'),
      middlewares: getOsPaths('MIDDLEWARES'),
      subscribers: getOsPaths('SUBSCRIBERS'),
    },
    auth: {
      jwtsecret: getOsEnv('JWT_SECRET'),
      expiresIn: getOsEnv('JWT_EXPIRES'),
      expiresRefresh: getOsEnv('REFRESH_EXPIRES'),
    },
  },
  log: {
    level: getOsEnv('LOG_LEVEL'),
    json: toBool(getOsEnvOptional('LOG_JSON')),
    output: getOsEnv('LOG_OUTPUT'),
  },
  mongodb: {
    username: getOsEnv('MONGO_DB_USERNAME'),
    password: getOsEnv('MONGO_DB_PASSWORD'),
    host: getOsEnv('MONGO_DB_HOST'),
    port: toNumber(getOsEnv('MONGO_DB_PORT')),
    appName: getOsEnvOptional('MONGO_DB_NAME'),
    dbName: getOsEnv('MONGO_DB_DATABASE'),
  },
};
