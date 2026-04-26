import * as dotenv from 'dotenv';
dotenv.config();

const days = Number(process.env.CACHE_TTL_DAYS) || 30;
const CACHE_TTL = 60 * 60 * 24 * days;

const cachePrefix = process.env.CACHE_PREFIX;
if (!cachePrefix) throw new Error('CACHE_PREFIX is not set');

export const CONFIG = {
  app: {
    port: Number(process.env.APP_PORT) || 5094,
    nodeEnv: process.env.NODE_ENV ?? 'development',
    host: process.env.HOST
  },
  database: {
    host: process.env.HOST,
    port: Number(process.env.PORT) || 3306
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 6379
  },
  cache: {
    prefix: cachePrefix,
    ttl: CACHE_TTL
  }
} as const;
