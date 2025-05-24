import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { ProductGrid } from './ProductGrid';
import { ShoppingCart } from './ShoppingCart';
import { CheckoutPanel } from './CheckoutPanel';
import { CustomerSearch } from './CustomerSearch';
import { SaleHistory } from './SaleHistory';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, ShoppingBag, Clock, BarChart2, RefreshCw } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { DatabaseProduct } from '@/services/products-service';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  barcode?: string;
  sku?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  loyaltyPoints?: number;
}

interface SalesModuleProps {
  user: User;
}

// Transform database product to UI product format
const transformProduct = (dbProduct: DatabaseProduct): Product => ({
  id: dbProduct.id,
  name: dbProduct.name,
  price: dbProduct.selling_price,
  category: dbProduct.categories?.name || 'Uncategorized',
  stock: dbProduct.stock_quantity,
  barcode: dbProduct.barcode || undefined,
  sku: dbProduct.sku
});

export const SalesModule = ({ user }: SalesModuleProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<string>('new-sale');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [saleNote, setSaleNote] = useState<string>('');
  const [parkedSales, setParkedSales] = useState<{id: string, items: CartItem[], customer: Customer | null, note: string}[]>([]);

  const { products: dbProducts, categories, loading, error, refetchProducts, updateProductStock } = useProducts();

  // Transform database products to UI format
  const products = dbProducts.map(transformProduct);

  // Get unique categories from products and categories table
  const categoriesFromProducts = Array.from(new Set(products.map(p => p.category)));
  const allCategories = ['All', ...categoriesFromProducts];

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity < product.stock) {
          return prev.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return prev;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartItem = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.id !== id));
    } else {
      setCart(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
    setSaleNote('');
  };

  const handleCustomerSelected = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const parkCurrentSale = () => {
    if (cart.length > 0) {
      const newParkedSale = {
        id: `sale-${Date.now()}`,
        items: [...cart],
        customer: selectedCustomer,
        note: saleNote
      };
      setParkedSales([...parkedSales, newParkedSale]);
      clearCart();
    }
  };

  const resumeParkedSale = (saleId: string) => {
    const sale = parkedSales.find(s => s.id === saleId);
    if (sale) {
      setCart(sale.items);
      setSelectedCustomer(sale.customer);
      setSaleNote(sale.note);
      setParkedSales(parkedSales.filter(s => s.id !== saleId));
      setActiveTab('new-sale');
    }
  };

  const handleCheckoutComplete = async () => {
    try {
      // Update stock for each item in the cart
      for (const item of cart) {
        await updateProductStock(item.id, -item.quantity, `SALE-${Date.now()}`);
      }
      clearCart();
    } catch (error) {
      console.error('Error updating stock after sale:', error);
      // Don't clear cart if stock update fails
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode?.includes(searchTerm) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading products: {error}</p>
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
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-800 p-1 space-x-2">
          <TabsTrigger value="new-sale" className="flex items-center gap-2">
            <ShoppingBag size={16} />
            <span>New Sale</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock size={16} />
            <span>Sale History</span>
          </TabsTrigger>
          <TabsTrigger value="parked" className="flex items-center gap-2">
            <Clock size={16} />
            <span>Parked Sales ({parkedSales.length})</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart2 size={16} />
            <span>Reports</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new-sale">
          <div className="flex space-x-6 h-full">
            {/* Left Side - Products */}
            <div className="flex-1 space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Products ({products.length})</h2>
                    <Button onClick={refetchProducts} variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                  
                  {/* Search and Filters */}
                  <div className="flex space-x-4 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search products by name, barcode or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mb-4 overflow-x-auto">
                    {allCategories.map(category => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category)}
                        className="whitespace-nowrap"
                        size="sm"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <ProductGrid products={filteredProducts} onAddToCart={addToCart} />
            </div>

            {/* Right Side - Cart and Checkout */}
            <div className="w-96 space-y-4">
              {/* Customer Selection */}
              <Card className="p-4">
                <h3 className="text-lg font-bold mb-2">
                  {selectedCustomer ? 'Selected Customer' : 'Add Customer (Optional)'}
                </h3>
                
                {selectedCustomer ? (
                  <div className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{selectedCustomer.name}</p>
                        <p className="text-sm text-gray-400">{selectedCustomer.phone}</p>
                        {selectedCustomer.loyaltyPoints !== undefined && (
                          <p className="text-sm text-green-400">
                            Loyalty Points: {selectedCustomer.loyaltyPoints}
                          </p>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedCustomer(null)}
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                ) : (
                  <CustomerSearch onSelectCustomer={handleCustomerSelected} />
                )}
              </Card>

              {/* Sale Notes */}
              <Card className="p-4">
                <h3 className="text-lg font-bold mb-2">Sale Notes</h3>
                <Textarea
                  placeholder="Add notes for this sale (e.g., table number, special instructions)"
                  value={saleNote}
                  onChange={(e) => setSaleNote(e.target.value)}
                  className="bg-gray-700 text-white border-gray-600"
                  rows={2}
                />
              </Card>

              {/* Park Sale Button */}
              {cart.length > 0 && (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={parkCurrentSale}
                >
                  Park Sale
                </Button>
              )}

              <ShoppingCart 
                items={cart} 
                onUpdateItem={updateCartItem}
                onClear={clearCart}
              />
              
              <CheckoutPanel 
                items={cart}
                user={user}
                customer={selectedCustomer}
                saleNote={saleNote}
                onCheckoutComplete={handleCheckoutComplete}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <SaleHistory user={user} />
        </TabsContent>

        <TabsContent value="parked">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Parked Sales</h2>
            
            {parkedSales.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No parked sales</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {parkedSales.map(sale => (
                  <Card key={sale.id} className="bg-gray-700 hover:bg-gray-600 transition-colors">
                    <CardContent className="p-4">
                      <div className="mb-2">
                        <p className="text-sm text-gray-400">
                          {new Date(parseInt(sale.id.split('-')[1])).toLocaleString()}
                        </p>
                        <p className="font-semibold">
                          {sale.customer ? sale.customer.name : 'No Customer'}
                        </p>
                        <p className="text-sm">
                          {sale.items.length} items | 
                          KSh {sale.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                        </p>
                      </div>
                      <Button 
                        onClick={() => resumeParkedSale(sale.id)}
                        className="w-full"
                      >
                        Resume Sale
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Sales Reports</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Daily Sales Summary</h3>
                  {/* Placeholder for sales reports */}
                  <p className="text-gray-400">Report functionality will be implemented here</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Top Selling Products</h3>
                  {/* Placeholder for sales reports */}
                  <p className="text-gray-400">Report functionality will be implemented here</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
