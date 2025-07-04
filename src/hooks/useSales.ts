
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/components/auth/AdminOnlyAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SalesService, DatabaseCustomer, SaleWithItems } from '@/services/sales-service';

export interface Product {
  id: string;
  name: string;
  price: number;
  sku: string;
  stock_quantity: number;
  barcode?: string;
  category?: string;
  tax_rate: number;
}

export interface CartItem extends Product {
  quantity: number;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  loyalty_points: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  customer?: Customer;
  payment_method: string;
  timestamp: string;
  receipt_number: string;
}

export const useSales = () => {
  const { profile } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [salesHistory, setSalesHistory] = useState<SaleWithItems[]>([]);
  const [loading, setLoading] = useState(false);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.price }
            : item
        );
      }
      return [...prev, { ...product, quantity, total: quantity * product.price }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev => prev.map(item =>
      item.id === productId
        ? { ...item, quantity, total: quantity * item.price }
        : item
    ));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCustomer(null);
  }, []);

  const searchCustomers = useCallback(async (query: string): Promise<DatabaseCustomer[]> => {
    try {
      return await SalesService.searchCustomers(query);
    } catch (error) {
      console.error('Error searching customers:', error);
      toast.error('Failed to search customers');
      return [];
    }
  }, []);

  const addCustomer = useCallback(async (customerData: Omit<DatabaseCustomer, 'id' | 'created_at' | 'updated_at' | 'loyalty_points' | 'total_purchases' | 'last_purchase_date'> & Partial<Pick<DatabaseCustomer, 'loyalty_points' | 'total_purchases' | 'last_purchase_date'>>): Promise<DatabaseCustomer> => {
    try {
      const newCustomer = await SalesService.addCustomer(customerData);
      toast.success('Customer added successfully');
      return newCustomer;
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error('Failed to add customer');
      throw error;
    }
  }, []);

  const fetchSalesHistory = useCallback(async () => {
    setLoading(true);
    try {
      const history = await SalesService.getSalesHistory();
      setSalesHistory(history);
    } catch (error) {
      console.error('Error fetching sales history:', error);
      toast.error('Failed to fetch sales history');
    } finally {
      setLoading(false);
    }
  }, []);

  const refetchSalesHistory = useCallback(() => {
    fetchSalesHistory();
  }, [fetchSalesHistory]);

  // Load sales history on mount
  useEffect(() => {
    fetchSalesHistory();
  }, [fetchSalesHistory]);

  const completeSale = useCallback(async (paymentMethod: string) => {
    if (!profile) {
      toast.error('User not authenticated');
      return null;
    }

    if (cart.length === 0) {
      toast.error('Cart is empty');
      return null;
    }

    try {
      const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
      const taxAmount = cart.reduce((sum, item) => sum + (item.total * item.tax_rate / 100), 0);
      const total = subtotal + taxAmount;

      const saleItems = cart.map(item => ({
        product_id: item.id,
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price,
        tax_rate: item.tax_rate
      }));

      const saleId = await SalesService.completeSale(
        profile.id,
        saleItems,
        subtotal,
        taxAmount,
        total,
        paymentMethod,
        {
          customerId: selectedCustomer?.id,
          customerName: selectedCustomer?.name,
          customerPhone: selectedCustomer?.phone,
          customerEmail: selectedCustomer?.email,
        }
      );

      toast.success('Sale completed successfully');
      clearCart();
      // Refresh sales history after completing a sale
      fetchSalesHistory();
      return saleId;
    } catch (error) {
      console.error('Unexpected error completing sale:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  }, [profile, cart, selectedCustomer, clearCart, fetchSalesHistory]);

  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);
  const cartTax = cart.reduce((sum, item) => sum + (item.total * item.tax_rate / 100), 0);

  return {
    cart,
    selectedCustomer,
    cartTotal,
    cartTax,
    salesHistory,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setSelectedCustomer,
    completeSale,
    searchCustomers,
    addCustomer,
    refetchSalesHistory
  };
};
