
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Plus, User, Phone, Mail } from 'lucide-react';
import { Customer } from './SalesModule';
import { useSales } from '@/hooks/useSales';
import { DatabaseCustomer } from '@/services/sales-service';

interface CustomerSearchProps {
  onSelectCustomer: (customer: Customer) => void;
}

// Transform database customer to UI customer format
const transformCustomer = (dbCustomer: DatabaseCustomer): Customer => ({
  id: dbCustomer.id,
  name: dbCustomer.name,
  phone: dbCustomer.phone || '',
  email: dbCustomer.email || undefined,
  loyaltyPoints: dbCustomer.loyalty_points
});

export const CustomerSearch = ({ onSelectCustomer }: CustomerSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<DatabaseCustomer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const { searchCustomers, addCustomer } = useSales();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm.trim().length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchCustomers(searchTerm.trim());
          setSearchResults(results);
        } catch (error) {
          console.error('Search failed:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, searchCustomers]);

  const handleSelectCustomer = (customer: DatabaseCustomer) => {
    onSelectCustomer(transformCustomer(customer));
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.name.trim() || !newCustomer.phone.trim()) {
      return;
    }

    try {
      const createdCustomer = await addCustomer({
        name: newCustomer.name.trim(),
        phone: newCustomer.phone.trim(),
        email: newCustomer.email.trim() || null,
        address: newCustomer.address.trim() || null,
        is_active: true
      });

      onSelectCustomer(transformCustomer(createdCustomer));
      setShowAddDialog(false);
      setNewCustomer({ name: '', phone: '', email: '', address: '' });
      setSearchTerm('');
    } catch (error) {
      console.error('Failed to add customer:', error);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search customers by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card className="border border-gray-600">
          <CardContent className="p-2">
            <div className="max-h-40 overflow-y-auto space-y-1">
              {searchResults.map(customer => (
                <div
                  key={customer.id}
                  onClick={() => handleSelectCustomer(customer)}
                  className="p-2 hover:bg-gray-700 rounded cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-gray-400">{customer.phone}</div>
                    {customer.loyalty_points > 0 && (
                      <div className="text-xs text-green-400">
                        {customer.loyalty_points} loyalty points
                      </div>
                    )}
                  </div>
                  <User className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isSearching && (
        <div className="text-center py-2 text-gray-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
        </div>
      )}

      {/* Add New Customer */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add New Customer
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Customer name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <div className="relative">
                <Phone className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+254..."
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="customer@example.com"
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Customer address"
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddCustomer}
                disabled={!newCustomer.name.trim() || !newCustomer.phone.trim()}
              >
                Add Customer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
