import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { LandingPage } from './components/LandingPage';
import { ProcessingState } from './components/ProcessingState';
import { ResultsDashboard } from './components/ResultsDashboard';
import { AuthScreen } from './components/AuthScreen';

import { Transaction, TaxAssessment } from './types';
import { calculateTax } from './utils/taxCalculator';
import { dummyTransactions } from './utils/dummyData';
import { parseCSV, parsePDF, convertTextToTransactions } from './utils/fileParser';
import { classifyTransactionsGemini } from './utils/geminiClient';
import { Loader2 } from 'lucide-react';

type AppState = 'landing' | 'processing' | 'results';

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [assessment, setAssessment] = useState<TaxAssessment | null>(null);

  // Auth State
  const [session, setSession] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingAuth(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const processTransactions = async (rawTxns: Transaction[]) => {
    try {
      const classified = await classifyTransactionsGemini(rawTxns);
      setTransactions(classified);

      let totalInflows = 0;
      let totalIncome = 0;

      classified.forEach(txn => {
        if (txn.type === 'credit') {
          totalInflows += txn.amount;
          if (txn.isIncome) {
            totalIncome += txn.amount;
          }
        }
      });

      const taxResult = calculateTax(totalIncome, totalInflows);
      setAssessment(taxResult);
      setAppState('results');
    } catch (error: any) {
      alert("AI Processing Failed: " + error.message);
      setAppState('landing');
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setAppState('processing');
      let parsedTxns: Transaction[] = [];
      const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
      
      if (isPdf) {
        const text = await parsePDF(file);
        parsedTxns = await convertTextToTransactions(text);
      } else {
        parsedTxns = await parseCSV(file);
      }
      
      await processTransactions(parsedTxns);
      
    } catch (error: any) {
      alert("Error parsing file via AI: " + error.message);
      setAppState('landing');
    }
  };

  const handleTrySample = async () => {
    setAppState('processing');
    try {
      const mockFileData = dummyTransactions;
      await processTransactions(mockFileData);
    } catch (error: any) {
      alert("Error parsing data via AI: " + error.message);
      setAppState('landing');
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-nigeria-green" />
      </div>
    );
  }

  // Route to auth screen if not logged in
  if (!session) {
    return <AuthScreen onAuthSuccess={() => {}} />;
  }

  switch (appState) {
    case 'processing':
      return <ProcessingState onComplete={() => {}} />;
    case 'results':
      if (!assessment) return null;
      return (
        <ResultsDashboard 
          assessment={assessment} 
          transactions={transactions} 
          user={session.user}
          onReset={() => {
            setAppState('landing');
            setTransactions([]);
            setAssessment(null);
          }} 
        />
      );
    case 'landing':
    default:
      return (
        <LandingPage 
          onFileUpload={handleFileUpload} 
          onTrySample={handleTrySample} 
        />
      );
  }
}

export default App;
