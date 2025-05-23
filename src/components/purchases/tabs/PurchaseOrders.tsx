
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
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  FileText, 
  Printer, 
  Download, 
  CheckCircle,
  Clock,
  Ban,
  FileInput
} from 'lucide-react';
import { User } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface PurchaseOrdersProps {
  user: User;
  searchQuery: string;
  filterStatus: string;
}

export const PurchaseOrders = ({ user, searchQuery, filterStatus }: PurchaseOrdersProps) => {
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);

  // Filter orders based on search query and status
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (filterStatus !== 'all' && order.status !== filterStatus) {
      return false;
    }
    
    // Search query filter
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

  // Get status badge
  const getStatusBadge = (status: PurchaseOrder['status']) => {
    switch(status) {
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Draft</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-800">Submitted</Badge>;
      case 'approved':
        return <Badge className="bg-indigo-100 text-indigo-800">Approved</Badge>;
      case 'sent':
        return <Badge className="bg-purple-100 text-purple-800">Sent</Badge>;
      case 'partially_received':
        return <Badge className="bg-amber-100 text-amber-800">Partially Received</Badge>;
      case 'received':
        return <Badge className="bg-green-100 text-green-800">Received</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
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

  // Handle create new PO
  const handleCreatePO = () => {
    toast.info("Creating new purchase order");
    // In a real app, this would open a form/modal
  };
  
  // Handle view PO details
  const handleViewPO = (orderId: string) => {
    toast.info(`Viewing purchase order: ${orderId}`);
    // In a real app, this would open a details view
  };
  
  // Handle edit PO
  const handleEditPO = (orderId: string) => {
    toast.info(`Editing purchase order: ${orderId}`);
    // In a real app, this would open an edit form
  };
  
  // Handle delete PO
  const handleDeletePO = (orderId: string) => {
    setOrders(orders.filter(order => order.id !== orderId));
    toast.success("Purchase order deleted successfully");
  };
  
  // Handle print PO
  const handlePrintPO = (orderId: string) => {
    toast.info(`Printing purchase order: ${orderId}`);
    // In a real app, this would open a print preview
  };
  
  // Handle change PO status
  const handleChangeStatus = (orderId: string, newStatus: PurchaseOrder['status']) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    }));
    toast.success(`Purchase order status changed to: ${newStatus}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Purchase Orders</h2>
        <Button onClick={handleCreatePO}>
          <Plus className="mr-2 h-4 w-4" />
          Create Purchase Order
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Expected Delivery</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Payment</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      <FileText className="mx-auto mb-2 h-12 w-12 text-muted-foreground/30" />
                      No purchase orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.supplierName}</div>
                      </TableCell>
                      <TableCell>{formatDate(order.orderDate)}</TableCell>
                      <TableCell>{formatDate(order.expectedDeliveryDate)}</TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(order.status)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getPaymentBadge(order.paymentStatus)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        KSh {order.total.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleViewPO(order.id)}
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {order.status === 'draft' && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditPO(order.id)}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}

                          {order.status === 'draft' && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeletePO(order.id)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}

                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handlePrintPO(order.id)}
                            title="Print"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>

                          {order.status === 'draft' && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleChangeStatus(order.id, 'sent')}
                              title="Send to supplier"
                            >
                              <FileInput className="h-4 w-4" />
                            </Button>
                          )}

                          {order.status === 'sent' && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleChangeStatus(order.id, 'received')}
                              title="Mark as received"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
