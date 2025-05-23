
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { CashSession, SessionStatus } from '../types/cash-types';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { DialogContent, Dialog, DialogTitle, DialogHeader, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Plus, Calculator, DollarSign, Clock } from 'lucide-react';

interface SessionsTabProps {
  user: User;
  sessions: CashSession[];
  setSessions: React.Dispatch<React.SetStateAction<CashSession[]>>;
}

export const SessionsTab = ({ user, sessions, setSessions }: SessionsTabProps) => {
  const [openSessionDialog, setOpenSessionDialog] = useState(false);
  const [closeSessionDialog, setCloseSessionDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<CashSession | null>(null);
  const [floatAmount, setFloatAmount] = useState<string>('');
  const [closingAmount, setClosingAmount] = useState<string>('');
  const [sessionNotes, setSessionNotes] = useState<string>('');
  
  const activeSessions = sessions.filter(session => session.status === 'open');
  const closedSessions = sessions.filter(session => session.status === 'closed');

  const openNewSession = () => {
    if (!floatAmount || isNaN(Number(floatAmount))) {
      toast.error("Please enter a valid float amount");
      return;
    }

    const newSession: CashSession = {
      id: `session-${Date.now()}`,
      registerName: `Register ${activeSessions.length + 1}`,
      registerID: `reg-00${activeSessions.length + 1}`,
      cashierID: user.id,
      cashierName: user.name,
      openingTime: new Date().toISOString(),
      openingFloat: Number(floatAmount),
      status: 'open',
      transactions: [],
      salesTotal: 0,
      cashInTotal: 0,
      cashOutTotal: 0,
      notes: sessionNotes
    };

    setSessions([...sessions, newSession]);
    setOpenSessionDialog(false);
    setFloatAmount('');
    setSessionNotes('');
    toast.success("Cash session opened successfully");
  };

  const closeSession = () => {
    if (!selectedSession) return;
    
    if (!closingAmount || isNaN(Number(closingAmount))) {
      toast.error("Please enter a valid closing amount");
      return;
    }

    const actualClosingAmount = Number(closingAmount);
    const expectedClosingAmount = selectedSession.openingFloat + 
      selectedSession.salesTotal + selectedSession.cashInTotal - 
      selectedSession.cashOutTotal;
    
    const discrepancyAmount = actualClosingAmount - expectedClosingAmount;
    
    let discrepancyStatus: 'none' | 'minor' | 'significant' | 'critical' = 'none';
    if (discrepancyAmount !== 0) {
      const discrepancyPercentage = Math.abs(discrepancyAmount) / expectedClosingAmount * 100;
      if (discrepancyPercentage < 1) {
        discrepancyStatus = 'minor';
      } else if (discrepancyPercentage < 5) {
        discrepancyStatus = 'significant';
      } else {
        discrepancyStatus = 'critical';
      }
    }
    
    const updatedSessions = sessions.map(session => 
      session.id === selectedSession.id 
        ? {
            ...session,
            status: 'closed' as SessionStatus,
            closingTime: new Date().toISOString(),
            expectedClosingAmount,
            actualClosingAmount,
            discrepancyAmount,
            discrepancyStatus,
            discrepancyNotes: sessionNotes
          }
        : session
    );
    
    setSessions(updatedSessions);
    setCloseSessionDialog(false);
    setSelectedSession(null);
    setClosingAmount('');
    setSessionNotes('');
    
    if (discrepancyStatus === 'none') {
      toast.success("Session closed successfully with no discrepancies");
    } else {
      toast.warning(`Session closed with ${discrepancyStatus} discrepancy of ${discrepancyAmount.toFixed(2)}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Cash Sessions</h2>
        <Button 
          onClick={() => setOpenSessionDialog(true)}
          className="bg-green-500 hover:bg-green-600"
        >
          <Plus size={16} className="mr-2" /> Open New Session
        </Button>
      </div>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Active Sessions</h3>
          
          {activeSessions.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No active sessions</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeSessions.map(session => (
                <Card key={session.id} className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-white">{session.registerName}</h4>
                        <p className="text-green-400 text-sm flex items-center">
                          <Clock size={12} className="mr-1" /> 
                          Open since {new Date(session.openingTime).toLocaleTimeString()}
                        </p>
                      </div>
                      <Button 
                        variant="destructive" 
                        onClick={() => {
                          setSelectedSession(session);
                          setCloseSessionDialog(true);
                        }}
                      >
                        Close Session
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div className="bg-gray-800 p-2 rounded-md">
                        <p className="text-gray-400">Cashier</p>
                        <p className="text-white">{session.cashierName}</p>
                      </div>
                      <div className="bg-gray-800 p-2 rounded-md">
                        <p className="text-gray-400">Opening Float</p>
                        <p className="text-white flex items-center">
                          <DollarSign size={12} className="mr-1" /> 
                          {session.openingFloat.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gray-800 p-2 rounded-md">
                        <p className="text-gray-400">Sales Total</p>
                        <p className="text-white flex items-center">
                          <DollarSign size={12} className="mr-1" /> 
                          {session.salesTotal.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gray-800 p-2 rounded-md">
                        <p className="text-gray-400">Net Cash</p>
                        <p className="text-white flex items-center">
                          <Calculator size={12} className="mr-1" /> 
                          {(session.openingFloat + session.cashInTotal - session.cashOutTotal).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full text-amber-400 border-amber-400 hover:bg-amber-400/10"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Closed Sessions</h3>
          
          {closedSessions.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No closed sessions</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-white">
                <thead className="text-xs uppercase bg-gray-700">
                  <tr>
                    <th className="px-4 py-3">Register</th>
                    <th className="px-4 py-3">Cashier</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Sales</th>
                    <th className="px-4 py-3">Expected</th>
                    <th className="px-4 py-3">Actual</th>
                    <th className="px-4 py-3">Difference</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {closedSessions.map(session => {
                    const openTime = new Date(session.openingTime);
                    const closeTime = session.closingTime ? new Date(session.closingTime) : new Date();
                    const duration = Math.round((closeTime.getTime() - openTime.getTime()) / (1000 * 60 * 60));
                    
                    return (
                      <tr key={session.id} className="border-b border-gray-700 bg-gray-800 hover:bg-gray-700">
                        <td className="px-4 py-3">{session.registerName}</td>
                        <td className="px-4 py-3">{session.cashierName}</td>
                        <td className="px-4 py-3">{new Date(session.openingTime).toLocaleDateString()}</td>
                        <td className="px-4 py-3">{duration} hours</td>
                        <td className="px-4 py-3">{session.salesTotal.toLocaleString()}</td>
                        <td className="px-4 py-3">{session.expectedClosingAmount?.toLocaleString()}</td>
                        <td className="px-4 py-3">{session.actualClosingAmount?.toLocaleString()}</td>
                        <td className={`px-4 py-3 ${session.discrepancyAmount === 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {session.discrepancyAmount?.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            session.discrepancyStatus === 'none' ? 'bg-green-500/20 text-green-400' :
                            session.discrepancyStatus === 'minor' ? 'bg-yellow-500/20 text-yellow-400' :
                            session.discrepancyStatus === 'significant' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {session.discrepancyStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="outline" size="sm">View Report</Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Open Session Dialog */}
      <Dialog open={openSessionDialog} onOpenChange={setOpenSessionDialog}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Open New Cash Session</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the opening float amount to start a new cash session.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="floatAmount">Opening Float Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="floatAmount"
                  type="number"
                  placeholder="0.00"
                  value={floatAmount}
                  onChange={(e) => setFloatAmount(e.target.value)}
                  className="bg-gray-700 border-gray-600 pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sessionNotes">Session Notes (Optional)</Label>
              <Input
                id="sessionNotes"
                placeholder="Add any notes for this session..."
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenSessionDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-green-500 hover:bg-green-600" 
              onClick={openNewSession}
            >
              Open Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Close Session Dialog */}
      <Dialog open={closeSessionDialog} onOpenChange={setCloseSessionDialog}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Close Cash Session</DialogTitle>
            <DialogDescription className="text-gray-400">
              Count the cash in the register and enter the final amount below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedSession && (
              <div className="bg-gray-700 p-4 rounded-lg mb-4">
                <p className="font-semibold">{selectedSession.registerName}</p>
                <p className="text-sm text-gray-400">Cashier: {selectedSession.cashierName}</p>
                <p className="text-sm text-gray-400">
                  Open since: {new Date(selectedSession.openingTime).toLocaleString()}
                </p>
                <Separator className="my-2 bg-gray-600" />
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  <div>
                    <p className="text-gray-400">Opening Float</p>
                    <p className="text-white">{selectedSession.openingFloat.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Sales Total</p>
                    <p className="text-white">{selectedSession.salesTotal.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Cash In</p>
                    <p className="text-white">{selectedSession.cashInTotal.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Cash Out</p>
                    <p className="text-white">{selectedSession.cashOutTotal.toLocaleString()}</p>
                  </div>
                </div>
                <Separator className="my-2 bg-gray-600" />
                <div className="flex justify-between items-center">
                  <p className="font-medium">Expected Cash:</p>
                  <p className="font-bold text-green-400">
                    {(selectedSession.openingFloat + 
                      selectedSession.salesTotal + 
                      selectedSession.cashInTotal - 
                      selectedSession.cashOutTotal).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="closingAmount">Actual Counted Cash Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="closingAmount"
                  type="number"
                  placeholder="0.00"
                  value={closingAmount}
                  onChange={(e) => setClosingAmount(e.target.value)}
                  className="bg-gray-700 border-gray-600 pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="closeSessionNotes">Notes (Optional, required for discrepancies)</Label>
              <Input
                id="closeSessionNotes"
                placeholder="Explain any discrepancy..."
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseSessionDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-red-500 hover:bg-red-600" 
              onClick={closeSession}
            >
              Close Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
