import { Transaction } from '../types';

export const dummyTransactions: Transaction[] = [
  { id: '1', date: '2026-01-10', description: 'Upwork Freelance IT Service', amount: 1500000, type: 'credit' },
  { id: '2', date: '2026-01-15', description: 'Refund from Jumia Stores', amount: 25000, type: 'credit' },
  { id: '3', date: '2026-02-05', description: 'Salary - Tech Corp Nigeria', amount: 3500000, type: 'credit' },
  { id: '4', date: '2026-02-28', description: 'Transfer from self - GTBank', amount: 100000, type: 'credit' },
  { id: '5', date: '2026-03-15', description: 'Consulting Retainer Q1', amount: 8000000, type: 'credit' },
  { id: '6', date: '2026-03-20', description: 'Loan Disbursal - Access Bank', amount: 5000000, type: 'credit' },
  { id: '7', date: '2026-04-10', description: 'Fiverr Content Writing', amount: 450000, type: 'credit' },
  { id: '8', date: '2026-04-12', description: 'Uber Eats Payment', amount: 15000, type: 'debit' },
  { id: '9', date: '2026-05-01', description: 'Rent Payment - Marina Apt', amount: 4000000, type: 'debit' },
  { id: '10', date: '2026-06-15', description: 'Upwork Project X', amount: 2200000, type: 'credit' }
];

export const dummyCsvText = `Date,Description,Amount,Type
2026-01-10,Upwork Freelance IT Service,1500000,credit
2026-01-15,Refund from Jumia Stores,25000,credit
2026-02-05,Salary - Tech Corp Nigeria,3500000,credit
2026-02-28,Transfer from self - GTBank,100000,credit
2026-03-15,Consulting Retainer Q1,8000000,credit
2026-03-20,Loan Disbursal - Access Bank,5000000,credit
2026-04-10,Fiverr Content Writing,450000,credit
2026-04-12,Uber Eats Payment,15000,debit
2026-05-01,Rent Payment - Marina Apt,4000000,debit
2026-06-15,Upwork Project X,2200000,credit`;
