
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/hooks/useAuth";
import { CashSession, CashTransaction } from "@/components/cash/types/cash-types";
import { DatabaseSession, DatabaseCashMovement, CashSessionWithUser } from "@/types/supabase-types";

export const cashService = {
  // Convert database session to frontend session type
  mapDatabaseSessionToFrontend: (dbSession: CashSessionWithUser): CashSession => {
    return {
      id: dbSession.id,
      registerName: `Register ${dbSession.register_id}`,
      registerID: dbSession.register_id,
      cashierID: dbSession.user_id,
      cashierName: dbSession.users?.name || 'Unknown',
      openingTime: dbSession.opening_time,
      closingTime: dbSession.closing_time || undefined,
      openingFloat: Number(dbSession.opening_float),
      expectedClosingAmount: dbSession.expected_cash ? Number(dbSession.expected_cash) : undefined,
      actualClosingAmount: dbSession.actual_cash ? Number(dbSession.actual_cash) : undefined,
      discrepancyAmount: dbSession.discrepancy ? Number(dbSession.discrepancy) : undefined,
      discrepancyStatus: dbSession.discrepancy ? 
        (Math.abs(Number(dbSession.discrepancy)) > 1000 ? 'critical' : 
         Math.abs(Number(dbSession.discrepancy)) > 500 ? 'significant' : 
         Math.abs(Number(dbSession.discrepancy)) > 0 ? 'minor' : 'none') : undefined,
      status: dbSession.status === 'open' ? 'open' : 'closed',
      transactions: [],
      salesTotal: 0,
      cashInTotal: 0,
      cashOutTotal: 0,
      notes: dbSession.notes || undefined,
    };
  },

  // Map database cash movement to frontend transaction type
  mapDatabaseMovementToFrontend: (dbMovement: DatabaseCashMovement): CashTransaction => {
    return {
      id: dbMovement.id,
      sessionId: dbMovement.session_id,
      timestamp: dbMovement.created_at,
      amount: Number(dbMovement.amount),
      type: dbMovement.movement_type === 'cash_in' ? 'in' : 
            dbMovement.movement_type === 'cash_out' ? 'out' : 'transfer',
      reason: dbMovement.reason,
      createdBy: dbMovement.user_id,
      transferredTo: dbMovement.recipient_session_id || undefined,
    };
  },

  // Get all open sessions for the current branch
  getOpenSessions: async (branchId: string): Promise<CashSession[]> => {
    try {
      // Since the database tables don't exist yet, return mock data
      console.log('Database tables not available yet, returning empty sessions');
      return [];
    } catch (error) {
      console.error('Error in getOpenSessions:', error);
      return [];
    }
  },

  // Get all closed sessions for the current branch
  getClosedSessions: async (branchId: string, limit = 20, offset = 0): Promise<CashSession[]> => {
    try {
      // Since the database tables don't exist yet, return mock data
      console.log('Database tables not available yet, returning empty sessions');
      return [];
    } catch (error) {
      console.error('Error in getClosedSessions:', error);
      return [];
    }
  },

  // Fetch all transactions for a specific session
  fetchTransactionsForSession: async (session: CashSession): Promise<void> => {
    try {
      // Since the database tables don't exist yet, just set empty transactions
      session.transactions = [];
      session.cashInTotal = 0;
      session.cashOutTotal = 0;
      session.salesTotal = 0;
    } catch (error) {
      console.error('Error in fetchTransactionsForSession:', error);
      session.transactions = [];
      session.cashInTotal = 0;
      session.cashOutTotal = 0;
    }
  },

  // Create a new cash session
  createSession: async (
    user: User, 
    branchId: string,
    registerName: string, 
    openingFloat: number,
    notes?: string
  ): Promise<CashSession> => {
    try {
      // Since the database tables don't exist yet, create a mock session
      const mockSession: CashSession = {
        id: `mock-session-${Date.now()}`,
        registerName,
        registerID: registerName.replace(/[^0-9]/g, ''),
        cashierID: user.id,
        cashierName: user.name,
        openingTime: new Date().toISOString(),
        openingFloat,
        status: 'open',
        transactions: [],
        salesTotal: 0,
        cashInTotal: 0,
        cashOutTotal: 0,
        notes,
      };
      
      console.log('Created mock session:', mockSession);
      return mockSession;
    } catch (error) {
      console.error('Error in createSession:', error);
      throw error;
    }
  },
  
  // Close a cash session
  closeSession: async (
    sessionId: string, 
    actualCash: number, 
    notes?: string
  ): Promise<CashSession> => {
    try {
      // Since the database tables don't exist yet, create a mock closed session
      const mockClosedSession: CashSession = {
        id: sessionId,
        registerName: 'Mock Register',
        registerID: '1',
        cashierID: 'mock-user',
        cashierName: 'Mock User',
        openingTime: new Date(Date.now() - 3600000).toISOString(),
        closingTime: new Date().toISOString(),
        openingFloat: 1000,
        actualClosingAmount: actualCash,
        expectedClosingAmount: 1000,
        discrepancyAmount: actualCash - 1000,
        status: 'closed',
        transactions: [],
        salesTotal: 0,
        cashInTotal: 0,
        cashOutTotal: 0,
        notes,
      };
      
      console.log('Created mock closed session:', mockClosedSession);
      return mockClosedSession;
    } catch (error) {
      console.error('Error in closeSession:', error);
      throw error;
    }
  },

  // Add a cash movement
  addCashMovement: async (
    sessionId: string,
    userId: string,
    branchId: string,
    type: 'cash_in' | 'cash_out' | 'transfer',
    amount: number,
    reason: string,
    recipientSessionId?: string
  ): Promise<CashTransaction> => {
    try {
      // Since the database tables don't exist yet, create a mock transaction
      const mockTransaction: CashTransaction = {
        id: `mock-transaction-${Date.now()}`,
        sessionId,
        timestamp: new Date().toISOString(),
        amount,
        type: type === 'cash_in' ? 'in' : type === 'cash_out' ? 'out' : 'transfer',
        reason,
        createdBy: userId,
        transferredTo: recipientSessionId,
      };
      
      console.log('Created mock transaction:', mockTransaction);
      return mockTransaction;
    } catch (error) {
      console.error('Error in addCashMovement:', error);
      throw error;
    }
  }
};
