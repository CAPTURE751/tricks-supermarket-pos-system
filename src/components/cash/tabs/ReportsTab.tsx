
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { CashSession } from '../types/cash-types';
import { mockReports } from '../data/mockData';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface ReportsTabProps {
  user: User;
  sessions: CashSession[];
}

export const ReportsTab = ({ user, sessions }: ReportsTabProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Cash Reports</h2>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Label htmlFor="date" className="mr-2">Date:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal bg-gray-700 border-gray-600",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-700 border-gray-600">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button>Generate Report</Button>
        </div>
      </div>
      
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="bg-gray-700 border border-gray-600">
          <TabsTrigger value="daily">Daily Reports</TabsTrigger>
          <TabsTrigger value="sessions">Session Reports</TabsTrigger>
          <TabsTrigger value="cashier">Cashier Reports</TabsTrigger>
          <TabsTrigger value="discrepancy">Discrepancy Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="mt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Daily Cash Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-gray-400 text-sm">Opening Balance</p>
                    <p className="text-2xl font-bold text-white">12,500.00</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-gray-400 text-sm">Cash In</p>
                    <p className="text-2xl font-bold text-green-400">8,750.00</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-gray-400 text-sm">Cash Out</p>
                    <p className="text-2xl font-bold text-red-400">3,250.00</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-gray-400 text-sm">Closing Balance</p>
                    <p className="text-2xl font-bold text-white">18,000.00</p>
                  </CardContent>
                </Card>
              </div>
              
              <p className="text-white font-semibold mb-2">Sessions Summary</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-white">
                  <thead className="text-xs uppercase bg-gray-700">
                    <tr>
                      <th className="px-4 py-3">Session</th>
                      <th className="px-4 py-3">Cashier</th>
                      <th className="px-4 py-3">Open Time</th>
                      <th className="px-4 py-3">Close Time</th>
                      <th className="px-4 py-3">Opening</th>
                      <th className="px-4 py-3">Sales</th>
                      <th className="px-4 py-3">Closing</th>
                      <th className="px-4 py-3">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.filter(s => s.status === 'closed').map(session => (
                      <tr key={session.id} className="border-b border-gray-700 bg-gray-800 hover:bg-gray-700">
                        <td className="px-4 py-3">{session.registerName}</td>
                        <td className="px-4 py-3">{session.cashierName}</td>
                        <td className="px-4 py-3">{new Date(session.openingTime).toLocaleTimeString()}</td>
                        <td className="px-4 py-3">{session.closingTime ? new Date(session.closingTime).toLocaleTimeString() : '-'}</td>
                        <td className="px-4 py-3">{session.openingFloat.toLocaleString()}</td>
                        <td className="px-4 py-3">{session.salesTotal.toLocaleString()}</td>
                        <td className="px-4 py-3">{session.actualClosingAmount?.toLocaleString() || '-'}</td>
                        <td className={`px-4 py-3 ${session.discrepancyAmount === 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {session.discrepancyAmount?.toLocaleString() || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6">
                <Button>Export to PDF</Button>
                <Button variant="outline" className="ml-2">Export to Excel</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sessions" className="mt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Session Reports</h3>
              <p className="text-gray-400">Select a session from the list to view detailed reports.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cashier" className="mt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Cashier Performance Reports</h3>
              <p className="text-gray-400">Select a cashier to view their cash handling performance.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="discrepancy" className="mt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Discrepancy Reports</h3>
              <p className="text-gray-400">Shows sessions with cash discrepancies.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
