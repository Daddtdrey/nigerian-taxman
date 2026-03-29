import React from 'react';
import { Transaction } from '../types';
import { formatNaira, cn } from '../lib/utils';
import { Tag, AlertCircle } from 'lucide-react';

interface TaxDataTableProps {
  transactions: Transaction[];
}

export const TaxDataTable: React.FC<TaxDataTableProps> = ({ transactions }) => {
  return (
    <div className="w-full overflow-x-auto text-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-neutral-100 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 text-xs uppercase tracking-wider bg-neutral-50/50 dark:bg-neutral-900/30">
            <th className="py-4 px-4 font-semibold">Date</th>
            <th className="py-4 px-4 font-semibold">Description</th>
            <th className="py-4 px-4 font-semibold">Amount</th>
            <th className="py-4 px-4 font-semibold text-right">Classification</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50 dark:divide-neutral-700/50">
          {transactions.map((txn, idx) => (
            <tr key={`${txn.id}-${idx}`} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-700/30 transition-colors">
              <td className="py-4 px-4 text-neutral-600 dark:text-neutral-300 font-mono whitespace-nowrap">{txn.date}</td>
              <td className="py-4 px-4 text-neutral-900 dark:text-neutral-100 font-medium">
                <div className="flex flex-col">
                  <span>{txn.description}</span>
                  {txn.type === 'debit' && (
                    <span className="text-xs text-neutral-400 dark:text-neutral-500">Debit (Ignored)</span>
                  )}
                </div>
              </td>
              <td className="py-4 px-4 font-mono font-bold text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                {formatNaira(txn.amount)}
              </td>
              <td className="py-4 px-4 text-right">
                {txn.type === 'credit' ? (
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap",
                    txn.isIncome 
                      ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30" 
                      : "bg-nigeria-green-light dark:bg-nigeria-green/10 text-nigeria-green-dark dark:text-nigeria-green-light border border-nigeria-green/20 dark:border-nigeria-green/30"
                  )}>
                    {txn.isIncome ? <AlertCircle className="w-3.5 h-3.5" /> : <Tag className="w-3.5 h-3.5" />}
                    {txn.isIncome ? 'Taxable Income' : 'Exempt / Non-Income'}
                  </div>
                ) : (
                  <span className="text-xs text-neutral-300 dark:text-neutral-600 italic">N/A</span>
                )}
              </td>
            </tr>
          ))}
          {(!transactions || transactions.length === 0) && (
            <tr>
              <td colSpan={4} className="py-8 text-center text-neutral-500 dark:text-neutral-400">
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
