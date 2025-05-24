
import { supabase } from '@/integrations/supabase/client';

export interface DatabaseProduct {
  id: string;
  name: string;
  sku: string;
  barcode: string | null;
  description: string | null;
  category_id: string | null;
  cost_price: number;
  selling_price: number;
  stock_quantity: number;
  min_stock_level: number;
  max_stock_level: number;
  unit: string;
  tax_rate: number;
  location: string | null;
  expiry_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  categories?: {
    name: string;
  };
}

export interface DatabaseCategory {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const ProductsService = {
  // Fetch all active products with their categories
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          name
        )
      `)
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    return data as DatabaseProduct[];
  },

  // Fetch all active categories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    return data as DatabaseCategory[];
  },

  // Update product stock when a sale is made
  async updateStock(productId: string, quantityChange: number, referenceNumber?: string) {
    const { data, error } = await supabase.rpc('update_product_stock', {
      p_product_id: productId,
      p_quantity_change: quantityChange,
      p_movement_type: 'sale',
      p_reference_number: referenceNumber,
      p_notes: 'Sale transaction',
      p_created_by: 'POS System'
    });

    if (error) {
      console.error('Error updating stock:', error);
      throw error;
    }

    return data;
  },

  // Add a new product
  async addProduct(product: Omit<DatabaseProduct, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) {
      console.error('Error adding product:', error);
      throw error;
    }

    return data as DatabaseProduct;
  },

  // Update an existing product
  async updateProduct(id: string, updates: Partial<DatabaseProduct>) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }

    return data as DatabaseProduct;
  },

  // Add a new category
  async addCategory(category: Omit<DatabaseCategory, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();

    if (error) {
      console.error('Error adding category:', error);
      throw error;
    }

    return data as DatabaseCategory;
  }
};
