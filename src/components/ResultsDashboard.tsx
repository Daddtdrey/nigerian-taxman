import React, { useState, useEffect } from 'react';
import { TaxAssessment, Transaction } from '../types';
import { formatNaira, cn } from '../lib/utils';
import { TaxDataTable } from './TaxDataTable';
import { Lock, Unlock, AlertTriangle, ArrowLeft, Calculator, LogOut, CheckCircle2, Download } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { supabase } from '../lib/supabase';
import { PaystackButton } from 'react-paystack';

interface ResultsDashboardProps {
  assessment: TaxAssessment;
  transactions: Transaction[];
  user: any;
  onReset: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ 
  assessment, 
  transactions, 
  user,
  onReset 
}) => {
  // Check user metadata for premium flag, fallback to local state for instant UI update
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    return user?.user_metadata?.is_premium === true;
  });

  // Paystack Configuration
  const config = {
    reference: (new Date()).getTime().toString(),
    email: user?.email || "customer@example.com",
    amount: 1500 * 100, // ₦1500 represented in kobo
    currency: "NGN",
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_placeholder",
  };
  
  const componentProps = {
    ...config,
    onSuccess: (reference: any) => {
      console.log("Paystack Success:", reference);
      supabase.auth.updateUser({ data: { is_premium: true } }).catch(err => console.error("DB Sync error", err));
      setIsPremium(true);
    },
    onClose: () => console.log("Paystack closed"),
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-24 transition-colors duration-300">
      
      {/* Navbar Minimalist */}
      <nav className="w-full bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 py-4 px-6 fixed top-0 z-50 flex items-center justify-between transition-colors print:hidden">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400 hover:text-nigeria-green transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Start Over
        </button>
        <div className="font-extrabold text-neutral-900 dark:text-white tracking-tight">NigeriaTax<span className="text-nigeria-green">Man</span></div>
        <div className="w-auto flex items-center justify-end gap-6">
           <div className="text-xs text-neutral-500 flex items-center gap-2 font-mono">
             {user?.email} 
             {isPremium && <CheckCircle2 className="w-3.5 h-3.5 text-nigeria-green" />}
           </div>
           
           {isPremium && (
             <button 
               onClick={() => window.print()}
               className="text-white bg-nigeria-green hover:bg-nigeria-green-dark px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
             >
               <Download className="w-4 h-4" /> Export PDF
             </button>
           )}

           <ThemeToggle />
           <button 
             onClick={() => supabase.auth.signOut()} 
             className="text-neutral-400 hover:text-red-500 transition-colors"
             title="Log Out"
           >
             <LogOut className="w-4 h-4" />
           </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto pt-24 px-6 space-y-8 print:pt-0 print:space-y-4">
        
        {/* Print Only Letterhead */}
        <div className="hidden print:block border-b-2 border-nigeria-green pb-4 mb-6">
          <h2 className="text-2xl font-black text-black">NigeriaTax<span className="text-nigeria-green">Man</span></h2>
          <div className="flex justify-between mt-2 text-sm text-gray-600 font-mono">
            <span>Prepared For: {user?.email}</span>
            <span>Date: {new Date().toLocaleDateString()}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Official Personal Income Tax Assessment Report (NTA 2026)</p>
        </div>

        {/* Header Summary */}
        <header className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-4 py-1.5 shadow-sm text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> 
            <span className="dark:text-neutral-300">Total Volume Analysed:</span> 
            <span className="font-mono dark:text-white">{formatNaira(assessment.totalInflows)}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white">
            You are <span className={assessment.isTaxable ? "text-red-500" : "text-nigeria-green"}>
              {assessment.isTaxable ? "Taxable" : "Not Taxable"}
            </span>.
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg">Based on the NTA 2026 progressive thresholds.</p>
        </header>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Detailed Stats (Requires Premium to fully view) */}
          <div className="lg:col-span-2 space-y-8 relative">
            
            {/* The Blur overlay for non-premium */}
            {!isPremium && (
              <div className="absolute inset-0 z-20 backdrop-blur-[6px] bg-white/40 dark:bg-neutral-900/40 rounded-3xl flex flex-col items-center justify-center p-8 border border-neutral-100 dark:border-neutral-800 shadow-[inset_0_0_100px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
                <div className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-xl flex flex-col items-center text-center max-w-sm border border-neutral-100 dark:border-neutral-700">
                  <div className="w-16 h-16 bg-neutral-900 dark:bg-neutral-700 rounded-full flex items-center justify-center mb-6 shadow-md shadow-neutral-900/20">
                    <Lock className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Unlock Premium</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6 leading-relaxed">
                    Instantly reveal your exact AI tax liability calculation, effective rate, line-item Gemini API AI categorizations, and compliance checklist.
                  </p>
                  <PaystackButton 
                    {...componentProps}
                    text="Pay ₦1,500"
                    className="w-full bg-nigeria-green group hover:bg-nigeria-green-dark text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                  />
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-4 font-mono">Secure transaction via Paystack</p>
                </div>
              </div>
            )}

            {/* Hidden Content */}
            <div className={cn("space-y-8 transition-opacity duration-300", !isPremium && "opacity-20 pointer-events-none filter blur-sm")}>
              
              <div className="bg-white dark:bg-neutral-800 rounded-3xl p-8 shadow-sm border border-neutral-100 dark:border-neutral-700 transition-colors">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-nigeria-green" /> Estimation Breakdown
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-700">
                    <div className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Qualifying Income</div>
                    <div className="text-2xl font-mono font-bold text-neutral-900 dark:text-neutral-100">{formatNaira(assessment.totalIncome)}</div>
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-700">
                    <div className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Estimated Tax Owed</div>
                    <div className="text-2xl font-mono font-bold text-red-500">{formatNaira(assessment.totalTaxLiability)}</div>
                  </div>
                  <div className="bg-nigeria-green-light dark:bg-nigeria-green/10 rounded-2xl p-5 border border-nigeria-green/20 dark:border-nigeria-green/20">
                    <div className="text-sm font-semibold text-nigeria-green-dark dark:text-nigeria-green-light mb-1">Effective Tax Rate</div>
                    <div className="text-2xl font-mono font-bold text-nigeria-green">{assessment.effectiveTaxRate.toFixed(2)}%</div>
                  </div>
                </div>

                {/* Brackets */}
                <h4 className="font-semibold text-neutral-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Tax Brackets Applied</h4>
                <div className="space-y-3">
                  {assessment.breakdown.map((b, i) => (
                    <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-neutral-50 dark:border-neutral-700/50 last:border-0">
                      <div className="text-neutral-600 dark:text-neutral-300 font-medium">{b.name}</div>
                      <div className="text-neutral-900 dark:text-neutral-100 font-mono">
                         ({formatNaira(b.amountTaxed)}) → {formatNaira(b.taxCalculated)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white dark:bg-neutral-800 rounded-3xl p-8 shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden transition-colors">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">Transaction Classification</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">Line items flagged as Income versus Non-Income dynamically by Gemini API.</p>
                <TaxDataTable transactions={transactions} />
              </div>

            </div>
          </div>

          {/* Right Sidebar - Educational info always visible */}
          <div className="col-span-1">
            <div className="bg-white dark:bg-neutral-800 rounded-3xl p-8 shadow-sm border border-neutral-100 dark:border-neutral-700 sticky top-28 h-fit space-y-6 transition-colors">
              
              <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">NTA 2026 Rules</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Nigeria Tax Act 2026 progressive personal tax updates applied to your assessment.</p>
              </div>

              <ul className="space-y-4 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                <li className="flex items-center justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">First ₦800,000</span>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-xs font-bold">0% Exempt</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">Next ₦2.2M</span>
                  <span className="font-mono">15%</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">Next ₦9.0M</span>
                  <span className="font-mono">18%</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">Next ₦38.0M</span>
                  <span className="font-mono">21%</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">Above ₦50M</span>
                  <span className="font-mono">25%</span>
                </li>
              </ul>

              <div className="pt-6 border-t border-neutral-100 dark:border-neutral-700">
                <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 text-xs">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>Remember: Only actual 'Income' is taxed. Internal transfers, loans, and refunds are excluded from the total Qualifying Income calculation.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
