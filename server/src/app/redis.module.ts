import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { CONFIG } from './config/config';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS',
      useFactory: (config: ConfigService) =>
        new Redis({
          host: config.get('REDIS_HOST', CONFIG.redis.host),
          port: Number(config.get('REDIS_PORT', CONFIG.redis.port))
        }),
      inject: [ConfigService]
    }
  ],
  exports: ['REDIS']
})

export class RedisModule {}
