// This in-memory array will store the expenses.
// IMPORTANT: In a true serverless environment, this data
// will be reset with every new function invocation.
// For persistent data, you must connect to a database.
let expenses = [
  { 
    id: 1, 
    amount: 50.00, 
    description: "Groceries for the week", 
    category: "Food", 
    date: "2025-12-01" 
  },
  { 
    id: 2, 
    amount: 15.50, 
    description: "Bus fare", 
    category: "Transportation", 
    date: "2025-12-02" 
  }
];

let nextId = expenses.length + 1;

/**
 * Main handler for the /api/expenses endpoint.
 * @param {import('@vercel/node').VercelRequest} req - The request object.
 * @param {import('@vercel/node').VercelResponse} res - The response object.
 */
export default async function handler(req, res) {
  // Set CORS headers for all responses (optional, but good practice)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle pre-flight CORS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // --- GET /api/expenses: Return all expenses ---
  if (req.method === 'GET') {
    return res.status(200).json(expenses);
  }

  // --- POST /api/expenses: Add a new expense ---
  if (req.method === 'POST') {
    const { amount, description, category, date } = req.body;

    // 1. Validate required fields
    if (!amount || !description || !category || !date) {
      return res.status(400).json({ 
        error: "Missing required fields: amount, description, category, and date are all necessary.",
        received: req.body 
      });
    }

    // 2. Validate data types (optional but highly recommended)
    if (typeof amount !== 'number' || isNaN(new Date(date))) {
      return res.status(400).json({ 
        error: "Invalid data types: 'amount' must be a number and 'date' must be a valid date string.",
      });
    }

    // 3. Create and add the new expense
    const newExpense = {
      id: nextId++,
      amount,
      description,
      category,
      date,
    };

    expenses.push(newExpense);

    // 4. Respond with the created expense and 201 status
    return res.status(201).json({ 
      message: "Expense successfully added.", 
      expense: newExpense 
    });
  }

  // --- Handle other methods ---
  // Return a 405 Method Not Allowed for any other HTTP method
  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ 
    error: `Method ${req.method} Not Allowed. Only GET and POST are supported.` 
  });
}
