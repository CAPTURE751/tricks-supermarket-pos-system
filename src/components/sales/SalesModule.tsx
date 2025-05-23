
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { ProductGrid } from './ProductGrid';
import { ShoppingCart } from './ShoppingCart';
import { CheckoutPanel } from './CheckoutPanel';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  barcode?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface SalesModuleProps {
  user: User;
}

const sampleProducts: Product[] = [
  { id: '1', name: 'Coca-Cola 500ml', price: 80, category: 'Drinks', stock: 50, barcode: '123456789' },
  { id: '2', name: 'Bread Loaf', price: 60, category: 'Bakery', stock: 25 },
  { id: '3', name: 'Milk 1L', price: 120, category: 'Dairy', stock: 30 },
  { id: '4', name: 'Rice 2kg', price: 350, category: 'Grains', stock: 15 },
  { id: '5', name: 'Cooking Oil 1L', price: 280, category: 'Cooking', stock: 20 },
  { id: '6', name: 'Sugar 1kg', price: 150, category: 'Pantry', stock: 40 },
];

export const SalesModule = ({ user }: SalesModuleProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products] = useState<Product[]>(sampleProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

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

  const clearCart = () => setCart([]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode?.includes(searchTerm);
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex space-x-6 h-full">
      {/* Left Side - Products */}
      <div className="flex-1 space-y-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-white text-xl font-bold mb-4">Products</h2>
          
          {/* Search and Filters */}
          <div className="flex space-x-4 mb-4">
            <input
              type="text"
              placeholder="Search products or scan barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
            />
          </div>
          
          <div className="flex space-x-2 mb-4 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <ProductGrid products={filteredProducts} onAddToCart={addToCart} />
      </div>

      {/* Right Side - Cart and Checkout */}
      <div className="w-96 space-y-4">
        <ShoppingCart 
          items={cart} 
          onUpdateItem={updateCartItem}
          onClear={clearCart}
        />
        
        <CheckoutPanel 
          items={cart}
          user={user}
          onCheckoutComplete={clearCart}
        />
      </div>
    </div>
  );
};
