
import { useState, useEffect } from 'react';
import { SalesService, DatabaseSale, DatabaseCustomer, SaleWithItems } from '@/services/sales-service';
import { toast } from 'sonner';

export const useSales = () => {
  const [salesHistory, setSalesHistory] = useState<SaleWithItems[]>([]);
  const [customers, setCustomers] = useState<DatabaseCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSalesHistory = async () => {
    try {
      setLoading(true);
      const data = await SalesService.getSalesHistory();
      setSalesHistory(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sales history';
      setError(errorMessage);
      toast.error('Failed to load sales history');
      console.error('Error fetching sales history:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await SalesService.getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error('Error fetching customers:', err);
      toast.error('Failed to load customers');
    }
  };

  const completeSale = async (
    userId: string,
    items: any[],
    subtotal: number,
    taxAmount: number,
    totalAmount: number,
    paymentMethod: string,
    options: any = {}
  ) => {
    try {
      const saleId = await SalesService.completeSale(
        userId,
        items,
        subtotal,
        taxAmount,
        totalAmount,
        paymentMethod,
        options
      );
      
      // Refresh sales history to show the new sale
      await fetchSalesHistory();
      
      toast.success('Sale completed successfully');
      return saleId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete sale';
      toast.error(errorMessage);
      throw err;
    }
  };

  const searchCustomers = async (query: string) => {
    try {
      const data = await SalesService.searchCustomers(query);
      return data;
    } catch (err) {
      console.error('Error searching customers:', err);
      toast.error('Failed to search customers');
      return [];
    }
  };

  const addCustomer = async (customerData: any) => {
    try {
      const newCustomer = await SalesService.addCustomer(customerData);
      setCustomers(prev => [...prev, newCustomer]);
      toast.success('Customer added successfully');
      return newCustomer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add customer';
      toast.error(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchSalesHistory();
    fetchCustomers();
  }, []);

  return {
    salesHistory,
    customers,
    loading,
    error,
    completeSale,
    searchCustomers,
    addCustomer,
    refetchSalesHistory: fetchSalesHistory,
    refetchCustomers: fetchCustomers
  };
};
