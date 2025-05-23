
import { Product } from './SalesModule';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Barcode } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ProductGrid = ({ products, onAddToCart }: ProductGridProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map(product => (
            <button
              key={product.id}
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 text-left
                ${product.stock === 0 
                  ? 'border-red-500 bg-red-500/10 opacity-50 cursor-not-allowed' 
                  : 'border-gray-600 bg-gray-700 hover:border-green-500 hover:bg-gray-600'
                }
              `}
            >
              <div className="flex flex-col space-y-2">
                {/* Product Image */}
                <div className="w-full aspect-square bg-gray-600 rounded-lg flex items-center justify-center mb-2 relative">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-3xl">📦</span>
                  )}
                  
                  {/* Stock Level Indicator */}
                  {product.stock > 0 && product.stock <= 5 && (
                    <Badge className="absolute top-1 right-1 bg-yellow-500">Low Stock</Badge>
                  )}
                </div>
                
                {/* Product Info */}
                <div>
                  <h3 className="text-white font-semibold text-sm line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-green-400 font-bold">KSh {product.price}</p>
                    {product.barcode && (
                      <Barcode size={16} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-xs ${product.stock > 10 ? 'text-gray-400' : 'text-yellow-400'}`}>
                      Stock: {product.stock}
                    </p>
                    {product.stock > 0 && (
                      <ShoppingCart size={16} className="text-gray-400" />
                    )}
                  </div>
                  {product.stock === 0 && (
                    <p className="text-red-400 text-xs font-semibold">Out of Stock</p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No products found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
