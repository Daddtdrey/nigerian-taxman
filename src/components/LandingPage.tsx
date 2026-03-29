"use client"

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import { dummyCsvText } from '../utils/dummyData';
import { ThemeToggle } from './ThemeToggle';

interface LandingPageProps {
  onFileUpload: (file: File) => void;
  onTrySample: (csvText: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onFileUpload, onTrySample }) => {
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError('');
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const handleSample = () => {
    setError('');
    onTrySample(dummyCsvText);
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center justify-center p-6 mt-16 lg:mt-0 transition-colors duration-300">
      
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="max-w-3xl w-full flex flex-col items-center space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex max-w-max items-center justify-center rounded-full bg-nigeria-green-light dark:bg-nigeria-green-dark/30 px-4 py-1.5 border border-nigeria-green/20 dark:border-nigeria-green/30">
            <span className="text-sm font-medium text-nigeria-green-dark dark:text-nigeria-green-light tracking-wide flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-nigeria-green animate-pulse"></div> Powered by Gemini AI
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
            Nigerian AI Tax <span className="text-nigeria-green">Assessor.</span>
          </h1>

          <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Freelancers and gig workers: know your true tax liability instantly. 
            Upload your bank statement and let our intelligent engine assess it against the latest Nigerian laws.
          </p>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Upload Card */}
        <div className="w-full bg-white dark:bg-neutral-800 rounded-3xl shadow-xl shadow-nigeria-green/5 dark:shadow-none border border-neutral-100 dark:border-neutral-700 p-8 md:p-12 overflow-hidden relative transition-all duration-300">
          
          <div 
            {...getRootProps()} 
            className={cn(
              "border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 text-center cursor-pointer transition-all duration-300 ease-in-out group",
              isDragActive 
                ? "border-nigeria-green bg-nigeria-green/5 dark:bg-nigeria-green/10" 
                : "border-neutral-200 dark:border-neutral-700 hover:border-nigeria-green hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
            )}
          >
            <input {...getInputProps()} />
            <div className="w-16 h-16 rounded-full bg-nigeria-green-light dark:bg-nigeria-green/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <UploadCloud className="w-8 h-8 text-nigeria-green" />
            </div>
            <p className="text-xl font-semibold text-neutral-800 dark:text-white mb-2">
              {isDragActive ? "Drop statement here..." : "Select or drag & drop"}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              Supported formats: .CSV and .PDF
            </p>
            <button className="bg-neutral-900 dark:bg-neutral-700 text-white px-6 py-2.5 rounded-full font-medium hover:bg-neutral-800 dark:hover:bg-neutral-600 transition-colors shadow-sm">
              Browse Files
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 border-t border-neutral-100 dark:border-neutral-700 pt-8">
            <button 
              onClick={handleSample}
              className="group flex flex-col items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-nigeria-green dark:hover:text-nigeria-green transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center group-hover:bg-nigeria-green-light dark:group-hover:bg-nigeria-green/20 transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              Try with Sample Data
            </button>
          </div>
        </div>

        {/* Trust Indicators / Disclaimer */}
        <p className="text-xs text-center text-neutral-400 dark:text-neutral-500 max-w-xl">
          <strong className="text-neutral-500 dark:text-neutral-400">Disclaimer:</strong> This is an estimate based on NTA 2026. Your backend secure keys are used via proxy locally. We do not store your financial data.
        </p>

      </div>
    </div>
  );
};
