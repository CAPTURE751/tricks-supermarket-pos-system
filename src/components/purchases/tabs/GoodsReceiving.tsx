
import { useState } from 'react';
import { mockPurchaseOrders, mockGoodsReceived } from '../data/mockData';
import { PurchaseOrder, GoodsReceived } from '../types/purchases-types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Eye, 
  PackageCheck, 
  Calendar, 
  Printer, 
  ArrowDownCircle
} from 'lucide-react';
import { User } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GoodsReceivingProps {
  user: User;
  searchQuery: string;
}

export const GoodsReceiving = ({ user, searchQuery }: GoodsReceivingProps) => {
  const [pendingOrders] = useState<PurchaseOrder[]>(
    mockPurchaseOrders.filter(order => 
      order.status === 'sent' || order.status === 'partially_received'
    )
  );
  const [receivedGoods] = useState<GoodsReceived[]>(mockGoodsReceived);

  // Filter orders based on search query
  const filteredPendingOrders = pendingOrders.filter(order => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(query) ||
        order.supplierName.toLowerCase().includes(query)
      );
    }
    return true;
  });
  
  // Filter GRNs based on search query
  const filteredGoodsReceived = receivedGoods.filter(grn => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return grn.grnNumber.toLowerCase().includes(query);
    }
    return true;
  });

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Handle receive goods
  const handleReceiveGoods = (orderId: string) => {
    toast.info(`Receiving goods for order: ${orderId}`);
  };
  
  // Handle view GRN details
  const handleViewGRN = (grnId: string) => {
    toast.info(`Viewing goods received note: ${grnId}`);
  };
  
  // Handle print GRN
  const handlePrintGRN = (grnId: string) => {
    toast.info(`Printing goods received note: ${grnId}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Goods Receiving</h2>
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="pending">Pending Orders</TabsTrigger>
          <TabsTrigger value="received">Received Goods</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pending Purchase Orders</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Expected Delivery</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPendingOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          <Calendar className="mx-auto mb-2 h-12 w-12 text-muted-foreground/30" />
                          No pending orders for receiving
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPendingOrders.map(order => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-xs">
                            {order.orderNumber}
                          </TableCell>
                          <TableCell>{order.supplierName}</TableCell>
                          <TableCell>{formatDate(order.orderDate)}</TableCell>
                          <TableCell>{formatDate(order.expectedDeliveryDate)}</TableCell>
                          <TableCell className="text-center">
                            {order.status === 'sent' ? (
                              <Badge className="bg-purple-100 text-purple-800">Sent</Badge>
                            ) : (
                              <Badge className="bg-amber-100 text-amber-800">Partially Received</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="default" 
                              size="sm" 
                              onClick={() => handleReceiveGoods(order.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <ArrowDownCircle className="h-4 w-4 mr-1" />
                              Receive
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="received">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Goods Received Notes (GRN)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>GRN #</TableHead>
                      <TableHead>Related PO</TableHead>
                      <TableHead>Received Date</TableHead>
                      <TableHead>Delivery Note #</TableHead>
                      <TableHead>Received By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGoodsReceived.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          <PackageCheck className="mx-auto mb-2 h-12 w-12 text-muted-foreground/30" />
                          No goods received notes found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredGoodsReceived.map(grn => (
                        <TableRow key={grn.id}>
                          <TableCell className="font-mono text-xs">
                            {grn.grnNumber}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {mockPurchaseOrders.find(po => po.id === grn.purchaseOrderId)?.orderNumber}
                          </TableCell>
                          <TableCell>{formatDate(grn.receiveDate)}</TableCell>
                          <TableCell>{grn.deliveryNoteNumber || 'N/A'}</TableCell>
                          <TableCell>{grn.receivedBy === user.id ? user.name : 'Other User'}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewGRN(grn.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handlePrintGRN(grn.id)}
                            >
                              <Printer className="h-4 w-4 mr-1" />
                              Print
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
