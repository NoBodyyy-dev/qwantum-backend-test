import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type Redis from 'ioredis';
import { Queue } from 'bull';

import { Database } from '../../../database/schema';
import { CreateMortgageProfileDto } from './dto/mortgage-profile.dto';
import { mortgageCalculation } from './schemas/mortgages';
import { makeMortgageInputCacheKey } from './utils/mortgage-cache';
import type { MortgageCalcJob } from './mortgage.process';
import { CONFIG } from '../../config/config';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class MortgageService {
  constructor(
    @Inject('DATABASE') private readonly db: Database,
    @Inject('REDIS') private readonly redis: Redis,
    @InjectQueue('mortgage') private readonly mortgageQueue: Queue
  ) {}

  async create(userId: string, dto: CreateMortgageProfileDto) {
    const keyHash = makeMortgageInputCacheKey(userId, dto);
    const redisKey = `${CONFIG.cache.prefix}${keyHash}`;
    const cached = await this.redis.get(redisKey);

    if (cached) return { id: cached };

    const payload: MortgageCalcJob = { userId, dto };
    const job = await this.mortgageQueue.add('mortgage-calculation', payload, {
      removeOnComplete: true
    });
    const profileId = (await job.finished()) as number;
    return { id: String(profileId) };
  }

  async getById(profileId: number, currentUserId: string) {
    const [calc] = await this.db
      .select()
      .from(mortgageCalculation)
      .where(eq(mortgageCalculation.mortgageProfileId, profileId));

    if (!calc) throw new NotFoundException('Ипотечный расчет не найден');
    if (calc.userId !== currentUserId)
      throw new ForbiddenException(
        "У вас нет доступа к этому ипотечному расчету"
      );

    return {
      monthlyPayment: calc.monthlyPayment,
      totalPayment: calc.totalPayment,
      totalOverpaymentAmount: String(calc.totalOverpaymentAmount),
      possibleTaxDeduction: String(calc.possibleTaxDeduction),
      savingsDueMotherCapital: String(calc.savingsDueMotherCapital),
      recommendedIncome: calc.recommendedIncome,
      mortgagePaymentSchedule: JSON.parse(calc.paymentSchedule)
    };
  }
}
