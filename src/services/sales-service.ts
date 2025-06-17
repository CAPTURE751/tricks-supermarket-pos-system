import { supabase } from '@/integrations/supabase/client';

export interface DatabaseSale {
  id: string;
  cashier_id: string;
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
        cashier_id,
        customer_id,
        total_amount,
        tax_amount,
        payment_method,
        receipt_number,
        sale_date,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sales history:', error);
      throw new Error('Failed to fetch sales history');
    }

    // Fetch sale items separately for each sale
    const salesWithItems: SaleWithItems[] = [];
    
    for (const sale of sales || []) {
      const { data: saleItems, error: itemsError } = await supabase
        .from('sale_items')
        .select('*')
        .eq('sale_id', sale.id);

      if (itemsError) {
        console.error('Error fetching sale items:', itemsError);
      }

      salesWithItems.push({
        id: sale.id,
        cashier_id: sale.cashier_id,
        customer_id: sale.customer_id,
        customer_name: null,
        customer_phone: null,
        customer_email: null,
        subtotal: sale.total_amount - (sale.tax_amount || 0),
        discount_amount: 0,
        discount_percentage: 0,
        tax_amount: sale.tax_amount || 0,
        total_amount: sale.total_amount,
        payment_method: sale.payment_method || 'cash',
        amount_received: sale.total_amount,
        change_amount: 0,
        sale_note: null,
        receipt_number: sale.receipt_number || '',
        sale_date: sale.sale_date || sale.created_at,
        branch_id: null,
        session_id: null,
        status: 'completed',
        created_at: sale.created_at,
        updated_at: sale.updated_at,
        sale_items: saleItems || []
      });
    }

    return salesWithItems;
  }

  static async getSaleById(id: string): Promise<SaleWithItems> {
    const { data: sale, error } = await supabase
      .from('sales')
      .select(`
        id,
        cashier_id,
        customer_id,
        total_amount,
        tax_amount,
        payment_method,
        receipt_number,
        sale_date,
        created_at,
        updated_at
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching sale:', error);
      throw new Error('Failed to fetch sale');
    }

    // Fetch sale items separately
    const { data: saleItems, error: itemsError } = await supabase
      .from('sale_items')
      .select('*')
      .eq('sale_id', id);

    if (itemsError) {
      console.error('Error fetching sale items:', itemsError);
    }

    return {
      id: sale.id,
      cashier_id: sale.cashier_id,
      customer_id: sale.customer_id,
      customer_name: null,
      customer_phone: null,
      customer_email: null,
      subtotal: sale.total_amount - (sale.tax_amount || 0),
      discount_amount: 0,
      discount_percentage: 0,
      tax_amount: sale.tax_amount || 0,
      total_amount: sale.total_amount,
      payment_method: sale.payment_method || 'cash',
      amount_received: sale.total_amount,
      change_amount: 0,
      sale_note: null,
      receipt_number: sale.receipt_number || '',
      sale_date: sale.sale_date || sale.created_at,
      branch_id: null,
      session_id: null,
      status: 'completed',
      created_at: sale.created_at,
      updated_at: sale.updated_at,
      sale_items: saleItems || []
    };
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
    const { data, error } = await supabase
      .from('sales')
      .insert([{
        cashier_id: userId,
        customer_id: options.customerId || null,
        total_amount: totalAmount,
        tax_amount: taxAmount,
        payment_method: paymentMethod,
        transaction_id: options.referenceNumber || null,
        receipt_number: `RCP-${Date.now()}`
      }])
      .select()
      .single();

    if (error) {
      console.error('Error completing sale:', error);
      throw new Error('Failed to complete sale: ' + error.message);
    }

    if (data && items.length > 0) {
      const saleItems = items.map(item => ({
        sale_id: data.id,
        product_id: item.product_id || item.id,
        product_name: item.name,
        product_sku: item.sku || '',
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
        tax_rate: 0
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems);

      if (itemsError) {
        console.error('Error adding sale items:', itemsError);
      }
    }

    return data.id;
  }
}
