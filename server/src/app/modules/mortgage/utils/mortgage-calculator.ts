export interface MortgageInput {
  propertyPrice: number;
  downPaymentAmount: number;
  matCapitalAmount: number | null;
  matCapitalIncluded: boolean;
  mortgageTermYears: number;
  interestRate: number;
}

export interface MortgagePayment {
  totalPayment: number;
  repaymentOfMortgageBody: number;
  repaymentOfMortgageInterest: number;
  mortgageBalance: number;
}

export interface MonthlyMortgagePayments {
  [month: string]: MortgagePayment;
}

export interface MortgagePaymentSchedule {
  [year: string]: MonthlyMortgagePayments;
}

export interface MortgageResult {
  monthlyPayment: number;
  totalPayment: number;
  totalOverpaymentAmount: number;
  possibleTaxDeduction: number;
  savingsDueMotherCapital: number;
  recommendedIncome: number;
  paymentSchedule: MortgagePaymentSchedule;
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const {
    propertyPrice,
    downPaymentAmount,
    matCapitalAmount,
    matCapitalIncluded,
    mortgageTermYears,
    interestRate
  } = input;

  const totalMonths = mortgageTermYears * 12;
  const matCapital =
    matCapitalIncluded && matCapitalAmount ? matCapitalAmount : 0;
  const loanAmount = propertyPrice - downPaymentAmount - matCapital;
  const monthlyInterestRate = interestRate / 12 / 100;

  const monthlyPayment: number =
    monthlyInterestRate > 0
      ? (loanAmount *
          monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, totalMonths)) /
        (Math.pow(1 + monthlyInterestRate, totalMonths) - 1)
      : loanAmount / totalMonths;

  const totalPayment = monthlyPayment * totalMonths;
  const totalOverpaymentAmount = totalPayment - loanAmount;

  const possibleTaxDeduction =
    Math.min(propertyPrice, 2_000_000) * 0.13 +
    Math.min(totalOverpaymentAmount, 3_000_000) * 0.13;

  let savingsDueMotherCapital = 0;
  if (matCapital > 0) {
    const loanWithoutMatCapital = propertyPrice - downPaymentAmount;
    let monthlyWithout: number;
    if (monthlyInterestRate > 0) {
      monthlyWithout =
        (loanWithoutMatCapital *
          monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, totalMonths)) /
        (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);
    } else {
      monthlyWithout = loanWithoutMatCapital / totalMonths;
    }
    const totalWithout = monthlyWithout * totalMonths;
    savingsDueMotherCapital = totalWithout - totalPayment;
  }

  const recommendedIncome = monthlyPayment / 0.4;

  const paymentSchedule: MortgagePaymentSchedule = {};
  let balance = loanAmount;

  for (let i = 1; i <= totalMonths; i++) {
    const interest = balance * monthlyInterestRate;
    let monthDept = monthlyPayment - interest;

    if (i === totalMonths) {
      monthDept = balance;
      balance = 0;
    } else balance -= monthDept;

    const year = String(Math.ceil(i / 12));
    const month = String(((i - 1) % 12) + 1);
    if (!paymentSchedule[year]) paymentSchedule[year] = {};
    paymentSchedule[year][month] = {
      totalPayment: Number(
        (i === totalMonths ? monthDept + interest : monthlyPayment).toFixed(2)
      ),
      repaymentOfMortgageBody: Number(monthDept.toFixed(2)),
      repaymentOfMortgageInterest: Number(interest.toFixed(2)),
      mortgageBalance: Number(balance.toFixed(2))
    };
  }

  return {
    monthlyPayment: Number(monthlyPayment.toFixed(2)),
    totalPayment: Number(totalPayment.toFixed(2)),
    totalOverpaymentAmount: Number(totalOverpaymentAmount.toFixed(2)),
    possibleTaxDeduction: Number(possibleTaxDeduction.toFixed(2)),
    savingsDueMotherCapital: Number(savingsDueMotherCapital.toFixed(2)),
    recommendedIncome: Number(recommendedIncome.toFixed(2)),
    paymentSchedule
  };
}
