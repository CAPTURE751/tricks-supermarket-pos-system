
import { useState, useEffect } from 'react';
import { User } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Calendar, FileText, ArrowDown, ArrowUp, RefreshCw } from 'lucide-react';
import { useSales } from '@/hooks/useSales';
import { SaleWithItems } from '@/services/sales-service';

interface SaleHistoryProps {
  user: User;
}

export const SaleHistory = ({ user }: SaleHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedSale, setSelectedSale] = useState<SaleWithItems | null>(null);

  const { salesHistory, loading, refetchSalesHistory } = useSales();

  // Filter and sort sales history
  const filteredSales = salesHistory
    .filter(sale => {
      // Search filter
      const searchMatch = 
        sale.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sale.customer_name && sale.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        searchTerm === '';
      
      // Date filter
      let dateMatch = true;
      const today = new Date();
      const saleDate = new Date(sale.created_at);
      
      if (dateFilter === 'today') {
        dateMatch = saleDate.toDateString() === today.toDateString();
      } else if (dateFilter === 'yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        dateMatch = saleDate.toDateString() === yesterday.toDateString();
      } else if (dateFilter === 'thisWeek') {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        dateMatch = saleDate >= startOfWeek;
      }

      // Payment method filter
      const paymentMatch = paymentFilter === 'all' || sale.payment_method === paymentFilter;
      
      // Status filter
      const statusMatch = statusFilter === 'all' || sale.status === statusFilter;
      
      return searchMatch && dateMatch && paymentMatch && statusMatch;
    })
    .sort((a, b) => {
      if (sortField === 'created_at') {
        return sortDirection === 'asc' 
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortField === 'total_amount') {
        return sortDirection === 'asc' 
          ? a.total_amount - b.total_amount
          : b.total_amount - a.total_amount;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-KE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-gray-400">Loading sales history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold">Sale History ({salesHistory.length} sales)</h2>
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

              <Button onClick={refetchSalesHistory} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
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
                    <div className="flex items-center cursor-pointer" onClick={() => toggleSort('created_at')}>
                      Date & Time
                      {sortField === 'created_at' && (
                        sortDirection === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="text-left py-3 px-4">Receipt</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Payment</th>
                  <th className="text-left py-3 px-4">
                    <div className="flex items-center cursor-pointer" onClick={() => toggleSort('total_amount')}>
                      Total
                      {sortField === 'total_amount' && (
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
                      <td className="py-3 px-4">{formatDate(sale.created_at)}</td>
                      <td className="py-3 px-4 font-mono">{sale.receipt_number}</td>
                      <td className="py-3 px-4">{sale.customer_name || 'Walk-in Customer'}</td>
                      <td className="py-3 px-4 capitalize">{sale.payment_method}</td>
                      <td className="py-3 px-4 font-semibold">KSh {sale.total_amount.toLocaleString()}</td>
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
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      No sales found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Receipt Details Modal */}
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
                <p>Receipt #{selectedSale.receipt_number}</p>
                <p>{formatDate(selectedSale.created_at)}</p>
                {selectedSale.customer_name && (
                  <p>Customer: {selectedSale.customer_name}</p>
                )}
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
                
                {selectedSale.sale_items.map(item => (
                  <div key={item.id} className="mb-1">
                    <div className="flex justify-between">
                      <span className="flex-1 truncate">{item.product_name}</span>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <span className="w-16 text-right">{item.unit_price.toFixed(2)}</span>
                      <span className="w-16 text-right">{item.total_price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-black pt-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>KSh {selectedSale.subtotal.toFixed(2)}</span>
                </div>
                
                {selectedSale.discount_amount > 0 && (
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>-KSh {selectedSale.discount_amount.toFixed(2)}</span>
                  </div>
                )}
                
                {selectedSale.tax_amount > 0 && (
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>KSh {selectedSale.tax_amount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-bold text-lg">
                  <span>TOTAL:</span>
                  <span>KSh {selectedSale.total_amount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between mt-2">
                  <span>Payment ({selectedSale.payment_method}):</span>
                  <span>KSh {selectedSale.amount_received.toFixed(2)}</span>
                </div>
                
                {selectedSale.change_amount > 0 && (
                  <div className="flex justify-between">
                    <span>Change:</span>
                    <span>KSh {selectedSale.change_amount.toFixed(2)}</span>
                  </div>
                )}
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
