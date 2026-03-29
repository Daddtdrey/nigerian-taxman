import { Transaction } from '../types';

/**
 * Mock AI Agent that categorizes bank statement inflows.
 * Real implementation would pass concatenated descriptions to an LLM like Gemini or OpenAI
 * to classify standard "income" vs "non-income" items.
 */
export function classifyTransactions(transactions: Transaction[]): Transaction[] {
  const nonIncomeKeywords = [
    'refund', 'transfer', 'reversal', 'internal', 'self', 'loan', 'disbursal', 'borrow', 'repayment'
  ];

  return transactions.map(txn => {
    if (txn.type === 'debit') {
      return { ...txn, isIncome: false };
    }

    const descL = txn.description.toLowerCase();
    const isNonIncome = nonIncomeKeywords.some(kw => descL.includes(kw));

    return {
      ...txn,
      isIncome: !isNonIncome, // If it's a credit and not explicitly a non-income transfer/loan/refund, we assume it's income
    };
  });
}
