
export const journalEntries = [
  { id: '1', date: '2025-05-23', description: 'Daily Sales', debit: 12500, credit: 0, account: 'Revenue' },
  { id: '2', date: '2025-05-23', description: 'Daily Sales', debit: 0, credit: 12500, account: 'Cash' },
  { id: '3', date: '2025-05-22', description: 'Inventory Purchase', debit: 5000, credit: 0, account: 'Inventory' },
  { id: '4', date: '2025-05-22', description: 'Inventory Purchase', debit: 0, credit: 5000, account: 'Accounts Payable' },
  { id: '5', date: '2025-05-21', description: 'Rent Payment', debit: 2000, credit: 0, account: 'Rent Expense' },
  { id: '6', date: '2025-05-21', description: 'Rent Payment', debit: 0, credit: 2000, account: 'Cash' },
];

export const incomeStatementData = [
  { category: 'Revenue', amount: 45000 },
  { category: 'Cost of Goods Sold', amount: -25000 },
  { category: 'Gross Profit', amount: 20000 },
  { category: 'Operating Expenses', amount: -12000 },
  { category: 'Net Income', amount: 8000 },
];

export const balanceSheetData = {
  assets: [
    { item: 'Cash', amount: 15000 },
    { item: 'Accounts Receivable', amount: 8500 },
    { item: 'Inventory', amount: 22000 },
    { item: 'Total Assets', amount: 45500 },
  ],
  liabilities: [
    { item: 'Accounts Payable', amount: 7500 },
    { item: 'Short-term Loans', amount: 10000 },
    { item: 'Total Liabilities', amount: 17500 },
  ],
  equity: [
    { item: 'Owner\'s Capital', amount: 20000 },
    { item: 'Retained Earnings', amount: 8000 },
    { item: 'Total Equity', amount: 28000 },
  ]
};

export const chartData = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
];

export const currencyRates = {
  USD: 1,
  KES: 130.5,
  EUR: 0.92,
  GBP: 0.78,
};

export const currencySymbols = {
  USD: '$',
  KES: 'KSh',
  EUR: '€',
  GBP: '£',
};
