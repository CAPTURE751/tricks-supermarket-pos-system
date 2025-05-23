
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { CartItem, Customer } from './SalesModule';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Calendar, FileText, ArrowDown, ArrowUp } from 'lucide-react';

interface SaleRecord {
  id: string;
  date: Date;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  cashier: string;
  customer?: Customer;
  receiptNumber: string;
  status: 'completed' | 'voided' | 'refunded';
}

interface SaleHistoryProps {
  user: User;
}

// Sample sales history data - in a real app, this would come from an API
const sampleSalesHistory: SaleRecord[] = [
  {
    id: 'sale-001',
    date: new Date(2023, 4, 15, 10, 30),
    items: [
      { id: '1', name: 'Coca-Cola 500ml', price: 80, category: 'Drinks', stock: 50, quantity: 3 },
      { id: '4', name: 'Rice 2kg', price: 350, category: 'Grains', stock: 15, quantity: 1 }
    ],
    total: 590,
    paymentMethod: 'cash',
    cashier: 'John Admin',
    receiptNumber: 'R123456',
    status: 'completed'
  },
  {
    id: 'sale-002',
    date: new Date(2023, 4, 15, 11, 45),
    items: [
      { id: '2', name: 'Bread Loaf', price: 60, category: 'Bakery', stock: 25, quantity: 2 },
      { id: '3', name: 'Milk 1L', price: 120, category: 'Dairy', stock: 30, quantity: 1 },
      { id: '5', name: 'Cooking Oil 1L', price: 280, category: 'Cooking', stock: 20, quantity: 1 }
    ],
    total: 520,
    paymentMethod: 'mpesa',
    cashier: 'Jane Cashier',
    customer: { id: '2', name: 'Jane Smith', phone: '+254723456789', loyaltyPoints: 85 },
    receiptNumber: 'R123457',
    status: 'completed'
  },
  {
    id: 'sale-003',
    date: new Date(2023, 4, 16, 9, 15),
    items: [
      { id: '6', name: 'Sugar 1kg', price: 150, category: 'Pantry', stock: 40, quantity: 2 }
    ],
    total: 300,
    paymentMethod: 'card',
    cashier: 'John Admin',
    receiptNumber: 'R123458',
    status: 'voided'
  }
];

export const SaleHistory = ({ user }: SaleHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null);

  // Filter and sort sales history
  const filteredSales = sampleSalesHistory
    .filter(sale => {
      // Search filter
      const searchMatch = 
        sale.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sale.customer && sale.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        searchTerm === '';
      
      // Date filter
      let dateMatch = true;
      const today = new Date();
      if (dateFilter === 'today') {
        dateMatch = sale.date.toDateString() === today.toDateString();
      } else if (dateFilter === 'yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        dateMatch = sale.date.toDateString() === yesterday.toDateString();
      } else if (dateFilter === 'thisWeek') {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        dateMatch = sale.date >= startOfWeek;
      }

      // Payment method filter
      const paymentMatch = paymentFilter === 'all' || sale.paymentMethod === paymentFilter;
      
      // Status filter
      const statusMatch = statusFilter === 'all' || sale.status === statusFilter;
      
      return searchMatch && dateMatch && paymentMatch && statusMatch;
    })
    .sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'asc' 
          ? a.date.getTime() - b.date.getTime()
          : b.date.getTime() - a.date.getTime();
      } else if (sortField === 'total') {
        return sortDirection === 'asc' 
          ? a.total - b.total
          : b.total - a.total;
      }
      return 0;
    });

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-KE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold">Sale History</h2>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by receipt or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full md:w-auto"
                />
              </div>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[120px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="thisWeek">This Week</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="mpesa">M-Pesa</SelectItem>
                  <SelectItem value="airtel">Airtel Money</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="voided">Voided</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4">
                    <div className="flex items-center cursor-pointer" onClick={() => toggleSort('date')}>
                      Date & Time
                      {sortField === 'date' && (
                        sortDirection === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="text-left py-3 px-4">Receipt</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Cashier</th>
                  <th className="text-left py-3 px-4">Payment</th>
                  <th className="text-left py-3 px-4">
                    <div className="flex items-center cursor-pointer" onClick={() => toggleSort('total')}>
                      Total
                      {sortField === 'total' && (
                        sortDirection === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.length > 0 ? (
                  filteredSales.map(sale => (
                    <tr 
                      key={sale.id} 
                      className={`
                        border-b border-gray-700 hover:bg-gray-700/50 transition-colors
                        ${sale.status === 'voided' ? 'opacity-60' : ''}
                        ${sale.status === 'refunded' ? 'text-yellow-400' : ''}
                      `}
                    >
                      <td className="py-3 px-4">{formatDate(sale.date)}</td>
                      <td className="py-3 px-4">{sale.receiptNumber}</td>
                      <td className="py-3 px-4">{sale.customer ? sale.customer.name : 'Walk-in Customer'}</td>
                      <td className="py-3 px-4">{sale.cashier}</td>
                      <td className="py-3 px-4 capitalize">{sale.paymentMethod}</td>
                      <td className="py-3 px-4 font-semibold">KSh {sale.total.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`
                          px-2 py-1 rounded-full text-xs capitalize
                          ${sale.status === 'completed' ? 'bg-green-500/20 text-green-400' : ''}
                          ${sale.status === 'voided' ? 'bg-red-500/20 text-red-400' : ''}
                          ${sale.status === 'refunded' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                        `}>
                          {sale.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => setSelectedSale(sale)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-400">
                      No sales found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* This would be expanded with receipt viewing and printing functionality */}
      {selectedSale && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Receipt Details</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedSale(null)}
              >
                Close
              </Button>
            </div>
            
            <div className="bg-white text-black p-6 rounded-lg font-mono text-sm">
              <div className="text-center mb-4">
                <h2 className="font-bold text-lg">JEFF TRICKS SUPERMARKET</h2>
                <p>Receipt #{selectedSale.receiptNumber}</p>
                <p>{formatDate(selectedSale.date)}</p>
                <p>Cashier: {selectedSale.cashier}</p>
              </div>

              <div className="mb-4">
                <div className="border-b border-black pb-2 mb-2">
                  <div className="flex justify-between font-bold">
                    <span>ITEM</span>
                    <span>QTY</span>
                    <span>PRICE</span>
                    <span>TOTAL</span>
                  </div>
                </div>
                
                {selectedSale.items.map(item => (
                  <div key={item.id} className="mb-1">
                    <div className="flex justify-between">
                      <span className="flex-1 truncate">{item.name}</span>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <span className="w-16 text-right">{item.price.toFixed(2)}</span>
                      <span className="w-16 text-right">{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-black pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>TOTAL:</span>
                  <span>KSh {selectedSale.total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between mt-2">
                  <span>Payment ({selectedSale.paymentMethod}):</span>
                  <span>KSh {selectedSale.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <Button>Print Receipt</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
