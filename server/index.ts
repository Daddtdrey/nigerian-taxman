import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env variables manually since we are outside Vite's normal process here
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

app.post('/api/gemini/extract', async (req, res) => {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server missing Gemini API Key' });
  }

  const { text } = req.body;

  const prompt = `
You are a financial AI analyzing a Nigerian bank statement.
Convert the following unstructured text from a PDF statement into a structured JSON array of transactions.

Rules:
1. Return ONLY valid JSON. The output must be an array of objects. Do not wrap in markdown \`\`\`json blocks. Just the array itself.
2. If Date is missing, generate a reasonable placeholder or ignore row.
3. Make sure Amount is a number.
4. Type must be exactly "credit" or "debit".
5. Do not include your own explanations.

Structure each generic object strictly as follows:
{ "id": "unique-uuid", "date": "YYYY-MM-DD", "description": "Transaction details", "amount": 10000.50, "type": "credit" | "debit" }

Raw Bank Statement Text:
${text.substring(0, 15000)}
  `.trim();

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey.trim()}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Referer': req.headers.referer || req.headers.origin || 'http://localhost:3000'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/gemini/classify', async (req, res) => {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server missing Gemini API Key' });
  }

  const { transactions } = req.body;

  const prompt = `
You are an expert tax assessor reviewing Nigerian bank statements based on the NTA 2026.
You are given a JSON array of transactions representing all bank "crebits" and "debits".
Your job is to identify which "credit" transactions constitute actual taxable "Income".

Rules for Income Categorization:
1. "debit" transactions are ALWAYS isIncome: false.
2. Transfer between own accounts (e.g. 'Transfer from self', 'Reversal') are NOT income.
3. Refunds and failed transactions are NOT income.
4. Loan disbursals or borrowings are NOT income.
5. Freelance payments, salaries, external consulting credits, unknown POS deposits, tech contracts ARE income.
6. Returns ONLY a valid JSON array matching the exact input payload, but with the boolean property \`isIncome\` accurately appended to every object. Do not wrap in \`\`\`json markdown blocks.

Input JSON:
${JSON.stringify(transactions, null, 2)}
  `.trim();

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey.trim()}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Referer': req.headers.referer || req.headers.origin || 'http://localhost:3000'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Secure API Server running on http://localhost:${PORT}`);
});
