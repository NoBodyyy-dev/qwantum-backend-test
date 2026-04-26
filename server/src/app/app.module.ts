import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from './modules/user/users.module';
import { MortgageModule } from './modules/mortgage/mortgage.module';
import { RedisModule } from './redis.module';
import { DatabaseModule } from '../database/database.module';
import { CONFIG } from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get('REDIS_HOST', CONFIG.redis.host),
          port: config.get('REDIS_PORT', CONFIG.redis.port)
        }
      }),
      inject: [ConfigService]
    }),
    RedisModule,
    DatabaseModule,
    UsersModule,
    MortgageModule
  ]
})
export class AppModule {}
