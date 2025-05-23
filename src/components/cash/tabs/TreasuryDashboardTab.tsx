
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { CashSession } from '../types/cash-types';
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface TreasuryDashboardTabProps {
  user: User;
  sessions: CashSession[];
}

export const TreasuryDashboardTab = ({ user, sessions }: TreasuryDashboardTabProps) => {
  const activeSessions = sessions.filter(session => session.status === 'open');
  const totalCash = activeSessions.reduce((total, session) => {
    return total + session.openingFloat + session.cashInTotal - session.cashOutTotal;
  }, 0);
  
  // Sample data for charts
  const cashFlowData = [
    { name: 'Monday', cashIn: 5000, cashOut: 2500 },
    { name: 'Tuesday', cashIn: 4500, cashOut: 2700 },
    { name: 'Wednesday', cashIn: 6000, cashOut: 3000 },
    { name: 'Thursday', cashIn: 8000, cashOut: 3500 },
    { name: 'Friday', cashIn: 9500, cashOut: 4200 },
  ];
  
  const cashDistributionData = [
    { name: 'Main Register', value: activeSessions.length > 0 ? activeSessions[0].openingFloat + activeSessions[0].cashInTotal - activeSessions[0].cashOutTotal : 0 },
    { name: 'Checkout 2', value: activeSessions.length > 1 ? activeSessions[1].openingFloat + activeSessions[1].cashInTotal - activeSessions[1].cashOutTotal : 0 },
    { name: 'Vault', value: 10000 },
  ];
  
  const COLORS = ['#00C853', '#FFAB00', '#03A9F4'];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Treasury Dashboard</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-gray-400 text-sm">Total Cash on Hand</p>
            <p className="text-2xl font-bold text-white">{totalCash.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-gray-400 text-sm">Active Registers</p>
            <p className="text-2xl font-bold text-green-400">{activeSessions.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-gray-400 text-sm">Today's Sales</p>
            <p className="text-2xl font-bold text-amber-400">
              {activeSessions.reduce((sum, session) => sum + session.salesTotal, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-gray-400 text-sm">Float Balance</p>
            <p className="text-2xl font-bold text-blue-400">
              {activeSessions.reduce((sum, session) => sum + session.openingFloat, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Chart */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Weekly Cash Flow</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cashFlowData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                  <XAxis dataKey="name" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }}
                    labelStyle={{ color: 'white' }}
                  />
                  <Legend />
                  <Bar dataKey="cashIn" name="Cash In" fill="#00C853" />
                  <Bar dataKey="cashOut" name="Cash Out" fill="#D32F2F" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Cash Distribution Chart */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Cash Distribution</h3>
            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cashDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {cashDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }}
                    labelStyle={{ color: 'white' }}
                    formatter={(value: number) => value.toLocaleString()}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Register Status</h3>
          
          {activeSessions.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No active sessions</p>
          ) : (
            <div className="space-y-4">
              {activeSessions.map(session => (
                <Card key={session.id} className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-semibold text-white">{session.registerName}</h4>
                        <p className="text-gray-400 text-sm">Cashier: {session.cashierName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-semibold">
                          {(session.openingFloat + session.cashInTotal - session.cashOutTotal).toLocaleString()}
                        </p>
                        <p className="text-gray-400 text-xs">Current Balance</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-400">Opening Float</p>
                        <p className="text-sm">{session.openingFloat.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Cash In</p>
                        <p className="text-sm text-green-400">+{session.cashInTotal.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Cash Out</p>
                        <p className="text-sm text-red-400">-{session.cashOutTotal.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
