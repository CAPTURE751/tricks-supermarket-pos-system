
import { useState } from 'react';
import { mockPurchaseOrders, mockSupplierReturns } from '../data/mockData';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { User } from '@/hooks/useAuth';
import { FileDown, Calendar, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PurchaseReportsProps {
  user: User;
}

// Prepare data for monthly purchases chart
const getMonthlyPurchasesData = () => {
  const monthlyData = [
    { name: 'Jan', purchases: 45200 },
    { name: 'Feb', purchases: 38500 },
    { name: 'Mar', purchases: 52300 },
    { name: 'Apr', purchases: 41700 },
    { name: 'May', purchases: 55800 },
    { name: 'Jun', purchases: 46900 },
  ];
  
  return monthlyData;
};

// Prepare data for supplier distribution chart
const getSupplierDistributionData = () => {
  const supplierData = [
    { name: 'Coca-Cola Distributors', value: 35 },
    { name: 'Fresh Bakeries Kenya', value: 25 },
    { name: 'Kenya Grain Processors', value: 20 },
    { name: 'Dairy Fresh Products', value: 15 },
    { name: 'Others', value: 5 },
  ];
  
  return supplierData;
};

// Pie chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const PurchaseReports = ({ user }: PurchaseReportsProps) => {
  const [reportPeriod, setReportPeriod] = useState('this_month');
  const [reportType, setReportType] = useState('summary');
  
  const monthlyData = getMonthlyPurchasesData();
  const supplierData = getSupplierDistributionData();

  // Handle export report
  const handleExportReport = () => {
    toast.info(`Exporting ${reportType} report for ${reportPeriod}`);
  };

  // Handle print report
  const handlePrintReport = () => {
    toast.info(`Printing ${reportType} report for ${reportPeriod}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Purchase Reports</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Purchase Summary</SelectItem>
                <SelectItem value="supplier">Supplier Wise</SelectItem>
                <SelectItem value="product">Product Wise</SelectItem>
                <SelectItem value="status">Purchase Status</SelectItem>
                <SelectItem value="payment">Payment Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={reportPeriod} onValueChange={setReportPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this_week">This Week</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
                <SelectItem value="this_quarter">This Quarter</SelectItem>
                <SelectItem value="this_year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleExportReport}
            >
              <FileDown className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handlePrintReport}
            >
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase Summary</CardTitle>
            <CardDescription>Overview of purchases for the current period</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Purchases</p>
                <p className="text-2xl font-bold">KSh 280,440</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Number of Orders</p>
                <p className="text-2xl font-bold">28</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Average Order Value</p>
                <p className="text-2xl font-bold">KSh 10,016</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Returns Value</p>
                <p className="text-2xl font-bold text-red-600">KSh 15,600</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Payment Status Distribution</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-100 p-3 rounded-md">
                  <p className="text-xs text-gray-500">Paid</p>
                  <p className="text-lg font-bold">18</p>
                  <p className="text-xs text-gray-500">64%</p>
                </div>
                <div className="bg-amber-100 p-3 rounded-md">
                  <p className="text-xs text-amber-800">Partially Paid</p>
                  <p className="text-lg font-bold">5</p>
                  <p className="text-xs text-amber-800">18%</p>
                </div>
                <div className="bg-red-100 p-3 rounded-md">
                  <p className="text-xs text-red-800">Unpaid</p>
                  <p className="text-lg font-bold">5</p>
                  <p className="text-xs text-red-800">18%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Monthly Purchases Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Purchases</CardTitle>
            <CardDescription>Purchases trend over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={monthlyData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `KSh ${Number(value).toLocaleString()}`} />
                <Legend />
                <Bar dataKey="purchases" fill="#8884d8" name="Purchase Value" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Supplier Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Supplier Distribution</CardTitle>
            <CardDescription>Purchase distribution by supplier</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={supplierData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {supplierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Recent Purchase Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchase Orders</CardTitle>
            <CardDescription>Last 5 purchase orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPurchaseOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">{order.supplierName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">KSh {order.total.toLocaleString()}</p>
                    <p className="text-xs">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        order.status === 'received' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'partially_received'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status === 'partially_received' ? 'Partial' : order.status}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
