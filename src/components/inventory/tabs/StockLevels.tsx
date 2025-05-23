
import { useState } from 'react';
import { mockProducts } from '../data/mockData';
import { Product } from '../types/inventory-types';
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
import { Box, AlertTriangle } from 'lucide-react';

interface StockLevelsProps {
  searchQuery: string;
  filterStatus: string;
}

export const StockLevels = ({ searchQuery, filterStatus }: StockLevelsProps) => {
  const [products] = useState<Product[]>(mockProducts);

  // Filter products based on search query and status
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = 
      searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    let matchesStatus = true;
    if (filterStatus !== 'all') {
      switch (filterStatus) {
        case 'in-stock':
          matchesStatus = product.stock > product.minStockLevel;
          break;
        case 'low-stock':
          matchesStatus = product.stock <= product.minStockLevel && product.stock > 0;
          break;
        case 'out-of-stock':
          matchesStatus = product.stock === 0;
          break;
        case 'expiring-soon':
          if (!product.expiryDate) return false;
          const expiryDate = new Date(product.expiryDate);
          const today = new Date();
          const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
          matchesStatus = daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
          break;
      }
    }
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.stock <= p.minStockLevel && p.stock > 0).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  
  // Calculate products with expiry dates and how many are expiring soon
  const productsWithExpiryDates = products.filter(p => p.expiryDate).length;
  const expiringSoonCount = products.filter(p => {
    if (!p.expiryDate) return false;
    const expiryDate = new Date(p.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  }).length;

  // Calculate total inventory value
  const totalInventoryValue = products.reduce(
    (sum, product) => sum + (product.costPrice * product.stock), 
    0
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Stock Levels</h2>
      
      {/* Stock Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-5xl font-bold">{totalProducts}</h3>
              <p className="text-muted-foreground mt-1">Total Products</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-5xl font-bold text-amber-500">{lowStockCount}</h3>
              <p className="text-muted-foreground mt-1">Low Stock Items</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-5xl font-bold text-red-500">{outOfStockCount}</h3>
              <p className="text-muted-foreground mt-1">Out of Stock</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-bold">KSh {totalInventoryValue.toLocaleString()}</h3>
              <p className="text-muted-foreground mt-1">Total Inventory Value</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert for low stock products */}
      {lowStockCount > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3 rounded-md flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800 dark:text-amber-400">Low Stock Alert</h4>
            <p className="text-amber-700 dark:text-amber-300 text-sm">
              {lowStockCount} product{lowStockCount !== 1 ? 's' : ''} {lowStockCount !== 1 ? 'are' : 'is'} running low on stock. Consider restocking soon.
            </p>
          </div>
        </div>
      )}

      {/* Stock Levels Table */}
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Current Stock</TableHead>
                  <TableHead className="text-center">Min Stock</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      <Box className="mx-auto mb-2 h-12 w-12 text-muted-foreground/30" />
                      No products found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map(product => {
                    const stockStatus = 
                      product.stock === 0 ? 'Out of Stock' :
                      product.stock <= product.minStockLevel ? 'Low Stock' : 'In Stock';
                    
                    const stockStatusColor = 
                      product.stock === 0 ? 'text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400' :
                      product.stock <= product.minStockLevel ? 'text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400' :
                      'text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400';

                    const inventoryValue = product.costPrice * product.stock;

                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground">{product.sku}</div>
                        </TableCell>
                        <TableCell className="text-center font-medium">{product.stock}</TableCell>
                        <TableCell className="text-center">{product.minStockLevel}</TableCell>
                        <TableCell className="text-center">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${stockStatusColor}`}>
                            {stockStatus}
                          </span>
                        </TableCell>
                        <TableCell>{product.location || '-'}</TableCell>
                        <TableCell className="text-right">
                          KSh {inventoryValue.toLocaleString()}
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
