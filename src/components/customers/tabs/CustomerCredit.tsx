
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockCustomers, mockTransactions, mockPayments } from '../data/mockData';

interface CustomerCreditProps {
  user: User;
}

export const CustomerCredit = ({ user }: CustomerCreditProps) => {
  const [selectedCustomer, setSelectedCustomer] = useState(mockCustomers[0]);
  
  const creditTransactions = mockTransactions.filter(t => 
    t.customerId === selectedCustomer.id && 
    (t.paymentStatus === 'Credit' || t.paymentStatus === 'Partial')
  );
  
  const customerPayments = mockPayments.filter(p => p.customerId === selectedCustomer.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Customer Credit Management</h2>
        <p className="text-gray-400">Track and manage customer credit and outstanding balances</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle>Credit Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-400">Total Outstanding</div>
              <div className="text-2xl font-bold text-red-400">
                KSh {mockCustomers.reduce((sum, c) => sum + c.outstandingBalance, 0).toFixed(2)}
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-400">Customers with Credit</div>
              <div className="text-2xl font-bold">
                {mockCustomers.filter(c => c.outstandingBalance > 0).length}
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-400">Average Outstanding</div>
              <div className="text-2xl font-bold">
                KSh {(mockCustomers.reduce((sum, c) => sum + c.outstandingBalance, 0) / 
                Math.max(1, mockCustomers.filter(c => c.outstandingBalance > 0).length)).toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle>Customers with Outstanding Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-gray-700">
                <TableRow className="border-gray-600">
                  <TableHead>Customer</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>Credit Limit</TableHead>
                  <TableHead>% Used</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCustomers
                  .filter(c => c.outstandingBalance > 0)
                  .map((customer) => {
                    const percentUsed = customer.creditLimit 
                      ? (customer.outstandingBalance / customer.creditLimit) * 100 
                      : 100;
                    
                    return (
                      <TableRow 
                        key={customer.id} 
                        className={`border-gray-600 cursor-pointer ${selectedCustomer.id === customer.id ? 'bg-gray-700' : ''}`}
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell className="text-red-400">KSh {customer.outstandingBalance.toFixed(2)}</TableCell>
                        <TableCell>
                          {customer.creditLimit 
                            ? `KSh ${customer.creditLimit.toFixed(2)}` 
                            : 'No limit set'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-full h-2 rounded-full bg-gray-600">
                              <div 
                                className={`h-2 rounded-full ${
                                  percentUsed >= 90 ? 'bg-red-500' : 
                                  percentUsed >= 70 ? 'bg-amber-500' : 
                                  'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(100, percentUsed)}%` }}
                              ></div>
                            </div>
                            <span>{percentUsed.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm">Record Payment</Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-800 text-white border-gray-700">
                              <DialogHeader>
                                <DialogTitle>Record Payment for {customer.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div>
                                  <label className="block mb-2 text-sm font-medium">Payment Amount</label>
                                  <Input 
                                    type="number" 
                                    placeholder="0.00" 
                                    className="bg-gray-700 border-gray-600 text-white" 
                                  />
                                </div>
                                <div>
                                  <label className="block mb-2 text-sm font-medium">Payment Method</label>
                                  <select className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white">
                                    <option value="cash">Cash</option>
                                    <option value="mobile">Mobile Money</option>
                                    <option value="card">Credit/Debit Card</option>
                                    <option value="bank">Bank Transfer</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block mb-2 text-sm font-medium">Reference</label>
                                  <Input 
                                    placeholder="Payment reference" 
                                    className="bg-gray-700 border-gray-600 text-white" 
                                  />
                                </div>
                                <div className="flex justify-end space-x-2 pt-2">
                                  <Button variant="outline">Cancel</Button>
                                  <Button>Save Payment</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle>Credit Transactions - {selectedCustomer.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {creditTransactions.length > 0 ? (
              <Table>
                <TableHeader className="bg-gray-700">
                  <TableRow className="border-gray-600">
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creditTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="border-gray-600">
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>KSh {transaction.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs
                          ${transaction.paymentStatus === 'Partial' ? 'bg-amber-900 text-amber-200' : ''}
                          ${transaction.paymentStatus === 'Credit' ? 'bg-red-900 text-red-200' : ''}
                        `}>
                          {transaction.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-red-400">KSh {transaction.balance.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No credit transactions found for this customer.
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle>Payment History - {selectedCustomer.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {customerPayments.length > 0 ? (
              <Table>
                <TableHeader className="bg-gray-700">
                  <TableRow className="border-gray-600">
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerPayments.map((payment) => (
                    <TableRow key={payment.id} className="border-gray-600">
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-green-400">KSh {payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>{payment.reference}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No payment history found for this customer.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Credit Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold mb-2">Credit Limits by Customer Category</h3>
              <Table>
                <TableHeader className="bg-gray-700">
                  <TableRow className="border-gray-600">
                    <TableHead>Category</TableHead>
                    <TableHead>Default Limit</TableHead>
                    <TableHead>Max Credit Days</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-gray-600">
                    <TableCell>VIP</TableCell>
                    <TableCell>KSh 50,000</TableCell>
                    <TableCell>30 days</TableCell>
                  </TableRow>
                  <TableRow className="border-gray-600">
                    <TableCell>Regular</TableCell>
                    <TableCell>KSh 10,000</TableCell>
                    <TableCell>15 days</TableCell>
                  </TableRow>
                  <TableRow className="border-gray-600">
                    <TableCell>Wholesale</TableCell>
                    <TableCell>KSh 100,000</TableCell>
                    <TableCell>45 days</TableCell>
                  </TableRow>
                  <TableRow className="border-gray-600">
                    <TableCell>Walk-in</TableCell>
                    <TableCell>KSh 0</TableCell>
                    <TableCell>0 days</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Button className="w-full mt-4" variant="outline">Edit Default Limits</Button>
            </div>
            
            <div>
              <h3 className="font-bold mb-2">Automated Notifications</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <span>Payment Due Reminder</span>
                  <span className="text-green-400">Enabled</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <span>Payment Overdue Alert</span>
                  <span className="text-green-400">Enabled</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <span>Credit Limit Warning</span>
                  <span className="text-green-400">Enabled</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <span>Payment Received Confirmation</span>
                  <span className="text-green-400">Enabled</span>
                </div>
                <Button className="w-full mt-4" variant="outline">Configure Notifications</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
