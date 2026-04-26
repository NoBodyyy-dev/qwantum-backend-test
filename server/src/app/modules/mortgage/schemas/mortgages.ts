import {
  varchar,
  int,
  boolean,
  mysqlTable,
  mysqlEnum,
  text,
  decimal
} from 'drizzle-orm/mysql-core';
import { users } from '../../user/schemas/users';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const mortgageProfiles = mysqlTable('MortgageProfiles', {
  id: int('id').primaryKey().autoincrement(),
  userId: varchar('userId', { length: 255 })
    .notNull()
    .references(() => users.tgId),
  propertyPrice: decimal('propertyPrice', {
    precision: 15,
    scale: 2
  }).notNull(),
  propertyType: mysqlEnum('propertyType', [
    'apartment_in_new_building',
    'apartment_in_secondary_building',
    'house',
    'house_with_land_plot',
    'land_plot',
    'other'
  ]).notNull(),
  downPaymentAmount: decimal('downPaymentAmount', {
    precision: 15,
    scale: 2
  }).notNull(),
  matCapitalAmount: decimal('matCapitalAmount', { precision: 15, scale: 2 }),
  matCapitalIncluded: boolean('matCapitalIncluded').notNull().default(false),
  mortgageTermYears: int('mortgageTermYears').notNull(),
  interestRate: decimal('interestRate', { precision: 5, scale: 2 }).notNull()
});

export const mortgageCalculation = mysqlTable('MortgageCalculation', {
  id: int('id').primaryKey().autoincrement(),
  userId: varchar('userId', { length: 255 })
    .notNull()
    .references(() => users.tgId),
  mortgageProfileId: int('mortgageProfileId')
    .notNull()
    .references(() => mortgageProfiles.id),
  monthlyPayment: decimal('monthlyPayment', {
    precision: 15,
    scale: 2
  }).notNull(),
  totalPayment: decimal('totalPayment', { precision: 15, scale: 2 }).notNull(),
  totalOverpaymentAmount: decimal('totalOverpaymentAmount', {
    precision: 15,
    scale: 2
  }).notNull(),
  possibleTaxDeduction: decimal('possibleTaxDeduction', {
    precision: 15,
    scale: 2
  }).notNull(),
  savingsDueMotherCapital: decimal('savingsDueMotherCapital', {
    precision: 15,
    scale: 2
  }).notNull(),
  recommendedIncome: decimal('recommendedIncome', {
    precision: 15,
    scale: 2
  }).notNull(),
  paymentSchedule: text('paymentSchedule').notNull()
});

export type MortgageProfile = InferSelectModel<typeof mortgageProfiles>;
export type MortgageCalculation = InferSelectModel<typeof mortgageCalculation>;
export type NewMortgageProfile = InferInsertModel<typeof mortgageProfiles>;
export type NewMortgageCalculation = InferInsertModel<
  typeof mortgageCalculation
>;
