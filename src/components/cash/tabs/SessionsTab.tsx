
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
  closedSessions: CashSession[];
  isLoading: boolean;
  onOpenSession: (registerName: string, openingFloat: number, notes?: string) => Promise<CashSession>;
  onCloseSession: (sessionId: string, actualCash: number, notes?: string) => Promise<CashSession>;
}

export const SessionsTab = ({ 
  user, 
  sessions, 
  closedSessions, 
  isLoading, 
  onOpenSession, 
  onCloseSession 
}: SessionsTabProps) => {
  const [openSessionDialog, setOpenSessionDialog] = useState(false);
  const [closeSessionDialog, setCloseSessionDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<CashSession | null>(null);
  const [floatAmount, setFloatAmount] = useState<string>('');
  const [closingAmount, setClosingAmount] = useState<string>('');
  const [sessionNotes, setSessionNotes] = useState<string>('');
  
  const activeSessions = sessions.filter(session => session.status === 'open');

  const handleOpenSession = async () => {
    if (!floatAmount || isNaN(Number(floatAmount))) {
      toast.error("Please enter a valid float amount");
      return;
    }

    try {
      await onOpenSession(`Register ${activeSessions.length + 1}`, Number(floatAmount), sessionNotes);
      setOpenSessionDialog(false);
      setFloatAmount('');
      setSessionNotes('');
    } catch (error) {
      console.error('Error opening session:', error);
    }
  };

  const handleCloseSession = async () => {
    if (!selectedSession) return;
    
    if (!closingAmount || isNaN(Number(closingAmount))) {
      toast.error("Please enter a valid closing amount");
      return;
    }

    try {
      await onCloseSession(selectedSession.id, Number(closingAmount), sessionNotes);
      setCloseSessionDialog(false);
      setSelectedSession(null);
      setClosingAmount('');
      setSessionNotes('');
    } catch (error) {
      console.error('Error closing session:', error);
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
          disabled={isLoading}
        >
          <Plus size={16} className="mr-2" /> Open New Session
        </Button>
      </div>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Active Sessions</h3>
          
          {isLoading ? (
            <p className="text-gray-400 text-center py-8">Loading sessions...</p>
          ) : activeSessions.length === 0 ? (
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
