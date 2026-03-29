import React, { useEffect, useState } from 'react';
import { Loader2, Database, ShieldCheck, Calculator } from 'lucide-react';
import { cn } from '../lib/utils';
import { ThemeToggle } from './ThemeToggle';

interface ProcessingStateProps {
  onComplete: () => void;
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    { text: "Securely requesting Gemini API...", icon: Database },
    { text: "Extracting inflow transactions...", icon: Loader2 },
    { text: "AI classifying JSON schema rules...", icon: ShieldCheck },
    { text: "Applying NTA 2026 progressive logic...", icon: Calculator },
  ];

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps.length) {
        clearInterval(interval);
        setTimeout(onComplete, 500); // Wait for results
      } else {
        setStep(currentStep);
      }
    }, 2000); 

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center justify-center p-6 transition-colors duration-300">
      
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-3xl p-10 shadow-2xl shadow-nigeria-green/10 dark:shadow-none border border-neutral-100 dark:border-neutral-700 flex flex-col items-center justify-center space-y-8 relative overflow-hidden transition-colors">
        
        {/* Animated Background Blob */}
        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-nigeria-green-light dark:bg-nigeria-green-dark/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse-slow"></div>

        {/* Loading Spinner */}
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-24 h-24 border-4 border-nigeria-green-light dark:border-nigeria-green-dark/40 rounded-full border-t-nigeria-green animate-spin"></div>
          <div className="absolute bg-white dark:bg-neutral-800 rounded-full p-2">
            <ShieldCheck className="w-8 h-8 text-nigeria-green" />
          </div>
        </div>

        <div className="text-center w-full space-y-4">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Assessing via AI</h2>
          
          <div className="space-y-3 mt-8">
            {steps.map((s, index) => {
              const Icon = s.icon;
              const isActive = index === step;
              const isPast = index < step;
              
              return (
                <div 
                  key={index}
                  className={cn(
                    "flex items-center gap-3 text-sm font-medium transition-all duration-500",
                    isPast ? "text-nigeria-green" : isActive ? "text-neutral-900 dark:text-white" : "text-neutral-300 dark:text-neutral-600 opacity-50",
                    isActive && "scale-105 transform translate-x-2"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive && Icon === Loader2 && "animate-spin")} />
                  {s.text}
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full bg-neutral-100 dark:bg-neutral-700 h-2 rounded-full overflow-hidden mt-6">
          <div 
            className="bg-nigeria-green h-full rounded-full transition-all duration-[1800ms] ease-linear"
            style={{ width: `${Math.min(100, ((step + 1) / steps.length) * 100)}%` }}
          ></div>
        </div>

      </div>
    </div>
  );
};
