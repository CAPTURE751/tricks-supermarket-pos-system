
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, LineChart, BarChart } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockCustomers } from '../data/mockData';

interface CustomerReportsProps {
  user: User;
}

export const CustomerReports = ({ user }: CustomerReportsProps) => {
  const [dateRange, setDateRange] = useState('month');
  
  // Mock data for charts
  const customerGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'New Customers',
        data: [3, 5, 2, 8, 4],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.3,
      }
    ]
  };
  
  const customerSpendingData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Average Spending (KSh)',
        data: [1500, 1800, 1600, 2200, 2500],
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
      }
    ]
  };
  
  // Sort customers by total spent (descending)
  const topCustomers = [...mockCustomers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);
  
  const customersWithDebt = mockCustomers.filter(c => c.outstandingBalance > 0);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Customer Reports</h2>
          <p className="text-gray-400">Insights and analytics about your customer base</p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant={dateRange === 'month' ? 'default' : 'outline'}
            onClick={() => setDateRange('month')}
          >
            Month
          </Button>
          <Button 
            variant={dateRange === 'quarter' ? 'default' : 'outline'}
            onClick={() => setDateRange('quarter')}
          >
            Quarter
          </Button>
          <Button 
            variant={dateRange === 'year' ? 'default' : 'outline'}
            onClick={() => setDateRange('year')}
          >
            Year
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle>Customer Growth</CardTitle>
            <CardDescription className="text-gray-400">
              New customer registrations over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer 
              config={{}} 
              className="aspect-[4/3]"
            >
              <LineChart 
                data={customerGrowthData}
                className="text-white"
                options={{
                  scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: 'white' } },
                    x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: 'white' } }
                  },
                  plugins: {
                    legend: { labels: { color: 'white' } }
                  }
                }}
              />
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle>Average Customer Spending</CardTitle>
            <CardDescription className="text-gray-400">
              Average spend per customer over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer 
              config={{}} 
              className="aspect-[4/3]"
            >
              <BarChart 
                data={customerSpendingData}
                className="text-white"
                options={{
                  scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: 'white' } },
                    x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: 'white' } }
                  },
                  plugins: {
                    legend: { labels: { color: 'white' } }
                  }
                }}
              />
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle>Customer Demographics</CardTitle>
            <CardDescription className="text-gray-400">
              Breakdown of customer categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2">
                <span>Total Customers</span>
                <span className="font-bold text-xl">{mockCustomers.length}</span>
              </div>
              
              <div>
                <h4 className="mb-2 font-semibold">Customer Categories</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                      VIP
                    </span>
                    <span>{mockCustomers.filter(c => c.category === 'VIP').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                      Regular
                    </span>
                    <span>{mockCustomers.filter(c => c.category === 'Regular').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      Wholesale
                    </span>
                    <span>{mockCustomers.filter(c => c.category === 'Wholesale').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
                      Walk-in
                    </span>
                    <span>{mockCustomers.filter(c => c.category === 'Walk-in').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                      New
                    </span>
                    <span>{mockCustomers.filter(c => c.category === 'New').length}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="mb-2 font-semibold">Loyalty Status</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-amber-600 rounded-full mr-2"></span>
                      Bronze
                    </span>
                    <span>{mockCustomers.filter(c => c.totalSpent < 10000).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                      Silver
                    </span>
                    <span>{mockCustomers.filter(c => c.totalSpent >= 10000 && c.totalSpent < 50000).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                      Gold
                    </span>
                    <span>{mockCustomers.filter(c => c.totalSpent >= 50000 && c.totalSpent < 100000).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-gray-300 rounded-full mr-2"></span>
                      Platinum
                    </span>
                    <span>{mockCustomers.filter(c => c.totalSpent >= 100000).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle>Top Spending Customers</CardTitle>
            <CardDescription className="text-gray-400">
              Customers with highest lifetime value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-gray-700">
                <TableRow className="border-gray-600">
                  <TableHead>Customer</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Last Purchase</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCustomers.map((customer) => (
                  <TableRow key={customer.id} className="border-gray-600">
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>
                      <span className={`
                        px-2 py-1 rounded-full text-xs
                        ${customer.category === 'VIP' ? 'bg-purple-900 text-purple-200' : ''}
                        ${customer.category === 'Regular' ? 'bg-blue-900 text-blue-200' : ''}
                        ${customer.category === 'Wholesale' ? 'bg-green-900 text-green-200' : ''}
                        ${customer.category === 'Walk-in' ? 'bg-gray-700 text-gray-300' : ''}
                        ${customer.category === 'New' ? 'bg-yellow-900 text-yellow-200' : ''}
                      `}>
                        {customer.category}
                      </span>
                    </TableCell>
                    <TableCell className="font-bold">KSh {customer.totalSpent.toFixed(2)}</TableCell>
                    <TableCell>{customer.lastPurchase ? new Date(customer.lastPurchase).toLocaleDateString() : 'Never'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Credit & Outstanding Balances</CardTitle>
          <CardDescription className="text-gray-400">
            Customers with outstanding balances
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customersWithDebt.length > 0 ? (
            <Table>
              <TableHeader className="bg-gray-700">
                <TableRow className="border-gray-600">
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Total Outstanding</TableHead>
                  <TableHead>Credit Limit</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customersWithDebt.map((customer) => (
                  <TableRow key={customer.id} className="border-gray-600">
                    <TableCell className="font-medium">{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell className="text-red-400">KSh {customer.outstandingBalance.toFixed(2)}</TableCell>
                    <TableCell>
                      {customer.creditLimit 
                        ? `KSh ${customer.creditLimit.toFixed(2)}` 
                        : 'No limit set'}
                    </TableCell>
                    <TableCell>
                      <Button size="sm">Send Reminder</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No customers with outstanding balances</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          Export Reports
        </Button>
        <Button>
          Generate Full Report
        </Button>
      </div>
    </div>
  );
};
