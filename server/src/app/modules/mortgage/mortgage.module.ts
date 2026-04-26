import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthMiddleware } from '../../common/auth.middleware';
import { MortgageService } from './mortgage.service';
import { MortgageController } from './mortgage.controller';
import { BullModule } from '@nestjs/bull';
import { MortgageRepository } from './mortgage.repository';
import { MortgageProcessor } from './mortgage.process';

@Module({
  imports: [BullModule.registerQueue({ name: 'mortgage' })],
  controllers: [MortgageController],
  providers: [
    MortgageService,
    MortgageRepository,
    MortgageProcessor,
    AuthMiddleware
  ],
  exports: [MortgageService]
})

export class MortgageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('mortgage-profiles');
  }
}