
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User } from '@/hooks/useAuth';
import { Customer } from '../types/customer-types';
import { mockCustomers, getCustomerTransactions, getCustomerTier } from '../data/mockData';

interface CustomerDetailsProps {
  user: User;
  customerId?: string;
}

export const CustomerDetails = ({ user, customerId }: CustomerDetailsProps) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>(customerId);
  const [activeTab, setActiveTab] = useState('info');
  
  const customer = selectedCustomerId 
    ? mockCustomers.find(c => c.id === selectedCustomerId) 
    : mockCustomers[0];
  
  if (!customer) return <div>Customer not found</div>;
  
  const transactions = getCustomerTransactions(customer.id);
  const customerTier = getCustomerTier(customer.totalSpent);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-white">{customer.name}</h3>
          <p className="text-gray-400">Customer Profile</p>
        </div>
        
        {/* Customer selector for demo purposes */}
        <div className="flex">
          <select 
            value={selectedCustomerId || customer.id} 
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded-md p-2"
          >
            {mockCustomers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </header>
      
      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-1 bg-gray-800 border-gray-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle>Customer Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-4">
              {customer.profileImage ? (
                <img 
                  src={customer.profileImage} 
                  alt={customer.name} 
                  className="h-32 w-32 rounded-full object-cover border-4 border-green-500"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-green-500 flex items-center justify-center text-white text-4xl font-bold">
                  {customer.name.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">ID:</span>
                <span>{customer.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Phone:</span>
                <span>{customer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="truncate">{customer.email}</span>
              </div>
              {customer.gender && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Gender:</span>
                  <span>{customer.gender}</span>
                </div>
              )}
              {customer.birthDate && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Birth Date:</span>
                  <span>{customer.birthDate}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Customer Since:</span>
                <span>{customer.joinDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Purchase:</span>
                <span>{customer.lastPurchase || 'Never'}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Edit Profile</Button>
          </CardFooter>
        </Card>
        
        <Card className="col-span-2 bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle>Customer Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue={activeTab} 
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="bg-gray-700">
                <TabsTrigger value="info">Summary</TabsTrigger>
                <TabsTrigger value="purchases">Purchases</TabsTrigger>
                <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
                <TabsTrigger value="credit">Credit</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-gray-400">Total Spent</div>
                    <div className="text-2xl font-bold">KSh {customer.totalSpent.toFixed(2)}</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-gray-400">Loyalty Points</div>
                    <div className="text-2xl font-bold">{customer.loyaltyPoints}</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-gray-400">Category</div>
                    <div className="text-2xl font-bold">{customer.category}</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-gray-400">Outstanding Balance</div>
                    <div className="text-2xl font-bold text-red-400">
                      {customer.outstandingBalance > 0 
                        ? `KSh ${customer.outstandingBalance.toFixed(2)}` 
                        : 'KSh 0.00'}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold mb-4">Address Information</h4>
                  <p className="p-4 bg-gray-700 rounded-lg">
                    {customer.address || 'No address information'}
                  </p>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold mb-4">Marketing Preferences</h4>
                  <p className="p-4 bg-gray-700 rounded-lg flex justify-between">
                    <span>Marketing Consent</span>
                    <span className={customer.hasMarketingConsent ? 'text-green-400' : 'text-red-400'}>
                      {customer.hasMarketingConsent ? 'Opted In' : 'Opted Out'}
                    </span>
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="purchases" className="pt-4 space-y-4">
                {transactions.length > 0 ? (
                  <Table>
                    <TableHeader className="bg-gray-700">
                      <TableRow className="border-gray-600">
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id} className="border-gray-600">
                          <TableCell className="font-medium">{transaction.id}</TableCell>
                          <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                          <TableCell>{transaction.items.length}</TableCell>
                          <TableCell>KSh {transaction.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs
                              ${transaction.paymentStatus === 'Paid' ? 'bg-green-900 text-green-200' : ''}
                              ${transaction.paymentStatus === 'Partial' ? 'bg-yellow-900 text-yellow-200' : ''}
                              ${transaction.paymentStatus === 'Credit' ? 'bg-red-900 text-red-200' : ''}
                            `}>
                              {transaction.paymentStatus}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center p-8 bg-gray-700 rounded-lg">
                    <p>No transaction history found for this customer.</p>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <Button variant="outline">View All Transactions</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="loyalty" className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader>
                      <CardTitle>Loyalty Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="text-gray-400">Current Tier</div>
                        <div className="text-2xl font-bold">{customerTier.name}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Points Balance</div>
                        <div className="text-2xl font-bold">{customer.loyaltyPoints}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Discount Rate</div>
                        <div className="text-2xl font-bold">{customerTier.discountPercent}%</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader>
                      <CardTitle>Next Tier</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {customerTier.name !== 'Platinum' ? (
                        <>
                          <div>
                            <div className="text-gray-400">Next Tier</div>
                            <div className="text-2xl font-bold">
                              {customerTier.name === 'Bronze' ? 'Silver' : 
                               customerTier.name === 'Silver' ? 'Gold' : 'Platinum'}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400">Required Spending</div>
                            <div className="text-xl font-bold">
                              {customerTier.name === 'Bronze' 
                                ? `KSh ${(10000 - customer.totalSpent).toFixed(2)} more` : 
                               customerTier.name === 'Silver'
                                ? `KSh ${(50000 - customer.totalSpent).toFixed(2)} more` :
                                `KSh ${(100000 - customer.totalSpent).toFixed(2)} more`}
                            </div>
                          </div>
                          <div className="pt-4">
                            <Button variant="outline" className="w-full">View Benefits</Button>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <div className="text-2xl font-bold mb-2">Top Tier Reached!</div>
                            <div className="text-gray-400">You're enjoying our best benefits</div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Points History</h4>
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <p>Points history visualization would be displayed here.</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="credit" className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-gray-400">Credit Limit</div>
                    <div className="text-2xl font-bold">
                      {customer.creditLimit 
                        ? `KSh ${customer.creditLimit.toFixed(2)}` 
                        : 'No credit limit set'}
                    </div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-gray-400">Outstanding Balance</div>
                    <div className="text-2xl font-bold text-red-400">
                      KSh {customer.outstandingBalance.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Credit Transactions</h4>
                  {transactions.filter(t => t.paymentStatus === 'Credit' || t.paymentStatus === 'Partial').length > 0 ? (
                    <Table>
                      <TableHeader className="bg-gray-700">
                        <TableRow className="border-gray-600">
                          <TableHead>Transaction ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Amount Paid</TableHead>
                          <TableHead>Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions
                          .filter(t => t.paymentStatus === 'Credit' || t.paymentStatus === 'Partial')
                          .map((transaction) => (
                          <TableRow key={transaction.id} className="border-gray-600">
                            <TableCell className="font-medium">{transaction.id}</TableCell>
                            <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                            <TableCell>KSh {transaction.total.toFixed(2)}</TableCell>
                            <TableCell>KSh {transaction.amountPaid.toFixed(2)}</TableCell>
                            <TableCell className="text-red-400">KSh {transaction.balance.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center p-8 bg-gray-700 rounded-lg">
                      <p>No credit transactions found for this customer.</p>
                    </div>
                  )}
                </div>
                
                {customer.outstandingBalance > 0 && (
                  <div className="flex justify-end">
                    <Button>Record Payment</Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
