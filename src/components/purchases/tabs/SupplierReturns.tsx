
import { useState } from 'react';
import { mockSupplierReturns } from '../data/mockData';
import { SupplierReturn } from '../types/purchases-types';
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
  PackageOpen, 
  Printer, 
  ArrowUpCircle
} from 'lucide-react';
import { User } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SupplierReturnsProps {
  user: User;
  searchQuery: string;
}

export const SupplierReturns = ({ user, searchQuery }: SupplierReturnsProps) => {
  const [returns, setReturns] = useState<SupplierReturn[]>(mockSupplierReturns);

  // Filter returns based on search query
  const filteredReturns = returns.filter(returnItem => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        returnItem.returnNumber.toLowerCase().includes(query) ||
        returnItem.supplierName.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Handle create new return
  const handleCreateReturn = () => {
    toast.info("Creating new supplier return");
  };
  
  // Handle view return details
  const handleViewReturn = (returnId: string) => {
    toast.info(`Viewing supplier return: ${returnId}`);
  };
  
  // Handle print return
  const handlePrintReturn = (returnId: string) => {
    toast.info(`Printing supplier return: ${returnId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Supplier Returns</h2>
        <Button onClick={handleCreateReturn}>
          <Plus className="mr-2 h-4 w-4" />
          Create Return
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Return #</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReturns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      <PackageOpen className="mx-auto mb-2 h-12 w-12 text-muted-foreground/30" />
                      No supplier returns found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReturns.map(returnItem => (
                    <TableRow key={returnItem.id}>
                      <TableCell className="font-mono text-xs">
                        {returnItem.returnNumber}
                      </TableCell>
                      <TableCell>{returnItem.supplierName}</TableCell>
                      <TableCell>{formatDate(returnItem.returnDate)}</TableCell>
                      <TableCell>{returnItem.reason}</TableCell>
                      <TableCell className="text-right font-medium">
                        KSh {returnItem.total.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewReturn(returnItem.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handlePrintReturn(returnItem.id)}
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
    </div>
  );
};
