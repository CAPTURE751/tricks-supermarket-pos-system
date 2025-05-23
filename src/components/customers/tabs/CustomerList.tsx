
import { useState } from 'react';
import { Plus, Search, UserPlus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockCustomers } from '../data/mockData';
import { User } from '@/hooks/useAuth';
import { CustomerForm } from '../components/CustomerForm';
import { Customer } from '../types/customer-types';

interface CustomerListProps {
  user: User;
  onViewDetails: (customerId: string) => void;
}

export const CustomerList = ({ user, onViewDetails }: CustomerListProps) => {
  const [customers, setCustomers] = useState(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrUpdateCustomer = (customerData: Customer) => {
    if (selectedCustomer) {
      // Update existing customer
      setCustomers(prev => prev.map(c => 
        c.id === selectedCustomer.id ? {...customerData, id: selectedCustomer.id} : c
      ));
    } else {
      // Add new customer
      const newCustomer = {
        ...customerData,
        id: `C${String(customers.length + 1).padStart(3, '0')}`,
        joinDate: new Date().toISOString().split('T')[0],
        loyaltyPoints: 0,
        totalSpent: 0,
        outstandingBalance: 0
      };
      setCustomers(prev => [...prev, newCustomer]);
    }
    
    setSelectedCustomer(null);
    setIsDialogOpen(false);
  };

  const handleDeleteCustomer = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDialogOpen(true);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-white">Customer List</h3>
          <p className="text-gray-400">Manage your customers and their details</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedCustomer(null)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
            </DialogHeader>
            <CustomerForm 
              customer={selectedCustomer || undefined} 
              onSubmit={handleAddOrUpdateCustomer}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search customers by name, phone, email or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-gray-800 border-gray-700 text-white"
        />
      </div>
      
      <div className="rounded-md border border-gray-700">
        <Table>
          <TableHeader className="bg-gray-800">
            <TableRow className="border-gray-700">
              <TableHead className="text-gray-300">ID</TableHead>
              <TableHead className="text-gray-300">Name</TableHead>
              <TableHead className="text-gray-300">Category</TableHead>
              <TableHead className="text-gray-300">Phone</TableHead>
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">Loyalty Points</TableHead>
              <TableHead className="text-gray-300">Outstanding</TableHead>
              <TableHead className="text-gray-300 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                  No customers found. Add a new customer to get started.
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="border-gray-700">
                  <TableCell className="font-medium text-white">{customer.id}</TableCell>
                  <TableCell className="text-white">{customer.name}</TableCell>
                  <TableCell>
                    <span className={`
                      px-2 py-1 rounded-full text-xs
                      ${customer.category === 'VIP' ? 'bg-purple-900 text-purple-200' : ''}
                      ${customer.category === 'Regular' ? 'bg-blue-900 text-blue-200' : ''}
                      ${customer.category === 'Wholesale' ? 'bg-green-900 text-green-200' : ''}
                      ${customer.category === 'Walk-in' ? 'bg-gray-700 text-gray-300' : ''}
                      ${customer.category === 'New' ? 'bg-yellow-900 text-yellow-200' : ''}
                    `}>
                      {customer.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-300">{customer.phone}</TableCell>
                  <TableCell className="text-gray-300">{customer.email}</TableCell>
                  <TableCell className="text-gray-300">{customer.loyaltyPoints}</TableCell>
                  <TableCell className={customer.outstandingBalance > 0 ? 'text-red-400' : 'text-gray-300'}>
                    {customer.outstandingBalance > 0 ? `KSh ${customer.outstandingBalance.toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onViewDetails(customer.id)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditCustomer(customer)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteCustomer(customer.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
