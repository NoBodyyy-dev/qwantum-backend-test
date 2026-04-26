import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import type { Job } from 'bull';
import type Redis from 'ioredis';
import { CreateMortgageProfileDto } from './dto/mortgage-profile.dto';
import { calculateMortgage } from './utils/mortgage-calculator';
import { MortgageRepository } from './mortgage.repository';
import { makeMortgageInputCacheKey } from './utils/mortgage-cache';
import { CONFIG } from '../../config/config';

export type MortgageCalcJob = {
  userId: string;
  dto: CreateMortgageProfileDto;
};

@Processor('mortgage')
export class MortgageProcessor {
  constructor(
    private readonly repository: MortgageRepository,
    @Inject('REDIS') private readonly redis: Redis
  ) {}

  @Process('mortgage-calculation')
  async handle(job: Job<MortgageCalcJob>) {
    const { userId, dto } = job.data;
    const result = calculateMortgage(dto);
    const profileId = await this.repository.persistAfterCalculation(
      userId,
      dto,
      result
    );

    const keyHash = makeMortgageInputCacheKey(userId, dto);
    await this.redis.set(
      `${CONFIG.cache.prefix}${keyHash}`,
      String(profileId),
      'EX',
      CONFIG.cache.ttl
    );

    return profileId;
  }
}