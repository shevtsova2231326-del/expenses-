// api/expenses.js

// This data will reset on every new function cold start.
let expenses = [
  { id: 1, amount: 50.00, description: "Groceries for the week", category: "Food", date: "2025-12-01" },
  { id: 2, amount: 15.50, description: "Bus fare", category: "Transportation", date: "2025-12-02" }
];
let nextId = expenses.length + 1;

export default async function handler(req, res) {
  // CORS setup (Vercel often handles this, but it's good practice)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // --- GET /api/expenses ---
  if (req.method === 'GET') {
    // Return the array directly.
    return res.status(200).json(expenses); 
  }

  // --- POST /api/expenses ---
  if (req.method === 'POST') {
    const { amount, description, category, date } = req.body;

    // 1. Validation
    if (!amount || !description || !category || !date) {
      return res.status(400).json({ 
        error: "Missing required fields: amount, description, category, and date.",
      });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || isNaN(new Date(date))) {
      return res.status(400).json({ 
        error: "Invalid data types: 'amount' must be a number and 'date' must be a valid date string.",
      });
    }

    // 2. Add Expense
    const newExpense = {
      id: nextId++,
      amount: numericAmount,
      description,
      category,
      date,
    };
    expenses.push(newExpense);

    // 3. Respond
    return res.status(201).json({ 
      message: "Expense successfully added.", 
      expense: newExpense 
    });
  }

  // --- Method Not Allowed ---
  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ 
    error: `Method ${req.method} Not Allowed.` 
  });
}
