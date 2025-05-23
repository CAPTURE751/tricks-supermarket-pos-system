
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ReportsTabProps {
  user: User;
}

// Mock data for reports
const salesData = [
  { date: '01/05', sales: 12500, transactions: 125 },
  { date: '02/05', sales: 14200, transactions: 142 },
  { date: '03/05', sales: 10800, transactions: 108 },
  { date: '04/05', sales: 11500, transactions: 115 },
  { date: '05/05', sales: 15300, transactions: 153 },
  { date: '06/05', sales: 13200, transactions: 132 },
  { date: '07/05', sales: 9800, transactions: 98 },
];

const userPerformance = [
  { name: 'John Smith', sales: 45200, transactions: 452 },
  { name: 'Mary Johnson', sales: 38600, transactions: 386 },
  { name: 'Bob Williams', sales: 32100, transactions: 321 },
  { name: 'Alice Brown', sales: 28500, transactions: 285 },
  { name: 'David Lee', sales: 23700, transactions: 237 },
];

const inventoryData = [
  { category: 'Groceries', itemsCount: 120, value: 25000, lowStock: 8 },
  { category: 'Electronics', itemsCount: 45, value: 85000, lowStock: 3 },
  { category: 'Clothing', itemsCount: 78, value: 32000, lowStock: 5 },
  { category: 'Home Goods', itemsCount: 64, value: 41000, lowStock: 4 },
  { category: 'Beauty', itemsCount: 92, value: 18500, lowStock: 7 },
];

export const ReportsTab = ({ user }: ReportsTabProps) => {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('7days');
  const [branch, setBranch] = useState('all');
  
  const generateReport = (format: 'pdf' | 'excel') => {
    // In a real application, this would generate and download a report
    console.log(`Generating ${reportType} report in ${format} format`);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Admin Reports</CardTitle>
          <CardDescription className="text-gray-400">
            View and export administrative reports for your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Report Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reportType" className="text-gray-300">Report Type</Label>
                <Select 
                  value={reportType} 
                  onValueChange={setReportType}
                >
                  <SelectTrigger id="reportType" className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="sales">Sales Performance</SelectItem>
                    <SelectItem value="staff">Staff Performance</SelectItem>
                    <SelectItem value="inventory">Inventory Status</SelectItem>
                    <SelectItem value="system">System Activity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateRange" className="text-gray-300">Date Range</Label>
                <Select 
                  value={dateRange} 
                  onValueChange={setDateRange}
                >
                  <SelectTrigger id="dateRange" className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="branch" className="text-gray-300">Branch</Label>
                <Select 
                  value={branch} 
                  onValueChange={setBranch}
                >
                  <SelectTrigger id="branch" className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="all">All Branches</SelectItem>
                    <SelectItem value="1">Main Branch</SelectItem>
                    <SelectItem value="2">Downtown Shop</SelectItem>
                    <SelectItem value="3">Westside Mall</SelectItem>
                    <SelectItem value="4">Airport Shop</SelectItem>
                    <SelectItem value="5">East End</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Report Content */}
            <Tabs defaultValue="charts" className="w-full">
              <TabsList className="bg-gray-700 border-gray-600">
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="charts" className="pt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {reportType === 'sales' && (
                    <>
                      <Card className="bg-gray-700 border-gray-600">
                        <CardHeader>
                          <CardTitle className="text-white text-base">Sales Trend</CardTitle>
                          <CardDescription className="text-gray-400">
                            Daily sales amount over time
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={salesData}>
                              <XAxis 
                                dataKey="date" 
                                stroke="#888888" 
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                              />
                              <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `KSH ${value / 1000}k`}
                              />
                              <Tooltip
                                formatter={(value: number) => [`KSH ${value.toLocaleString()}`, "Sales"]}
                                contentStyle={{ backgroundColor: "#1E1E1E", borderColor: "#2E2E2E" }}
                                labelStyle={{ color: "#E0E0E0" }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="sales" 
                                stroke="#00C853" 
                                strokeWidth={2} 
                                dot={{ fill: "#00C853", r: 4 }}
                                activeDot={{ r: 6 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gray-700 border-gray-600">
                        <CardHeader>
                          <CardTitle className="text-white text-base">Transaction Count</CardTitle>
                          <CardDescription className="text-gray-400">
                            Number of transactions per day
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={salesData}>
                              <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                              />
                              <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                              />
                              <Tooltip
                                formatter={(value: number) => [`${value} transactions`, "Count"]}
                                contentStyle={{ backgroundColor: "#1E1E1E", borderColor: "#2E2E2E" }}
                                labelStyle={{ color: "#E0E0E0" }}
                              />
                              <Bar dataKey="transactions" fill="#FFAB00" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </>
                  )}
                  
                  {reportType === 'staff' && (
                    <>
                      <Card className="bg-gray-700 border-gray-600">
                        <CardHeader>
                          <CardTitle className="text-white text-base">Staff Sales Performance</CardTitle>
                          <CardDescription className="text-gray-400">
                            Total sales by staff member
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={userPerformance} layout="vertical">
                              <XAxis type="number" stroke="#888888" fontSize={12} />
                              <YAxis
                                dataKey="name"
                                type="category"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                              />
                              <Tooltip
                                formatter={(value: number) => [`KSH ${value.toLocaleString()}`, "Sales"]}
                                contentStyle={{ backgroundColor: "#1E1E1E", borderColor: "#2E2E2E" }}
                                labelStyle={{ color: "#E0E0E0" }}
                              />
                              <Bar dataKey="sales" fill="#00C853" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gray-700 border-gray-600">
                        <CardHeader>
                          <CardTitle className="text-white text-base">Staff Transaction Count</CardTitle>
                          <CardDescription className="text-gray-400">
                            Number of transactions processed by staff
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={userPerformance} layout="vertical">
                              <XAxis type="number" stroke="#888888" fontSize={12} />
                              <YAxis
                                dataKey="name"
                                type="category"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                              />
                              <Tooltip
                                formatter={(value: number) => [`${value} transactions`, "Count"]}
                                contentStyle={{ backgroundColor: "#1E1E1E", borderColor: "#2E2E2E" }}
                                labelStyle={{ color: "#E0E0E0" }}
                              />
                              <Bar dataKey="transactions" fill="#FFAB00" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </>
                  )}
                  
                  {reportType === 'inventory' && (
                    <>
                      <Card className="bg-gray-700 border-gray-600">
                        <CardHeader>
                          <CardTitle className="text-white text-base">Inventory Value by Category</CardTitle>
                          <CardDescription className="text-gray-400">
                            Total value of inventory per category
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={inventoryData}>
                              <XAxis
                                dataKey="category"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                              />
                              <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `KSH ${value / 1000}k`}
                              />
                              <Tooltip
                                formatter={(value: number) => [`KSH ${value.toLocaleString()}`, "Value"]}
                                contentStyle={{ backgroundColor: "#1E1E1E", borderColor: "#2E2E2E" }}
                                labelStyle={{ color: "#E0E0E0" }}
                              />
                              <Bar dataKey="value" fill="#00C853" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gray-700 border-gray-600">
                        <CardHeader>
                          <CardTitle className="text-white text-base">Low Stock Items by Category</CardTitle>
                          <CardDescription className="text-gray-400">
                            Number of low stock items per category
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={inventoryData}>
                              <XAxis
                                dataKey="category"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                              />
                              <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                              />
                              <Tooltip
                                formatter={(value: number) => [`${value} items`, "Low Stock"]}
                                contentStyle={{ backgroundColor: "#1E1E1E", borderColor: "#2E2E2E" }}
                                labelStyle={{ color: "#E0E0E0" }}
                              />
                              <Bar dataKey="lowStock" fill="#D32F2F" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </>
                  )}
                  
                  {reportType === 'system' && (
                    <Card className="bg-gray-700 border-gray-600 col-span-2">
                      <CardHeader>
                        <CardTitle className="text-white text-base">System Activity Report</CardTitle>
                        <CardDescription className="text-gray-400">
                          Placeholder for system activity reports
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-72 flex items-center justify-center">
                        <p className="text-gray-400">System activity visualization will be displayed here</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="summary" className="pt-4">
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-white">Report Summary</CardTitle>
                    <CardDescription className="text-gray-400">
                      Key metrics and insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reportType === 'sales' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-gray-400 text-sm">Total Sales</div>
                            <div className="text-white text-2xl font-bold">KSH 77,300</div>
                            <div className="text-green-500 text-sm">+5.2% from previous period</div>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-gray-400 text-sm">Transaction Count</div>
                            <div className="text-white text-2xl font-bold">773</div>
                            <div className="text-green-500 text-sm">+3.8% from previous period</div>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-gray-400 text-sm">Average Transaction</div>
                            <div className="text-white text-2xl font-bold">KSH 100.00</div>
                            <div className="text-green-500 text-sm">+1.3% from previous period</div>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-gray-400 text-sm">Peak Sales Day</div>
                            <div className="text-white text-2xl font-bold">May 5th</div>
                            <div className="text-white text-sm">KSH 15,300 (153 transactions)</div>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-gray-400 text-sm">Lowest Sales Day</div>
                            <div className="text-white text-2xl font-bold">May 7th</div>
                            <div className="text-white text-sm">KSH 9,800 (98 transactions)</div>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-gray-400 text-sm">Forecast (Next 7 Days)</div>
                            <div className="text-white text-2xl font-bold">KSH 80,500</div>
                            <div className="text-green-500 text-sm">+4.1% projected increase</div>
                          </div>
                        </div>
                      )}
                      
                      {reportType === 'staff' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-gray-400 text-sm">Top Performer</div>
                            <div className="text-white text-2xl font-bold">John Smith</div>
                            <div className="text-white text-sm">KSH 45,200 (452 transactions)</div>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-gray-400 text-sm">Average Per Staff</div>
                            <div className="text-white text-2xl font-bold">KSH 33,620</div>
                            <div className="text-white text-sm">336 transactions</div>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-gray-400 text-sm">Performance Gap</div>
                            <div className="text-white text-2xl font-bold">KSH 21,500</div>
                            <div className="text-white text-sm">Between top and bottom performer</div>
                          </div>
                        </div>
                      )}
                      
                      {reportType === 'inventory' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-gray-400 text-sm">Total Inventory Value</div>
                            <div className="text-white text-2xl font-bold">KSH 201,500</div>
                            <div className="text-white text-sm">Across 399 items</div>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-gray-400 text-sm">Top Category</div>
                            <div className="text-white text-2xl font-bold">Electronics</div>
                            <div className="text-white text-sm">KSH 85,000 (45 items)</div>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-gray-400 text-sm">Low Stock Items</div>
                            <div className="text-white text-2xl font-bold">27</div>
                            <div className="text-red-500 text-sm">Requires attention</div>
                          </div>
                        </div>
                      )}
                      
                      {reportType === 'system' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-gray-400 text-sm">Login Sessions</div>
                            <div className="text-white text-2xl font-bold">248</div>
                            <div className="text-white text-sm">Last 7 days</div>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-gray-400 text-sm">Data Operations</div>
                            <div className="text-white text-2xl font-bold">1,432</div>
                            <div className="text-white text-sm">Create/Update/Delete</div>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-gray-400 text-sm">Error Rate</div>
                            <div className="text-white text-2xl font-bold">0.2%</div>
                            <div className="text-green-500 text-sm">Below threshold (1%)</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="details" className="pt-4">
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-white">Detailed Report</CardTitle>
                    <CardDescription className="text-gray-400">
                      Export full details as PDF or Excel
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">
                      This detailed report contains all metrics and data points for the selected parameters.
                      Export the report to view all information.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-white font-semibold mb-2">Report Parameters</h3>
                        <p className="text-gray-300">Report Type: <span className="text-white capitalize">{reportType}</span></p>
                        <p className="text-gray-300">Date Range: <span className="text-white">{dateRange === '7days' ? 'Last 7 Days' : dateRange === '30days' ? 'Last 30 Days' : dateRange === '90days' ? 'Last 90 Days' : dateRange === 'today' ? 'Today' : 'Custom'}</span></p>
                        <p className="text-gray-300">Branch: <span className="text-white">{branch === 'all' ? 'All Branches' : `Branch ID ${branch}`}</span></p>
                      </div>
                      
                      <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <p className="text-gray-300">
                          The exported report will contain detailed data tables and breakdowns 
                          not shown in the summary view.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2 border-t border-gray-600 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => generateReport('excel')}
                      className="border-gray-600 hover:bg-gray-600 text-white"
                    >
                      Export to Excel
                    </Button>
                    <Button 
                      onClick={() => generateReport('pdf')}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Export to PDF
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
