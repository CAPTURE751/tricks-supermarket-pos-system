
import { supabase } from '@/integrations/supabase/client';

export interface DatabaseSale {
  id: string;
  user_id: string;
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
  receipt_number: string;
  sale_date: string;
  branch_id: string | null;
  session_id: string | null;
  status: string;
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

export interface SaleWithItems extends DatabaseSale {
  sale_items: DatabaseSaleItem[];
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

export class SalesService {
  static async getSalesHistory(): Promise<SaleWithItems[]> {
    const { data: sales, error } = await supabase
      .from('sales')
      .select(`
        id,
        user_id,
        customer_id,
        customer_name,
        customer_phone,
        customer_email,
        subtotal,
        discount_amount,
        discount_percentage,
        tax_amount,
        total_amount,
        payment_method,
        amount_received,
        change_amount,
        sale_note,
        receipt_number,
        sale_date,
        branch_id,
        session_id,
        status,
        created_at,
        updated_at,
        sale_items (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sales history:', error);
      throw new Error('Failed to fetch sales history');
    }

    return sales as SaleWithItems[];
  }

  static async getSaleById(id: string): Promise<SaleWithItems> {
    const { data: sale, error } = await supabase
      .from('sales')
      .select(`
        id,
        user_id,
        customer_id,
        customer_name,
        customer_phone,
        customer_email,
        subtotal,
        discount_amount,
        discount_percentage,
        tax_amount,
        total_amount,
        payment_method,
        amount_received,
        change_amount,
        sale_note,
        receipt_number,
        sale_date,
        branch_id,
        session_id,
        status,
        created_at,
        updated_at,
        sale_items (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching sale:', error);
      throw new Error('Failed to fetch sale');
    }

    return sale as SaleWithItems;
  }

  static async getCustomers(): Promise<DatabaseCustomer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching customers:', error);
      throw new Error('Failed to fetch customers');
    }

    return data || [];
  }

  static async searchCustomers(query: string): Promise<DatabaseCustomer[]> {
    if (!query.trim()) {
      return [];
    }

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .or(`name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(10);

    if (error) {
      console.error('Error searching customers:', error);
      throw new Error('Failed to search customers');
    }

    return data || [];
  }

  static async addCustomer(customerData: Omit<DatabaseCustomer, 'id' | 'created_at' | 'updated_at' | 'loyalty_points' | 'total_purchases' | 'last_purchase_date'> & Partial<Pick<DatabaseCustomer, 'loyalty_points' | 'total_purchases' | 'last_purchase_date'>>): Promise<DatabaseCustomer> {
    const { data, error } = await supabase
      .from('customers')
      .insert([customerData])
      .select()
      .single();

    if (error) {
      console.error('Error adding customer:', error);
      throw new Error('Failed to add customer');
    }

    return data;
  }

  static async completeSale(
    userId: string,
    items: any[],
    subtotal: number,
    taxAmount: number,
    totalAmount: number,
    paymentMethod: string,
    options: any = {}
  ): Promise<string> {
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
      throw new Error('Failed to complete sale: ' + error.message);
    }

    return data;
  }
}
