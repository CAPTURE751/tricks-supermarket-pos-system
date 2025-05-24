
import { useState, useEffect } from 'react';
import { ProductsService, DatabaseProduct, DatabaseCategory } from '@/services/products-service';
import { toast } from 'sonner';

export const useProducts = () => {
  const [products, setProducts] = useState<DatabaseProduct[]>([]);
  const [categories, setCategories] = useState<DatabaseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductsService.getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      toast.error('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await ProductsService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      toast.error('Failed to load categories');
    }
  };

  const updateProductStock = async (productId: string, quantityChange: number, referenceNumber?: string) => {
    try {
      await ProductsService.updateStock(productId, quantityChange, referenceNumber);
      
      // Update local state
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, stock_quantity: product.stock_quantity + quantityChange }
          : product
      ));
      
      toast.success('Stock updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update stock';
      toast.error(errorMessage);
      throw err;
    }
  };

  const addProduct = async (productData: Omit<DatabaseProduct, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newProduct = await ProductsService.addProduct(productData);
      setProducts(prev => [...prev, newProduct]);
      toast.success('Product added successfully');
      return newProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add product';
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateProduct = async (id: string, updates: Partial<DatabaseProduct>) => {
    try {
      const updatedProduct = await ProductsService.updateProduct(id, updates);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      toast.success('Product updated successfully');
      return updatedProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      toast.error(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return {
    products,
    categories,
    loading,
    error,
    refetchProducts: fetchProducts,
    updateProductStock,
    addProduct,
    updateProduct
  };
};
