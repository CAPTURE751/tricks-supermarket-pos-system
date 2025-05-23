
import { User } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockCustomers } from '../data/mockData';

interface CustomerCommunicationProps {
  user: User;
}

export const CustomerCommunication = ({ user }: CustomerCommunicationProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Customer Communication</h2>
        <p className="text-gray-400">Manage customer communications and marketing campaigns</p>
      </div>
      
      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="bg-gray-800 border border-gray-700">
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-green-500">
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-green-500">
            Message Templates
          </TabsTrigger>
          <TabsTrigger value="contacts" className="data-[state=active]:bg-green-500">
            Contact Lists
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-green-500">
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-2 bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>Create New Campaign</CardTitle>
                <CardDescription className="text-gray-400">
                  Send targeted messages to your customers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">Campaign Name</label>
                  <Input placeholder="e.g., May Promotion" className="bg-gray-700 border-gray-600 text-white" />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Campaign Type</label>
                  <select className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white">
                    <option value="sms">SMS Campaign</option>
                    <option value="email">Email Campaign</option>
                    <option value="both">SMS & Email</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-medium">Target Audience</label>
                  <select className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white">
                    <option value="all">All Customers</option>
                    <option value="vip">VIP Customers</option>
                    <option value="regular">Regular Customers</option>
                    <option value="wholesale">Wholesale Customers</option>
                    <option value="inactive">Inactive Customers (30+ days)</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-medium">Message</label>
                  <Textarea 
                    placeholder="Enter your message here..." 
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Schedule</label>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Input type="date" className="bg-gray-700 border-gray-600 text-white" />
                    </div>
                    <div className="flex-1">
                      <Input type="time" className="bg-gray-700 border-gray-600 text-white" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Save Draft</Button>
                <Button>Schedule Campaign</Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>Recent Campaigns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-bold">End of Month Sale</h3>
                  <div className="text-sm text-gray-400">Sent: 2 days ago</div>
                  <div className="text-sm flex justify-between mt-2">
                    <span>SMS</span>
                    <span>45 recipients</span>
                  </div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-bold">New Arrivals</h3>
                  <div className="text-sm text-gray-400">Sent: 1 week ago</div>
                  <div className="text-sm flex justify-between mt-2">
                    <span>Email</span>
                    <span>32 recipients</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">View All Campaigns</Button>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 lg:col-span-3 bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>Customer Marketing Consent</CardTitle>
                <CardDescription className="text-gray-400">
                  List of customers who have opted in or out of marketing communications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader className="bg-gray-700">
                    <TableRow className="border-gray-600">
                      <TableHead>ID</TableHead>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Marketing Consent</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCustomers.map((customer) => (
                      <TableRow key={customer.id} className="border-gray-600">
                        <TableCell className="font-medium">{customer.id}</TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            customer.hasMarketingConsent ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                          }`}>
                            {customer.hasMarketingConsent ? 'Opted In' : 'Opted Out'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant={customer.hasMarketingConsent ? "outline" : "default"}
                          >
                            {customer.hasMarketingConsent ? 'Remove Consent' : 'Add Consent'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="pt-6">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>Message Templates</CardTitle>
              <CardDescription className="text-gray-400">
                Create and manage reusable message templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <h3 className="font-bold mb-2">Welcome Message</h3>
                  <p className="text-sm mb-4">
                    Welcome to Jeff Tricks, [Customer Name]! Thank you for registering. We're excited to have you as our customer. 
                  </p>
                  <div className="flex justify-end">
                    <Button size="sm" variant="ghost">Edit</Button>
                  </div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <h3 className="font-bold mb-2">Birthday Offer</h3>
                  <p className="text-sm mb-4">
                    Happy Birthday, [Customer Name]! Enjoy a special 10% discount on your next purchase as a birthday gift from us.
                  </p>
                  <div className="flex justify-end">
                    <Button size="sm" variant="ghost">Edit</Button>
                  </div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <h3 className="font-bold mb-2">Special Promotion</h3>
                  <p className="text-sm mb-4">
                    [Customer Name], don't miss our [Promotion] with up to [Discount]% off selected items. Offer ends [Date].
                  </p>
                  <div className="flex justify-end">
                    <Button size="sm" variant="ghost">Edit</Button>
                  </div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 border-dashed flex items-center justify-center">
                  <Button variant="ghost">
                    <span className="text-2xl mr-2">+</span> Create New Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contacts" className="pt-6">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>Contact Lists</CardTitle>
              <CardDescription className="text-gray-400">
                Create custom contact lists for targeted marketing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold">VIP Customers</h3>
                  <span className="bg-purple-900 text-purple-200 px-2 py-1 rounded-full text-xs">
                    {mockCustomers.filter(c => c.category === 'VIP').length} contacts
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  All customers with VIP status
                </p>
                <div className="flex justify-end mt-4 space-x-2">
                  <Button size="sm" variant="outline">Export</Button>
                  <Button size="sm" variant="ghost">Edit</Button>
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold">High Spenders</h3>
                  <span className="bg-green-900 text-green-200 px-2 py-1 rounded-full text-xs">
                    {mockCustomers.filter(c => c.totalSpent > 20000).length} contacts
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Customers who have spent over KSh 20,000
                </p>
                <div className="flex justify-end mt-4 space-x-2">
                  <Button size="sm" variant="outline">Export</Button>
                  <Button size="sm" variant="ghost">Edit</Button>
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold">Inactive Customers</h3>
                  <span className="bg-amber-900 text-amber-200 px-2 py-1 rounded-full text-xs">
                    {mockCustomers.filter(c => !c.lastPurchase).length} contacts
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Customers with no purchases in the last 30 days
                </p>
                <div className="flex justify-end mt-4 space-x-2">
                  <Button size="sm" variant="outline">Export</Button>
                  <Button size="sm" variant="ghost">Edit</Button>
                </div>
              </div>
              
              <Button className="w-full">Create New Contact List</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="pt-6">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>Communication Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Configure your communication preferences and integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-bold mb-4">SMS Settings</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span>SMS Provider</span>
                    <span className="font-medium">AfricasTalking</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span>SMS Sender ID</span>
                    <span className="font-medium">JEFFTRICKS</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span>SMS Balance</span>
                    <span className="font-medium">1,250 credits</span>
                  </div>
                </div>
                <Button className="mt-4" variant="outline">Configure SMS</Button>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">Email Settings</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span>Email Provider</span>
                    <span className="font-medium">SMTP</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span>Sender Email</span>
                    <span className="font-medium">info@jefftricks.com</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span>Sender Name</span>
                    <span className="font-medium">Jeff Tricks Supermarket</span>
                  </div>
                </div>
                <Button className="mt-4" variant="outline">Configure Email</Button>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">Default Messages</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span>Birthday Wishes</span>
                    <span className="text-green-400">Enabled</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span>Purchase Thank You</span>
                    <span className="text-green-400">Enabled</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span>Inactivity Reminders</span>
                    <span className="text-red-400">Disabled</span>
                  </div>
                </div>
                <Button className="mt-4" variant="outline">Configure Default Messages</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
