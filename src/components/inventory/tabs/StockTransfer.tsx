
import { useState } from 'react';
import { mockTransfers } from '../data/mockData';
import { StockTransferOrder } from '../types/inventory-types';
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
import { Plus, Eye, Calendar, TruckIcon } from 'lucide-react';
import { User } from '@/hooks/useAuth';

interface StockTransferProps {
  user: User;
}

export const StockTransfer = ({ user }: StockTransferProps) => {
  const [transfers] = useState<StockTransferOrder[]>(mockTransfers);
  
  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status: StockTransferOrder['status']) => {
    switch(status) {
      case 'pending':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'in_transit':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  // Format status label
  const formatStatus = (status: StockTransferOrder['status']) => {
    switch(status) {
      case 'in_transit':
        return 'In Transit';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Stock Transfers</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Transfer
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['All', 'Pending', 'In Transit', 'Completed', 'Cancelled'].map((filter) => (
          <Button key={filter} variant="outline">
            {filter}
          </Button>
        ))}
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference #</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Transfer Date</TableHead>
                  <TableHead>Expected Arrival</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Items</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      <TruckIcon className="mx-auto mb-2 h-12 w-12 text-muted-foreground/30" />
                      No stock transfers found
                    </TableCell>
                  </TableRow>
                ) : (
                  transfers.map(transfer => (
                    <TableRow key={transfer.id}>
                      <TableCell className="font-mono text-xs">
                        {transfer.referenceNumber}
                      </TableCell>
                      <TableCell>{transfer.fromLocation}</TableCell>
                      <TableCell>{transfer.toLocation}</TableCell>
                      <TableCell>{formatDate(transfer.transferDate)}</TableCell>
                      <TableCell>{formatDate(transfer.expectedArrivalDate)}</TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(transfer.status)}`}>
                          {formatStatus(transfer.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {transfer.items.length} items
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
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
    </div>
  );
};
