
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockCustomers, loyaltyTiers } from '../data/mockData';

interface CustomerLoyaltyProps {
  user: User;
}

export const CustomerLoyalty = ({ user }: CustomerLoyaltyProps) => {
  const [activeTab, setActiveTab] = useState('program');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Loyalty Program Management</h2>
        <p className="text-gray-400">Manage customer rewards and loyalty program settings</p>
      </div>
      
      <Tabs 
        defaultValue={activeTab} 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="bg-gray-800 border border-gray-700">
          <TabsTrigger value="program" className="data-[state=active]:bg-green-500">
            Program Settings
          </TabsTrigger>
          <TabsTrigger value="points" className="data-[state=active]:bg-green-500">
            Points Management
          </TabsTrigger>
          <TabsTrigger value="rewards" className="data-[state=active]:bg-green-500">
            Rewards
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="program" className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>Loyalty Program Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span>Program Name</span>
                    <span className="font-medium">Jeff Tricks Rewards</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span>Points per KSh spent</span>
                    <span className="font-medium">1 point per KSh 10</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span>Points Expiration</span>
                    <span className="font-medium">12 months</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span>Point Redemption Value</span>
                    <span className="font-medium">KSh 1 per 10 points</span>
                  </div>
                </div>
                <Button className="w-full">Edit Program Settings</Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>Loyalty Tiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loyaltyTiers.map((tier, index) => (
                    <div key={tier.id} className="bg-gray-700 p-4 rounded-lg flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ 
                          backgroundColor: 
                            tier.name === 'Bronze' ? '#CD7F32' : 
                            tier.name === 'Silver' ? '#C0C0C0' : 
                            tier.name === 'Gold' ? '#FFD700' : 
                            '#E5E4E2'
                        }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold">{tier.name}</h4>
                        <p className="text-sm text-gray-400">
                          {tier.threshold === 0 
                            ? 'Starting tier'
                            : `KSh ${tier.threshold.toLocaleString()} spent`}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-400">{tier.discountPercent}% discount</div>
                        <div className="text-sm text-gray-400">{tier.pointsMultiplier}x points</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4">Edit Tiers</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="points" className="pt-6">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>Customer Points Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-gray-700">
                  <TableRow className="border-gray-600">
                    <TableHead>ID</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Current Points</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Last Points Earned</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCustomers.map((customer) => (
                    <TableRow key={customer.id} className="border-gray-600">
                      <TableCell className="font-medium">{customer.id}</TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.loyaltyPoints}</TableCell>
                      <TableCell>
                        {customer.totalSpent >= 100000 ? 'Platinum' :
                         customer.totalSpent >= 50000 ? 'Gold' :
                         customer.totalSpent >= 10000 ? 'Silver' : 'Bronze'}
                      </TableCell>
                      <TableCell>{customer.lastPurchase ? new Date(customer.lastPurchase).toLocaleDateString() : 'Never'}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="mr-2">Adjust Points</Button>
                        <Button size="sm">Points History</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rewards" className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>5% Discount</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-gray-400">Points Required</div>
                  <div className="text-2xl font-bold">100 points</div>
                </div>
                <p className="text-sm">Get 5% off your next purchase when you redeem 100 loyalty points.</p>
                <Button variant="outline" className="w-full">Edit Reward</Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>Free Item</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-gray-400">Points Required</div>
                  <div className="text-2xl font-bold">250 points</div>
                </div>
                <p className="text-sm">Get a free item worth up to KSh 500 when you redeem 250 loyalty points.</p>
                <Button variant="outline" className="w-full">Edit Reward</Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>KSh 1,000 Voucher</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-gray-400">Points Required</div>
                  <div className="text-2xl font-bold">1,000 points</div>
                </div>
                <p className="text-sm">Get a KSh 1,000 voucher to spend in store when you redeem 1,000 loyalty points.</p>
                <Button variant="outline" className="w-full">Edit Reward</Button>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 lg:col-span-3 bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>Reward Redemption History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  No rewards have been redeemed yet.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
