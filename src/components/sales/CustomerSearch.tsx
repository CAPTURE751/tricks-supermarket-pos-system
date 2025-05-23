
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Customer } from './SalesModule';

interface CustomerSearchProps {
  onSelectCustomer: (customer: Customer) => void;
}

// Sample customers data - in a real app, this would come from an API
const sampleCustomers: Customer[] = [
  { id: '1', name: 'John Doe', phone: '+254712345678', email: 'john@example.com', loyaltyPoints: 120 },
  { id: '2', name: 'Jane Smith', phone: '+254723456789', email: 'jane@example.com', loyaltyPoints: 85 },
  { id: '3', name: 'David Kamau', phone: '+254734567890', loyaltyPoints: 45 },
  { id: '4', name: 'Mary Wanjiku', phone: '+254745678901', email: 'mary@example.com' },
  { id: '5', name: 'Peter Omondi', phone: '+254756789012', loyaltyPoints: 210 },
];

export const CustomerSearch = ({ onSelectCustomer }: CustomerSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (term.length > 2) {
      const filtered = sampleCustomers.filter(customer => 
        customer.name.toLowerCase().includes(term.toLowerCase()) ||
        customer.phone.includes(term) ||
        (customer.email && customer.email.toLowerCase().includes(term.toLowerCase()))
      );
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleSelectCustomer = (customer: Customer) => {
    onSelectCustomer(customer);
    setShowResults(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search customers by name, phone, or email..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-8"
          onFocus={() => {
            if (searchTerm.length > 2) setShowResults(true);
          }}
        />
      </div>
      
      {showResults && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
          {searchResults.length > 0 ? (
            <div className="max-h-60 overflow-y-auto">
              {searchResults.map(customer => (
                <div 
                  key={customer.id}
                  className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
                  onClick={() => handleSelectCustomer(customer)}
                >
                  <div className="font-semibold">{customer.name}</div>
                  <div className="text-sm text-gray-400">{customer.phone}</div>
                  {customer.email && (
                    <div className="text-xs text-gray-400">{customer.email}</div>
                  )}
                  {customer.loyaltyPoints !== undefined && (
                    <div className="text-xs text-green-400">
                      Loyalty: {customer.loyaltyPoints} points
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 text-center text-gray-400">
              No customers found
              <div className="mt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowResults(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
