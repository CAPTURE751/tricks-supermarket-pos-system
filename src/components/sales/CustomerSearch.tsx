
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Plus, User } from 'lucide-react';
import { DatabaseCustomer } from '@/services/sales-service';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  loyaltyPoints?: number;
}

interface CustomerSearchProps {
  onSelectCustomer: (customer: Customer) => void;
  searchCustomers: (query: string) => Promise<DatabaseCustomer[]>;
  addCustomer: (customerData: Omit<DatabaseCustomer, 'id' | 'created_at' | 'updated_at' | 'loyalty_points' | 'total_purchases' | 'last_purchase_date'> & Partial<Pick<DatabaseCustomer, 'loyalty_points' | 'total_purchases' | 'last_purchase_date'>>) => Promise<DatabaseCustomer>;
}

export const CustomerSearch = ({ onSelectCustomer, searchCustomers, addCustomer }: CustomerSearchProps) => {
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

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    if (query.length >= 2) {
      setIsSearching(true);
      try {
        const results = await searchCustomers(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectCustomer = (customer: DatabaseCustomer) => {
    onSelectCustomer({
      id: customer.id,
      name: customer.name,
      phone: customer.phone || '',
      email: customer.email || undefined,
      loyaltyPoints: customer.loyalty_points
    });
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) {
      return;
    }

    try {
      const customer = await addCustomer({
        name: newCustomer.name,
        phone: newCustomer.phone,
        email: newCustomer.email || null,
        address: newCustomer.address || null,
        is_active: true
      });

      handleSelectCustomer(customer);
      setShowAddDialog(false);
      setNewCustomer({ name: '', phone: '', email: '', address: '' });
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search customers by name, phone, or email..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      {isSearching && (
        <div className="text-center py-2">
          <p className="text-gray-400">Searching...</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {searchResults.map((customer) => (
            <Card key={customer.id} className="cursor-pointer hover:bg-gray-700 transition-colors">
              <CardContent className="p-3" onClick={() => handleSelectCustomer(customer)}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{customer.name}</p>
                    <p className="text-sm text-gray-400">{customer.phone}</p>
                    {customer.email && (
                      <p className="text-sm text-gray-400">{customer.email}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-400">
                      {customer.loyalty_points} points
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {searchTerm.length >= 2 && !isSearching && searchResults.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-400 mb-2">No customers found</p>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add New Customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Add New Customer
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter customer name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter address"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddCustomer}
                    disabled={!newCustomer.name || !newCustomer.phone}
                    className="flex-1"
                  >
                    Add Customer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};
