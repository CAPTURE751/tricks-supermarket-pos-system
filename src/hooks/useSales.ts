
import { useState, useCallback } from 'react';
import { useAuth } from '@/components/auth/AdminOnlyAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

      const { data: saleId, error } = await supabase.rpc('complete_sale', {
        p_user_id: profile.id,
        p_items: saleItems,
        p_subtotal: subtotal,
        p_tax_amount: taxAmount,
        p_total_amount: total,
        p_payment_method: paymentMethod,
        p_customer_id: selectedCustomer?.id || null,
        p_customer_name: selectedCustomer?.name || null,
        p_customer_phone: selectedCustomer?.phone || null,
        p_customer_email: selectedCustomer?.email || null
      });

      if (error) {
        console.error('Sale completion error:', error);
        toast.error('Failed to complete sale');
        return null;
      }

      toast.success('Sale completed successfully');
      clearCart();
      return saleId;
    } catch (error) {
      console.error('Unexpected error completing sale:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  }, [profile, cart, selectedCustomer, clearCart]);

  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);
  const cartTax = cart.reduce((sum, item) => sum + (item.total * item.tax_rate / 100), 0);

  return {
    cart,
    selectedCustomer,
    cartTotal,
    cartTax,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setSelectedCustomer,
    completeSale
  };
};
