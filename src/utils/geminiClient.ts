import { Transaction } from '../types';

/**
 * Calls our completely secure Node API backend to parse data.
 */
export async function extractTransactionsFromTextGemini(rawText: string): Promise<Transaction[]> {
  try {
    const response = await fetch('/api/gemini/extract', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: rawText })
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg = errorData.error?.message || JSON.stringify(errorData.error) || JSON.stringify(errorData);
      throw new Error(errorMsg);
    }

    return await response.json();
  } catch (error) {
    console.error("Local Backend Error:", error);
    throw error;
  }
}

/**
 * Calls our secure Node API backend to categorize structures.
 */
export async function classifyTransactionsGemini(transactions: Transaction[]): Promise<Transaction[]> {
  if (transactions.length === 0) return [];

  try {
    const response = await fetch('/api/gemini/classify', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactions })
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg = errorData.error?.message || JSON.stringify(errorData.error) || JSON.stringify(errorData);
      throw new Error(errorMsg);
    }

    return await response.json();
  } catch (error) {
    console.error("Local Backend Error:", error);
    throw error;
  }
}
