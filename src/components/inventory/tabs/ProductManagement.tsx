
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
import { Edit, Trash2, Plus, Box } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ProductForm } from '../components/ProductForm';
import { toast } from 'sonner';

interface ProductManagementProps {
  searchQuery: string;
  filterStatus: string;
}

export const ProductManagement = ({ searchQuery, filterStatus }: ProductManagementProps) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Filter products based on search query and status
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = 
      searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
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

  const handleAddProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: `new-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setProducts([...products, newProduct]);
    setIsAddingProduct(false);
    toast.success('Product added successfully');
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    ));
    setEditingProduct(null);
    toast.success('Product updated successfully');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success('Product deleted successfully');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Product Management</h2>
        <Button onClick={() => setIsAddingProduct(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {(isAddingProduct || editingProduct) && (
        <Card>
          <CardContent className="pt-6">
            <ProductForm 
              product={editingProduct}
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
                  <TableHead className="w-[50px]">SKU</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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
                        <div className="text-xs text-muted-foreground">{product.category}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div>KSh {product.sellingPrice.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Cost: {product.costPrice.toLocaleString()}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`
                          inline-flex rounded-full px-2 py-1 text-xs font-semibold
                          ${product.stock === 0 
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                            : product.stock <= product.minStockLevel 
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          }
                        `}>
                          {product.stock}
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
