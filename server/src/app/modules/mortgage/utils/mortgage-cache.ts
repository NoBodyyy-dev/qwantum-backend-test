import { createHash } from 'crypto';
import { CreateMortgageProfileDto } from '../dto/mortgage-profile.dto';

export function makeMortgageInputCacheKey (
  userId: string,
  dto: CreateMortgageProfileDto
): string {
  const payload = {
    userId,
    ...dto
  };

  return createHash('sha256').update(JSON.stringify(payload)).digest('hex');
};
