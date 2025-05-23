
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { mockLicenseInfo } from '../data/mockData';

interface LicenseTabProps {
  user: User;
}

export const LicenseTab = ({ user }: LicenseTabProps) => {
  const [license, setLicense] = useState(mockLicenseInfo);
  
  const daysRemaining = Math.ceil(
    (new Date(license.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const licenseDuration = Math.ceil(
    (new Date(license.expiryDate).getTime() - new Date(license.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const usagePeriod = licenseDuration - daysRemaining;
  const usagePercentage = (usagePeriod / licenseDuration) * 100;
  
  const userPercentage = (license.currentUsers / license.maxUsers) * 100;
  const branchPercentage = (license.currentBranches / license.maxBranches) * 100;
  
  const upgradePlan = () => {
    toast.success("Upgrade request submitted. Our team will contact you soon.");
  };
  
  const renewLicense = () => {
    toast.success("License renewal initiated. Please complete payment to continue.");
  };
  
  const toggleAutoRenew = () => {
    setLicense({
      ...license,
      autoRenew: !license.autoRenew
    });
    
    toast.success(`Auto-renewal ${!license.autoRenew ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">License Information</CardTitle>
              <CardDescription className="text-gray-400">
                Jeff Tricks Supermarket POS System License
              </CardDescription>
            </div>
            <Badge className={`text-white ${
              license.status === 'active' ? 'bg-green-500' :
              license.status === 'trial' ? 'bg-amber-500' :
              license.status === 'expired' ? 'bg-red-500' :
              'bg-blue-500'
            }`}>
              {license.status.charAt(0).toUpperCase() + license.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-gray-700 border-gray-600">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-4 space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <div>
                    <h3 className="text-white font-semibold">Subscription Plan</h3>
                    <p className="text-xl font-bold text-green-400 capitalize">{license.plan}</p>
                  </div>
                  <Button 
                    onClick={upgradePlan}
                    className="mt-2 md:mt-0 bg-amber-500 hover:bg-amber-600"
                  >
                    Upgrade Plan
                  </Button>
                </div>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300 text-sm">License Usage</span>
                      <span className="text-gray-300 text-sm">{daysRemaining} days remaining</span>
                    </div>
                    <Progress value={usagePercentage} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Started: {new Date(license.startDate).toLocaleDateString()}</span>
                    <span>Expires: {new Date(license.expiryDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">User Allocation</h3>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300 text-sm">Users</span>
                      <span className="text-gray-300 text-sm">{license.currentUsers} / {license.maxUsers}</span>
                    </div>
                    <Progress 
                      value={userPercentage} 
                      className={`h-2 ${userPercentage > 90 ? 'bg-red-500' : 'bg-green-500'}`} 
                    />
                    {userPercentage > 90 && (
                      <p className="text-red-400 text-xs mt-1">
                        User limit nearly reached. Consider upgrading your plan.
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">Branch Allocation</h3>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300 text-sm">Branches</span>
                      <span className="text-gray-300 text-sm">{license.currentBranches} / {license.maxBranches}</span>
                    </div>
                    <Progress 
                      value={branchPercentage} 
                      className="h-2" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Registered To</h3>
                <p className="text-gray-300">{license.registeredTo}</p>
                <p className="text-gray-300">License ID: {license.id}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="pt-4 space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-4">Plan Features</h3>
                
                <div className="space-y-3">
                  {license.features.map((feature, index) => (
                    <div key={index} className="flex justify-between items-center py-1 border-b border-gray-600 last:border-0">
                      <span className="text-gray-200">{feature.name}</span>
                      {feature.included ? (
                        <Badge className="bg-green-500 text-white">Included</Badge>
                      ) : (
                        <Badge className="bg-gray-500 text-white">Not Included</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Upgrade Benefits</h3>
                <p className="text-gray-300 mb-2">
                  Upgrade to Enterprise plan to unlock:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>Custom branding options</li>
                  <li>White label capabilities</li>
                  <li>Unlimited users and branches</li>
                  <li>Advanced API access</li>
                  <li>Premium support with dedicated account manager</li>
                </ul>
                
                <Button 
                  onClick={upgradePlan}
                  className="mt-4 bg-amber-500 hover:bg-amber-600"
                >
                  Upgrade to Enterprise
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="billing" className="pt-4 space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Billing Information</h3>
                <div className="space-y-1 text-gray-300">
                  <p>Plan: <span className="text-white capitalize">{license.plan}</span></p>
                  <p>Billing Cycle: <span className="text-white">Annual</span></p>
                  <p>Next Payment: <span className="text-white">{new Date(license.expiryDate).toLocaleDateString()}</span></p>
                  <p>Payment Method: <span className="text-white">Credit Card (****4582)</span></p>
                </div>
                
                <div className="flex items-center mt-4 space-x-2">
                  <Switch 
                    checked={license.autoRenew} 
                    onCheckedChange={toggleAutoRenew}
                    id="auto-renew"
                  />
                  <label 
                    htmlFor="auto-renew" 
                    className="text-gray-300 cursor-pointer"
                  >
                    Auto-renew subscription
                  </label>
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Payment History</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-1 border-b border-gray-600">
                    <div>
                      <p className="text-white">Annual Premium Plan</p>
                      <p className="text-sm text-gray-400">{new Date(license.lastRenewal).toLocaleDateString()}</p>
                    </div>
                    <span className="text-white font-semibold">KSH 120,000</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-600">
                    <div>
                      <p className="text-white">Annual Standard Plan</p>
                      <p className="text-sm text-gray-400">{new Date(new Date(license.lastRenewal).setFullYear(new Date(license.lastRenewal).getFullYear() - 1)).toLocaleDateString()}</p>
                    </div>
                    <span className="text-white font-semibold">KSH 80,000</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">License Renewal</h3>
                <p className="text-gray-300 mb-4">
                  Your license will {license.autoRenew ? 'automatically renew' : 'expire'} on {new Date(license.expiryDate).toLocaleDateString()}.
                  {!license.autoRenew && ' To continue using the system without interruption, please renew your license before this date.'}
                </p>
                
                <Button 
                  onClick={renewLicense}
                  className="bg-green-500 hover:bg-green-600"
                >
                  {daysRemaining <= 30 ? 'Renew Now' : 'Renew Early'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t border-gray-700 pt-4">
          <p className="text-gray-400 text-sm">
            For support regarding your license, please contact our support team at support@jefftricks.com
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
