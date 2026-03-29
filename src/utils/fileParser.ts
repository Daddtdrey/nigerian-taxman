import Papa from 'papaparse';
import * as pdfjsLib from 'pdfjs-dist';
import { Transaction } from '../types';
import { extractTransactionsFromTextGemini } from './geminiClient';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;

export async function parseCSV(file: File): Promise<Transaction[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsed = results.data.map((row: any, i) => {
            // Very naive property search to handle different CSV headers
            const date = row.Date || row.date || row.DATE || '';
            const description = row.Description || row.description || row.Desc || row.Narration || '';
            const amountStr = row.Amount || row.amount || row.AMOUNT || '0';
            const typeStr = row.Type || row.type || row.TYPE || 'credit';
            
            return {
              id: `${i}-${Date.now()}`,
              date,
              description,
              amount: parseFloat(String(amountStr).replace(/[^0-9.-]+/g, "")),
              type: (typeStr.toLowerCase() === 'debit' ? 'debit' : 'credit') as 'debit' | 'credit'
            };
          });
          resolve(parsed);
        } catch (e) {
          reject('Invalid CSV format. Please ensure Date, Description, Amount, and Type columns exist.');
        }
      },
      error: (error) => reject(error.message)
    });
  });
}

export async function parsePDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  // Extract text from all pages
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str);
    fullText += strings.join(' ') + '\n';
  }
  
  return fullText;
}

// Helper to use AI to turn raw text from PDF into structured transactions
export async function convertTextToTransactions(text: string): Promise<Transaction[]> {
  return await extractTransactionsFromTextGemini(text);
}
