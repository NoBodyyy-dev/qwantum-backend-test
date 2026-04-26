import { Inject, Injectable } from '@nestjs/common';
import { mortgageCalculation, mortgageProfiles } from './schemas/mortgages';
import { Database } from '../../../database/schema';
import { CreateMortgageProfileDto } from './dto/mortgage-profile.dto';
import type { MortgageResult } from './utils/mortgage-calculator';

@Injectable()
export class MortgageRepository {
  constructor(@Inject('DATABASE') private readonly db: Database) {}
  
  async persistAfterCalculation(
    userId: string,
    dto: CreateMortgageProfileDto,
    result: MortgageResult
  ): Promise<number> {
    return await this.db.transaction(async tx => {
      const profileResult = await tx.insert(mortgageProfiles).values({
        userId,
        propertyPrice: String(dto.propertyPrice),
        propertyType: dto.propertyType,
        downPaymentAmount: String(dto.downPaymentAmount),
        matCapitalAmount:
          dto.matCapitalAmount != null ? String(dto.matCapitalAmount) : null,
        matCapitalIncluded: dto.matCapitalIncluded,
        mortgageTermYears: dto.mortgageTermYears,
        interestRate: String(dto.interestRate)
      });

      const insertID = Number(profileResult[0].insertId);

      await tx.insert(mortgageCalculation).values({
        userId,
        mortgageProfileId: insertID,
        monthlyPayment: String(result.monthlyPayment),
        totalPayment: String(result.totalPayment),
        totalOverpaymentAmount: String(result.totalOverpaymentAmount),
        possibleTaxDeduction: String(result.possibleTaxDeduction),
        savingsDueMotherCapital: String(result.savingsDueMotherCapital),
        recommendedIncome: String(result.recommendedIncome),
        paymentSchedule: JSON.stringify(result.paymentSchedule)
      });

      return insertID;
    });
  }
}