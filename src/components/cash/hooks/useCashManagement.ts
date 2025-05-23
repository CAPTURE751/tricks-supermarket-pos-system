
import { useState } from 'react';
import { cashService } from '@/services/cash-service';
import { User } from '@/hooks/useAuth';
import { CashSession, CashTransaction } from '@/components/cash/types/cash-types';
import { toast } from "sonner";

export const useCashManagement = (user: User) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openSessions, setOpenSessions] = useState<CashSession[]>([]);
  const [closedSessions, setClosedSessions] = useState<CashSession[]>([]);
  
  // Default branch ID for now, in a real app this would come from the user's context
  const defaultBranchId = "00000000-0000-0000-0000-000000000001";

  const fetchOpenSessions = async () => {
    setIsLoading(true);
    try {
      const sessions = await cashService.getOpenSessions(defaultBranchId);
      setOpenSessions(sessions);
    } catch (error) {
      console.error('Error fetching open sessions:', error);
      toast.error('Failed to load open sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClosedSessions = async () => {
    setIsLoading(true);
    try {
      const sessions = await cashService.getClosedSessions(defaultBranchId);
      setClosedSessions(sessions);
    } catch (error) {
      console.error('Error fetching closed sessions:', error);
      toast.error('Failed to load closed sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const openSession = async (
    registerName: string, 
    openingFloat: number, 
    notes?: string
  ) => {
    setIsLoading(true);
    try {
      const newSession = await cashService.createSession(
        user, 
        defaultBranchId,
        registerName, 
        openingFloat, 
        notes
      );
      
      setOpenSessions(prev => [...prev, newSession]);
      toast.success('Cash session opened successfully');
      return newSession;
    } catch (error) {
      console.error('Error opening session:', error);
      toast.error('Failed to open cash session');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const closeSession = async (
    sessionId: string, 
    actualCash: number, 
    notes?: string
  ) => {
    setIsLoading(true);
    try {
      const closedSession = await cashService.closeSession(sessionId, actualCash, notes);
      
      // Remove from open sessions and add to closed sessions
      setOpenSessions(prev => prev.filter(session => session.id !== sessionId));
      setClosedSessions(prev => [closedSession, ...prev]);
      
      toast.success('Cash session closed successfully');
      return closedSession;
    } catch (error) {
      console.error('Error closing session:', error);
      toast.error('Failed to close cash session');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addCashMovement = async (
    sessionId: string,
    type: 'in' | 'out' | 'transfer',
    amount: number,
    reason: string,
    recipientSessionId?: string
  ) => {
    setIsLoading(true);
    try {
      // Map frontend type to database type
      const dbType = type === 'in' ? 'cash_in' : 
                    type === 'out' ? 'cash_out' : 'transfer';
      
      const transaction = await cashService.addCashMovement(
        sessionId,
        user.id,
        defaultBranchId,
        dbType,
        amount,
        reason,
        recipientSessionId
      );
      
      // Update the session in state with the new transaction
      setOpenSessions(prev => 
        prev.map(session => {
          if (session.id === sessionId) {
            const updatedSession = { ...session };
            updatedSession.transactions = [...updatedSession.transactions, transaction];
            
            if (type === 'in') {
              updatedSession.cashInTotal += amount;
            } else if (type === 'out') {
              updatedSession.cashOutTotal += amount;
            }
            
            return updatedSession;
          }
          return session;
        })
      );
      
      toast.success(`Cash ${type} recorded successfully`);
      return transaction;
    } catch (error) {
      console.error('Error adding cash movement:', error);
      toast.error(`Failed to record cash ${type}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    openSessions,
    closedSessions,
    fetchOpenSessions,
    fetchClosedSessions,
    openSession,
    closeSession,
    addCashMovement
  };
};
