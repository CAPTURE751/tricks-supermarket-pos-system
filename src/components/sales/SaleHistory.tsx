
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, RefreshCw, Receipt } from 'lucide-react';
import { User } from '@/hooks/useAuth';
import { useSales } from '@/hooks/useSales';
import { format } from 'date-fns';

interface SaleHistoryProps {
  user: User;
}

export const SaleHistory = ({ user }: SaleHistoryProps) => {
  const { salesHistory, loading, refetchSalesHistory } = useSales();

  const getPaymentMethodBadge = (method: string) => {
    const variants = {
      'cash': 'default',
      'card': 'secondary',
      'mpesa': 'default',
      'airtel': 'outline'
    } as const;
    
    return (
      <Badge variant={variants[method as keyof typeof variants] || 'default'}>
        {method.toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading sales history...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Sales History
        </CardTitle>
        <Button onClick={refetchSalesHistory} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {salesHistory.length === 0 ? (
          <div className="text-center py-8">
            <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-400">No sales recorded yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {salesHistory.length}
                    </p>
                    <p className="text-sm text-gray-400">Total Sales</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      KSh {salesHistory.reduce((sum, sale) => sum + sale.total_amount, 0).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400">Total Revenue</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      KSh {salesHistory.length > 0 ? (salesHistory.reduce((sum, sale) => sum + sale.total_amount, 0) / salesHistory.length).toFixed(2) : '0.00'}
                    </p>
                    <p className="text-sm text-gray-400">Average Sale</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesHistory.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-mono">
                      {sale.receipt_number}
                    </TableCell>
                    <TableCell>
                      {format(new Date(sale.created_at), 'MMM dd, yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      {sale.sale_items.length} item{sale.sale_items.length !== 1 ? 's' : ''}
                    </TableCell>
                    <TableCell>
                      {getPaymentMethodBadge(sale.payment_method)}
                    </TableCell>
                    <TableCell className="font-semibold">
                      KSh {sale.total_amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
