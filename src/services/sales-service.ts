
import { supabase } from '@/integrations/supabase/client';

export interface DatabaseSale {
  id: string;
  receipt_number: string;
  user_id: string | null;
  customer_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  subtotal: number;
  discount_amount: number;
  discount_percentage: number;
  tax_amount: number;
  total_amount: number;
  payment_method: string;
  amount_received: number;
  change_amount: number;
  sale_note: string | null;
  status: string;
  branch_id: string | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DatabaseSaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  tax_rate: number;
  created_at: string;
}

export interface DatabaseCustomer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  loyalty_points: number;
  total_purchases: number;
  last_purchase_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SaleWithItems extends DatabaseSale {
  sale_items: DatabaseSaleItem[];
}

export const SalesService = {
  // Complete a sale transaction
  async completeSale(
    userId: string,
    items: any[],
    subtotal: number,
    taxAmount: number,
    totalAmount: number,
    paymentMethod: string,
    options: {
      customerId?: string;
      customerName?: string;
      customerPhone?: string;
      customerEmail?: string;
      discountAmount?: number;
      discountPercentage?: number;
      amountReceived?: number;
      changeAmount?: number;
      saleNote?: string;
      referenceNumber?: string;
    } = {}
  ) {
    const { data, error } = await supabase.rpc('complete_sale', {
      p_user_id: userId,
      p_items: items,
      p_subtotal: subtotal,
      p_tax_amount: taxAmount,
      p_total_amount: totalAmount,
      p_payment_method: paymentMethod,
      p_customer_id: options.customerId || null,
      p_customer_name: options.customerName || null,
      p_customer_phone: options.customerPhone || null,
      p_customer_email: options.customerEmail || null,
      p_discount_amount: options.discountAmount || 0,
      p_discount_percentage: options.discountPercentage || 0,
      p_amount_received: options.amountReceived || totalAmount,
      p_change_amount: options.changeAmount || 0,
      p_sale_note: options.saleNote || null,
      p_reference_number: options.referenceNumber || null
    });

    if (error) {
      console.error('Error completing sale:', error);
      throw error;
    }

    return data;
  },

  // Get sales history with pagination
  async getSalesHistory(limit: number = 50, offset: number = 0) {
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        sale_items (
          id,
          product_id,
          product_name,
          product_sku,
          quantity,
          unit_price,
          total_price,
          tax_rate
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching sales history:', error);
      throw error;
    }

    return data as SaleWithItems[];
  },

  // Get a specific sale by ID
  async getSaleById(saleId: string) {
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        sale_items (
          id,
          product_id,
          product_name,
          product_sku,
          quantity,
          unit_price,
          total_price,
          tax_rate
        )
      `)
      .eq('id', saleId)
      .single();

    if (error) {
      console.error('Error fetching sale:', error);
      throw error;
    }

    return data as SaleWithItems;
  },

  // Get customers
  async getCustomers() {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }

    return data as DatabaseCustomer[];
  },

  // Search customers by name or phone
  async searchCustomers(query: string) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('name')
      .limit(10);

    if (error) {
      console.error('Error searching customers:', error);
      throw error;
    }

    return data as DatabaseCustomer[];
  },

  // Add a new customer
  async addCustomer(customer: Omit<DatabaseCustomer, 'id' | 'created_at' | 'updated_at' | 'loyalty_points' | 'total_purchases' | 'last_purchase_date'>) {
    const { data, error } = await supabase
      .from('customers')
      .insert([customer])
      .select()
      .single();

    if (error) {
      console.error('Error adding customer:', error);
      throw error;
    }

    return data as DatabaseCustomer;
  }
};
