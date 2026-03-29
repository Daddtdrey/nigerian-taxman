export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  isIncome?: boolean;
}

export interface TaxAssessment {
  totalInflows: number;
  totalIncome: number;
  isTaxable: boolean;
  taxableAmount: number;
  totalTaxLiability: number;
  effectiveTaxRate: number;
  breakdown: TaxBracket[];
}

export interface TaxBracket {
  name: string;
  rate: number;
  amountTaxed: number;
  taxCalculated: number;
}
