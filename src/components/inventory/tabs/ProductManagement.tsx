
import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { DatabaseProduct } from '@/services/products-service';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, Box, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ProductForm } from '../components/ProductForm';
import { toast } from 'sonner';

interface ProductManagementProps {
  searchQuery: string;
  filterStatus: string;
}

export const ProductManagement = ({ searchQuery, filterStatus }: ProductManagementProps) => {
  const { products, categories, loading, error, refetchProducts, addProduct, updateProduct } = useProducts();
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DatabaseProduct | null>(null);

  // Filter products based on search query and status
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = 
      searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    let matchesStatus = true;
    if (filterStatus !== 'all') {
      switch (filterStatus) {
        case 'in-stock':
          matchesStatus = product.stock_quantity > product.min_stock_level;
          break;
        case 'low-stock':
          matchesStatus = product.stock_quantity <= product.min_stock_level && product.stock_quantity > 0;
          break;
        case 'out-of-stock':
          matchesStatus = product.stock_quantity === 0;
          break;
        case 'expiring-soon':
          if (!product.expiry_date) return false;
          const expiryDate = new Date(product.expiry_date);
          const today = new Date();
          const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
          matchesStatus = daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
          break;
      }
    }
    
    return matchesSearch && matchesStatus;
  });

  const handleAddProduct = async (productData: Omit<DatabaseProduct, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await addProduct(productData);
      setIsAddingProduct(false);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleUpdateProduct = async (updatedProduct: DatabaseProduct) => {
    try {
      await updateProduct(updatedProduct.id, updatedProduct);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      // For now, we'll just mark as inactive instead of deleting
      await updateProduct(id, { is_active: false });
      toast.success('Product deactivated successfully');
    } catch (error) {
      console.error('Error deactivating product:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading products: {error}</p>
          <Button onClick={refetchProducts} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Product Management ({products.length} products)</h2>
        <div className="flex gap-2">
          <Button onClick={refetchProducts} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setIsAddingProduct(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {(isAddingProduct || editingProduct) && (
        <Card>
          <CardContent className="pt-6">
            <ProductForm 
              product={editingProduct}
              categories={categories}
              onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
              onCancel={() => {
                setIsAddingProduct(false);
                setEditingProduct(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">SKU</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-center">Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                  filteredProducts.map(product => (
                    <TableRow key={product.id}>
                      <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                      <TableCell>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {product.description || 'No description'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div>KSh {product.selling_price.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          Cost: KSh {product.cost_price.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`
                          inline-flex rounded-full px-2 py-1 text-xs font-semibold
                          ${product.stock_quantity === 0 
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                            : product.stock_quantity <= product.min_stock_level 
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          }
                        `}>
                          {product.stock_quantity} {product.unit}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm text-muted-foreground">
                          {product.categories?.name || 'Uncategorized'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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
