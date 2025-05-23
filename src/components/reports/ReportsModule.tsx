
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReportsModuleProps {
  user: User;
}

// Sample data for demonstration
const journalEntries = [
  { id: '1', date: '2025-05-23', description: 'Daily Sales', debit: 12500, credit: 0, account: 'Revenue' },
  { id: '2', date: '2025-05-23', description: 'Daily Sales', debit: 0, credit: 12500, account: 'Cash' },
  { id: '3', date: '2025-05-22', description: 'Inventory Purchase', debit: 5000, credit: 0, account: 'Inventory' },
  { id: '4', date: '2025-05-22', description: 'Inventory Purchase', debit: 0, credit: 5000, account: 'Accounts Payable' },
  { id: '5', date: '2025-05-21', description: 'Rent Payment', debit: 2000, credit: 0, account: 'Rent Expense' },
  { id: '6', date: '2025-05-21', description: 'Rent Payment', debit: 0, credit: 2000, account: 'Cash' },
];

const incomeStatementData = [
  { category: 'Revenue', amount: 45000 },
  { category: 'Cost of Goods Sold', amount: -25000 },
  { category: 'Gross Profit', amount: 20000 },
  { category: 'Operating Expenses', amount: -12000 },
  { category: 'Net Income', amount: 8000 },
];

const balanceSheetData = {
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

const currencyRates = {
  USD: 1,
  KES: 130.5,
  EUR: 0.92,
  GBP: 0.78,
};

const chartData = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
];

export const ReportsModule = ({ user }: ReportsModuleProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'KES' | 'EUR' | 'GBP'>('USD');
  const currencySymbols = {
    USD: '$',
    KES: 'KSh',
    EUR: '€',
    GBP: '£',
  };

  const formatCurrency = (amount: number): string => {
    const convertedAmount = amount * currencyRates[selectedCurrency];
    return `${currencySymbols[selectedCurrency]} ${convertedAmount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-2xl font-bold">Reports & Analytics</h2>
        <div className="flex items-center space-x-4">
          <span className="text-gray-400">Currency:</span>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value as 'USD' | 'KES' | 'EUR' | 'GBP')}
            className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
          >
            <option value="USD">USD ($)</option>
            <option value="KES">KES (KSh)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
      </div>

      <Tabs defaultValue="journal" className="w-full">
        <TabsList className="bg-gray-700 text-white">
          <TabsTrigger value="journal">Journal Entries</TabsTrigger>
          <TabsTrigger value="income">Income Statement</TabsTrigger>
          <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
          <TabsTrigger value="ledger">Ledger</TabsTrigger>
          <TabsTrigger value="chart">Financial Charts</TabsTrigger>
        </TabsList>

        {/* Journal Entries Tab */}
        <TabsContent value="journal">
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Journal Entries</CardTitle>
              <CardDescription className="text-gray-400">Daily journal entries for accounting purposes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-gray-700 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-900">
                      <TableHead className="text-gray-300">Date</TableHead>
                      <TableHead className="text-gray-300">Description</TableHead>
                      <TableHead className="text-gray-300">Account</TableHead>
                      <TableHead className="text-gray-300 text-right">Debit</TableHead>
                      <TableHead className="text-gray-300 text-right">Credit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {journalEntries.map((entry) => (
                      <TableRow key={entry.id} className="border-gray-700">
                        <TableCell className="text-white">{entry.date}</TableCell>
                        <TableCell className="text-white">{entry.description}</TableCell>
                        <TableCell className="text-white">{entry.account}</TableCell>
                        <TableCell className="text-white text-right">
                          {entry.debit > 0 ? formatCurrency(entry.debit) : ''}
                        </TableCell>
                        <TableCell className="text-white text-right">
                          {entry.credit > 0 ? formatCurrency(entry.credit) : ''}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between mt-6">
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors">
                  Add Manual Entry
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
                  Export Journal
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Income Statement Tab */}
        <TabsContent value="income">
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Income Statement (P&L)</CardTitle>
              <CardDescription className="text-gray-400">For period: May 1, 2025 - May 23, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-gray-700 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-900">
                      <TableHead className="text-gray-300">Category</TableHead>
                      <TableHead className="text-gray-300 text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incomeStatementData.map((item, index) => (
                      <TableRow key={index} className={`border-gray-700 ${item.category === 'Gross Profit' || item.category === 'Net Income' ? 'bg-gray-700 font-bold' : ''}`}>
                        <TableCell className="text-white">{item.category}</TableCell>
                        <TableCell className={`text-right ${item.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatCurrency(item.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end mt-6">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
                  Export Statement
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Balance Sheet Tab */}
        <TabsContent value="balance">
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Balance Sheet</CardTitle>
              <CardDescription className="text-gray-400">As of May 23, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Assets Section */}
                <div className="rounded-md border border-gray-700 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-900">
                        <TableHead className="text-gray-300" colSpan={2}>Assets</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {balanceSheetData.assets.map((item, index) => (
                        <TableRow key={index} className={`border-gray-700 ${item.item === 'Total Assets' ? 'bg-gray-700 font-bold' : ''}`}>
                          <TableCell className="text-white">{item.item}</TableCell>
                          <TableCell className="text-right text-green-400">
                            {formatCurrency(item.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Liabilities & Equity Section */}
                <div className="space-y-6">
                  <div className="rounded-md border border-gray-700 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-900">
                          <TableHead className="text-gray-300" colSpan={2}>Liabilities</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {balanceSheetData.liabilities.map((item, index) => (
                          <TableRow key={index} className={`border-gray-700 ${item.item === 'Total Liabilities' ? 'bg-gray-700 font-bold' : ''}`}>
                            <TableCell className="text-white">{item.item}</TableCell>
                            <TableCell className="text-right text-red-400">
                              {formatCurrency(item.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="rounded-md border border-gray-700 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-900">
                          <TableHead className="text-gray-300" colSpan={2}>Equity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {balanceSheetData.equity.map((item, index) => (
                          <TableRow key={index} className={`border-gray-700 ${item.item === 'Total Equity' ? 'bg-gray-700 font-bold' : ''}`}>
                            <TableCell className="text-white">{item.item}</TableCell>
                            <TableCell className="text-right text-purple-400">
                              {formatCurrency(item.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
                  Export Balance Sheet
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ledger Tab */}
        <TabsContent value="ledger">
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Account Ledger</CardTitle>
              <CardDescription className="text-gray-400">
                <select className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 mt-2">
                  <option value="cash">Cash</option>
                  <option value="sales">Sales Revenue</option>
                  <option value="inventory">Inventory</option>
                  <option value="accounts-payable">Accounts Payable</option>
                  <option value="expenses">Operating Expenses</option>
                </select>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-gray-700 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-900">
                      <TableHead className="text-gray-300">Date</TableHead>
                      <TableHead className="text-gray-300">Description</TableHead>
                      <TableHead className="text-gray-300 text-right">Debit</TableHead>
                      <TableHead className="text-gray-300 text-right">Credit</TableHead>
                      <TableHead className="text-gray-300 text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="border-gray-700">
                      <TableCell className="text-white">2025-05-21</TableCell>
                      <TableCell className="text-white">Opening Balance</TableCell>
                      <TableCell className="text-white text-right"></TableCell>
                      <TableCell className="text-white text-right"></TableCell>
                      <TableCell className="text-white text-right">{formatCurrency(10000)}</TableCell>
                    </TableRow>
                    <TableRow className="border-gray-700">
                      <TableCell className="text-white">2025-05-21</TableCell>
                      <TableCell className="text-white">Rent Payment</TableCell>
                      <TableCell className="text-white text-right"></TableCell>
                      <TableCell className="text-white text-right">{formatCurrency(2000)}</TableCell>
                      <TableCell className="text-white text-right">{formatCurrency(8000)}</TableCell>
                    </TableRow>
                    <TableRow className="border-gray-700">
                      <TableCell className="text-white">2025-05-23</TableCell>
                      <TableCell className="text-white">Daily Sales</TableCell>
                      <TableCell className="text-white text-right">{formatCurrency(12500)}</TableCell>
                      <TableCell className="text-white text-right"></TableCell>
                      <TableCell className="text-white text-right">{formatCurrency(20500)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end mt-6">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
                  Export Ledger
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Charts Tab */}
        <TabsContent value="chart">
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Financial Performance</CardTitle>
              <CardDescription className="text-gray-400">Revenue vs. Expenses (2025)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer
                  config={{
                    revenue: { color: "#22C55E" },
                    expenses: { color: "#EF4444" },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#D1D5DB" />
                      <YAxis stroke="#D1D5DB" />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-gray-900 p-2 shadow-md border-gray-800">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-gray-400">
                                      Revenue
                                    </span>
                                    <span className="font-bold text-green-500">
                                      {formatCurrency(payload[0].value)}
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-gray-400">
                                      Expenses
                                    </span>
                                    <span className="font-bold text-red-500">
                                      {formatCurrency(payload[1].value)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="#22C55E" name="Revenue" />
                      <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <p className="text-gray-400 text-sm">User: {user.name} ({user.role})</p>
    </div>
  );
};
