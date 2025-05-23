
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { CashSession, CashTransaction, CashMovementType } from '../types/cash-types';
import { mockTransactions } from '../data/mockData';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { DialogContent, Dialog, DialogTitle, DialogHeader, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Plus, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Clock } from 'lucide-react';

interface CashMovementsTabProps {
  user: User;
  sessions: CashSession[];
  setSessions: React.Dispatch<React.SetStateAction<CashSession[]>>;
}

export const CashMovementsTab = ({ user, sessions, setSessions }: CashMovementsTabProps) => {
  const [transactions, setTransactions] = useState<CashTransaction[]>(mockTransactions);
  const [openMovementDialog, setOpenMovementDialog] = useState(false);
  const [movementType, setMovementType] = useState<CashMovementType>('in');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');

  const activeSessions = sessions.filter(session => session.status === 'open');

  const handleAddMovement = () => {
    if (!selectedSessionId || !amount || isNaN(Number(amount)) || !reason) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const newTransaction: CashTransaction = {
      id: `trans-${Date.now()}`,
      sessionId: selectedSessionId,
      timestamp: new Date().toISOString(),
      amount: Number(amount),
      type: movementType,
      reason,
      notes,
      createdBy: user.id
    };
    
    setTransactions([...transactions, newTransaction]);
    
    // Update the session with new cash in/out totals
    setSessions(sessions.map(session => {
      if (session.id === selectedSessionId) {
        return {
          ...session,
          cashInTotal: movementType === 'in' ? session.cashInTotal + Number(amount) : session.cashInTotal,
          cashOutTotal: movementType === 'out' ? session.cashOutTotal + Number(amount) : session.cashOutTotal
        };
      }
      return session;
    }));
    
    resetForm();
    toast.success(`Cash ${movementType} recorded successfully`);
  };
  
  const resetForm = () => {
    setOpenMovementDialog(false);
    setMovementType('in');
    setAmount('');
    setReason('');
    setNotes('');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Cash Movements</h2>
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              setMovementType('in');
              setOpenMovementDialog(true);
            }}
            className="bg-green-500 hover:bg-green-600"
          >
            <ArrowDownLeft size={16} className="mr-2" /> Cash In
          </Button>
          <Button
            onClick={() => {
              setMovementType('out');
              setOpenMovementDialog(true);
            }}
            className="bg-amber-500 hover:bg-amber-600"
          >
            <ArrowUpRight size={16} className="mr-2" /> Cash Out
          </Button>
          <Button
            onClick={() => {
              setMovementType('transfer');
              setOpenMovementDialog(true);
            }}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <ArrowLeftRight size={16} className="mr-2" /> Transfer
          </Button>
        </div>
      </div>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Cash Movements</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-white">
              <thead className="text-xs uppercase bg-gray-700">
                <tr>
                  <th className="px-4 py-3">Date/Time</th>
                  <th className="px-4 py-3">Session</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Created By</th>
                  <th className="px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => {
                  const session = sessions.find(s => s.id === transaction.sessionId);
                  return (
                    <tr key={transaction.id} className="border-b border-gray-700 bg-gray-800 hover:bg-gray-700">
                      <td className="px-4 py-3 flex items-center">
                        <Clock size={12} className="mr-2 text-gray-400" />
                        {new Date(transaction.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">{session?.registerName}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.type === 'in' ? 'bg-green-500/20 text-green-400' :
                          transaction.type === 'out' ? 'bg-red-500/20 text-red-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {transaction.type === 'in' ? 'Cash In' : 
                           transaction.type === 'out' ? 'Cash Out' : 
                           'Transfer'}
                        </span>
                      </td>
                      <td className={`px-4 py-3 ${
                        transaction.type === 'in' ? 'text-green-400' :
                        transaction.type === 'out' ? 'text-red-400' :
                        'text-blue-400'
                      }`}>
                        {transaction.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">{transaction.reason}</td>
                      <td className="px-4 py-3">
                        {sessions.find(s => s.id === transaction.sessionId)?.cashierName}
                      </td>
                      <td className="px-4 py-3 text-gray-400">{transaction.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Add Cash Movement Dialog */}
      <Dialog open={openMovementDialog} onOpenChange={setOpenMovementDialog}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>
              {movementType === 'in' ? 'Add Cash In' : 
               movementType === 'out' ? 'Add Cash Out' : 
               'Transfer Cash'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {movementType === 'in' ? 'Record cash added to register' : 
               movementType === 'out' ? 'Record cash removed from register' : 
               'Record cash transferred between registers'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sessionSelect">Select Cash Session</Label>
              <Select 
                value={selectedSessionId} 
                onValueChange={setSelectedSessionId}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {activeSessions.map(session => (
                    <SelectItem key={session.id} value={session.id}>
                      {session.registerName} - {session.cashierName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Select 
                value={reason} 
                onValueChange={setReason}
              >
                <SelectTrigger id="reason" className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {movementType === 'in' && (
                    <>
                      <SelectItem value="Additional float">Additional float</SelectItem>
                      <SelectItem value="Change received">Change received</SelectItem>
                      <SelectItem value="Deposit">Deposit</SelectItem>
                    </>
                  )}
                  
                  {movementType === 'out' && (
                    <>
                      <SelectItem value="Supplier payment">Supplier payment</SelectItem>
                      <SelectItem value="Petty cash">Petty cash</SelectItem>
                      <SelectItem value="Cash deposit to bank">Cash deposit to bank</SelectItem>
                    </>
                  )}
                  
                  {movementType === 'transfer' && (
                    <>
                      <SelectItem value="Till balance">Till balance</SelectItem>
                      <SelectItem value="Register close">Register close</SelectItem>
                      <SelectItem value="Cash transfer">Cash transfer</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Add additional details..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenMovementDialog(false)}>
              Cancel
            </Button>
            <Button 
              className={`
                ${movementType === 'in' ? 'bg-green-500 hover:bg-green-600' : 
                 movementType === 'out' ? 'bg-amber-500 hover:bg-amber-600' : 
                 'bg-blue-500 hover:bg-blue-600'}
              `} 
              onClick={handleAddMovement}
            >
              {movementType === 'in' ? 'Add Cash In' : 
               movementType === 'out' ? 'Add Cash Out' : 
               'Transfer Cash'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
