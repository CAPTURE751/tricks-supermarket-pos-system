
import { useState } from 'react';
import { mockPurchaseOrders } from '../data/mockData';
import { PurchaseOrder } from '../types/purchases-types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Eye, 
  DollarSign, 
  Calendar,
  CreditCard
} from 'lucide-react';
import { User } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface PaymentTrackingProps {
  user: User;
  searchQuery: string;
}

export const PaymentTracking = ({ user, searchQuery }: PaymentTrackingProps) => {
  const [orders] = useState<PurchaseOrder[]>(mockPurchaseOrders);

  // Filter orders based on search query
  const filteredOrders = orders.filter(order => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(query) ||
        order.supplierName.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get payment status badge
  const getPaymentBadge = (status: PurchaseOrder['paymentStatus']) => {
    switch(status) {
      case 'unpaid':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Unpaid</Badge>;
      case 'partially_paid':
        return <Badge className="bg-amber-100 text-amber-800">Partially Paid</Badge>;
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Calculate amount paid and balance
  const calculatePaymentDetails = (order: PurchaseOrder) => {
    let amountPaid = 0;
    if (order.payments) {
      amountPaid = order.payments.reduce((sum, payment) => sum + payment.amount, 0);
    }
    
    const balance = order.total - amountPaid;
    
    return { amountPaid, balance };
  };

  // Handle record payment
  const handleRecordPayment = (orderId: string) => {
    toast.info(`Recording payment for order: ${orderId}`);
  };

  // Handle view payment history
  const handleViewPaymentHistory = (orderId: string) => {
    toast.info(`Viewing payment history for order: ${orderId}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Payment Tracking</h2>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      <DollarSign className="mx-auto mb-2 h-12 w-12 text-muted-foreground/30" />
                      No purchase orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map(order => {
                    const { amountPaid, balance } = calculatePaymentDetails(order);
                    
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell>{order.supplierName}</TableCell>
                        <TableCell>{formatDate(order.orderDate)}</TableCell>
                        <TableCell className="text-center">
                          {getPaymentBadge(order.paymentStatus)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          KSh {order.total.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-green-600">
                            KSh {amountPaid.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={balance > 0 ? "text-red-600" : ""}>
                            KSh {balance.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {balance > 0 && (
                            <Button 
                              variant="default"
                              size="sm"
                              onClick={() => handleRecordPayment(order.id)}
                              className="bg-blue-600 hover:bg-blue-700 mr-1"
                            >
                              <CreditCard className="h-4 w-4 mr-1" />
                              Pay
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewPaymentHistory(order.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            History
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
