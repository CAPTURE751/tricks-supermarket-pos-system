
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockProducts, mockTransactions } from '../data/mockData';
import { InventoryTransaction } from '../types/inventory-types';

export const InventoryReports = () => {
  const [transactions] = useState<InventoryTransaction[]>(mockTransactions);
  
  // Calculate inventory valuation
  const totalInventoryValue = mockProducts.reduce(
    (sum, product) => sum + (product.costPrice * product.stock), 0
  );
  
  // Count products by status
  const outOfStockCount = mockProducts.filter(p => p.stock === 0).length;
  const lowStockCount = mockProducts.filter(p => p.stock <= p.minStockLevel && p.stock > 0).length;
  const inStockCount = mockProducts.filter(p => p.stock > p.minStockLevel).length;
  
  // Calculate transactions summary
  const purchaseTransactions = transactions.filter(t => t.type === 'purchase');
  const salesTransactions = transactions.filter(t => t.type === 'sale');
  const adjustmentTransactions = transactions.filter(t => t.type === 'adjustment');
  const transferTransactions = transactions.filter(t => t.type === 'transfer');

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Inventory Reports</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Inventory Valuation</CardTitle>
            <CardDescription>Current stock value at cost</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">KSh {totalInventoryValue.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Based on {mockProducts.length} products
            </div>
            <Button variant="link" className="px-0 text-sm mt-2">Generate Detailed Report</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Stock Status</CardTitle>
            <CardDescription>Current stock status overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-500">In Stock: {inStockCount}</div>
                <div className="text-sm text-amber-500">Low Stock: {lowStockCount}</div>
                <div className="text-sm text-red-500">Out of Stock: {outOfStockCount}</div>
              </div>
              <div className="ml-4">
                <svg width="80" height="80" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                  />
                  {/* Green segment */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="10"
                    strokeDasharray={`${(inStockCount / mockProducts.length) * 283} 283`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                  {/* Yellow segment */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="10"
                    strokeDasharray={`${(lowStockCount / mockProducts.length) * 283} 283`}
                    strokeDashoffset={`${-1 * (inStockCount / mockProducts.length) * 283}`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                  {/* Red segment */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="10"
                    strokeDasharray={`${(outOfStockCount / mockProducts.length) * 283} 283`}
                    strokeDashoffset={`${-1 * ((inStockCount + lowStockCount) / mockProducts.length) * 283}`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
            </div>
            <Button variant="link" className="px-0 text-sm mt-2">Generate Reorder Report</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Transaction Summary</CardTitle>
            <CardDescription>Recent inventory movements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm">Purchases</span>
                <span className="text-sm font-medium">{purchaseTransactions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Sales</span>
                <span className="text-sm font-medium">{salesTransactions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Adjustments</span>
                <span className="text-sm font-medium">{adjustmentTransactions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Transfers</span>
                <span className="text-sm font-medium">{transferTransactions.length}</span>
              </div>
            </div>
            <Button variant="link" className="px-0 text-sm mt-2">View Transaction Log</Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium text-sm">{transaction.productName}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(transaction.date)} • {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${transaction.quantity > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {transaction.quantity > 0 ? '+' : ''}{transaction.quantity}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Stock-on-Hand Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Inventory Valuation Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Stock Movement Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Reorder Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Expiry Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
