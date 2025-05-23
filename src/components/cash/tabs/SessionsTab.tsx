
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { CashSession, SessionStatus } from '../types/cash-types';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus } from 'lucide-react';
import { SessionCard } from '../components/SessionCard';
import { ClosedSessionsTable } from '../components/ClosedSessionsTable';
import { OpenSessionDialog } from '../components/OpenSessionDialog';
import { CloseSessionDialog } from '../components/CloseSessionDialog';

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

  const handleOpenSession = () => {
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

  const handleCloseSession = () => {
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

  const handleSelectSessionToClose = (session: CashSession) => {
    setSelectedSession(session);
    setCloseSessionDialog(true);
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
                <SessionCard 
                  key={session.id} 
                  session={session} 
                  onCloseSession={handleSelectSessionToClose} 
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Closed Sessions</h3>
          <ClosedSessionsTable sessions={closedSessions} />
        </CardContent>
      </Card>
      
      {/* Open Session Dialog */}
      <Dialog open={openSessionDialog} onOpenChange={setOpenSessionDialog}>
        <OpenSessionDialog 
          floatAmount={floatAmount}
          setFloatAmount={setFloatAmount}
          sessionNotes={sessionNotes}
          setSessionNotes={setSessionNotes}
          onOpenSession={handleOpenSession}
          onClose={() => setOpenSessionDialog(false)}
        />
      </Dialog>
      
      {/* Close Session Dialog */}
      <Dialog open={closeSessionDialog} onOpenChange={setCloseSessionDialog}>
        <CloseSessionDialog 
          session={selectedSession}
          closingAmount={closingAmount}
          setClosingAmount={setClosingAmount}
          sessionNotes={sessionNotes}
          setSessionNotes={setSessionNotes}
          onCloseSession={handleCloseSession}
          onCancel={() => setCloseSessionDialog(false)}
        />
      </Dialog>
    </div>
  );
};
