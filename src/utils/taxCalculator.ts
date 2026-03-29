import { TaxAssessment, TaxBracket } from '../types';

/**
 * Calculates tax liability based on NTA 2026 progressive brackets:
 * First ₦800,000: 0%
 * Next ₦2,200,000: 15% (Up to 3,000,000)
 * Next ₦9,000,000: 18% (Up to 12,000,000)
 * Next ₦38,000,000: 21% (Up to 50,000,000)
 * Above ₦50,000,000: 25%
 */
export function calculateTax(totalIncome: number, totalInflows: number): TaxAssessment {
  const brackets = [
    { limit: 800000, rate: 0.00, name: 'First ₦800,000 @ 0%' },
    { limit: 2200000, rate: 0.15, name: 'Next ₦2,200,000 @ 15%' },
    { limit: 9000000, rate: 0.18, name: 'Next ₦9,000,000 @ 18%' },
    { limit: 38000000, rate: 0.21, name: 'Next ₦38,000,000 @ 21%' },
    { limit: Infinity, rate: 0.25, name: 'Above ₦50,000,000 @ 25%' },
  ];

  let remainingIncome = totalIncome;
  let totalTaxLiability = 0;
  const breakdown: TaxBracket[] = [];

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;

    const amountToTaxInThisBracket = Math.min(remainingIncome, bracket.limit);
    const taxForThisBracket = amountToTaxInThisBracket * bracket.rate;

    breakdown.push({
      name: bracket.name,
      rate: bracket.rate,
      amountTaxed: amountToTaxInThisBracket,
      taxCalculated: taxForThisBracket,
    });

    totalTaxLiability += taxForThisBracket;
    remainingIncome -= amountToTaxInThisBracket;
  }

  const isTaxable = totalIncome > 800000;
  const effectiveTaxRate = totalIncome > 0 ? (totalTaxLiability / totalIncome) * 100 : 0;

  return {
    totalInflows,
    totalIncome,
    isTaxable,
    taxableAmount: Math.max(0, totalIncome - 800000),
    totalTaxLiability,
    effectiveTaxRate,
    breakdown,
  };
}
