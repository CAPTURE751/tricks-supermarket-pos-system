
import { useState } from 'react';
import { mockProducts, mockAdjustments } from '../data/mockData';
import { Product, InventoryAdjustment as IInventoryAdjustment } from '../types/inventory-types';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, ArrowUp, ArrowDown, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/hooks/useAuth';

interface InventoryAdjustmentProps {
  user: User;
}

interface AdjustmentFormData {
  productId: string;
  quantity: number;
  reason: string;
  notes: string;
}

export const InventoryAdjustment = ({ user }: InventoryAdjustmentProps) => {
  const [adjustments] = useState<IInventoryAdjustment[]>(mockAdjustments);
  const [products] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<AdjustmentFormData>({
    productId: '',
    quantity: 0,
    reason: '',
    notes: '',
  });

  const filteredProducts = products.filter(product => {
    return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedProduct = products.find(p => p.id === formData.productId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'quantity' ? Number(value) : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productId || !formData.reason) {
      toast.error('Please select a product and provide a reason');
      return;
    }

    if (formData.quantity === 0) {
      toast.error('Adjustment quantity cannot be zero');
      return;
    }

    const product = products.find(p => p.id === formData.productId);

    if (!product) {
      toast.error('Selected product not found');
      return;
    }

    const newAdjustment = {
      id: `adj-${Date.now()}`,
      referenceNumber: `ADJ-${Date.now().toString().slice(-6)}`,
      adjustmentDate: new Date().toISOString(),
      reason: formData.reason,
      notes: formData.notes,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [
        {
          id: `item-${Date.now()}`,
          adjustmentId: `adj-${Date.now()}`,
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          previousQuantity: product.stock,
          newQuantity: product.stock + formData.quantity,
          change: formData.quantity,
          cost: product.costPrice * Math.abs(formData.quantity)
        }
      ]
    };

    toast.success('Inventory adjustment recorded');
    setIsCreating(false);
    setFormData({
      productId: '',
      quantity: 0,
      reason: '',
      notes: '',
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Inventory Adjustments</h2>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Adjustment
          </Button>
        )}
      </div>

      {isCreating && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">New Inventory Adjustment</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Product
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="mt-2 border rounded-md max-h-48 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-center">Current Stock</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                            No products found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProducts.map(product => (
                          <TableRow 
                            key={product.id}
                            className={product.id === formData.productId ? "bg-muted" : ""}
                          >
                            <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell className="text-center">{product.stock}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                type="button" 
                                variant={product.id === formData.productId ? "default" : "ghost"} 
                                size="sm"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, productId: product.id }));
                                  setSearchTerm('');
                                }}
                              >
                                {product.id === formData.productId ? "Selected" : "Select"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Selected Product Info */}
              {selectedProduct && (
                <div className="bg-muted p-3 rounded-md">
                  <div className="font-medium">{selectedProduct.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Current Stock: {selectedProduct.stock} {selectedProduct.unit}s | SKU: {selectedProduct.sku}
                  </div>
                </div>
              )}

              {/* Adjustment Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium mb-1">
                    Adjustment Quantity
                  </label>
                  <div className="flex">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm" 
                      className="rounded-r-none"
                      onClick={() => setFormData(prev => ({ ...prev, quantity: prev.quantity - 1 }))}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="rounded-none text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-l-none"
                      onClick={() => setFormData(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.quantity > 0 ? 'Adding to' : formData.quantity < 0 ? 'Removing from' : 'Not changing'} inventory
                  </p>
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm font-medium mb-1">
                    Reason
                  </label>
                  <select
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    required
                  >
                    <option value="">-- Select Reason --</option>
                    <option value="Damaged Stock">Damaged Stock</option>
                    <option value="Expired Stock">Expired Stock</option>
                    <option value="Stock Count">Inventory Count Correction</option>
                    <option value="Returns">Product Returns</option>
                    <option value="Theft">Theft or Loss</option>
                    <option value="Sample">Samples or Demonstrations</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium mb-1">
                  Notes
                </label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add any additional details about this adjustment"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Adjustment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Recent Adjustments */}
      <h3 className="text-lg font-medium">Recent Adjustments</h3>
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead className="text-right">Total Change</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adjustments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      <Calendar className="mx-auto mb-2 h-12 w-12 text-muted-foreground/30" />
                      No adjustments recorded yet
                    </TableCell>
                  </TableRow>
                ) : (
                  adjustments.map(adjustment => {
                    const totalChange = adjustment.items.reduce((sum, item) => sum + item.change, 0);
                    const totalValue = adjustment.items.reduce((sum, item) => sum + item.cost, 0);
                    
                    return (
                      <TableRow key={adjustment.id}>
                        <TableCell className="font-mono text-xs">
                          {adjustment.referenceNumber}
                        </TableCell>
                        <TableCell>{formatDate(adjustment.adjustmentDate)}</TableCell>
                        <TableCell>{adjustment.reason}</TableCell>
                        <TableCell>
                          {adjustment.items.map(item => item.productName).join(', ')}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={totalChange > 0 ? 'text-green-600' : 'text-red-600'}>
                            {totalChange > 0 ? '+' : ''}{totalChange}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          KSh {totalValue.toLocaleString()}
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
