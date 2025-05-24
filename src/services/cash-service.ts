
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/hooks/useAuth";
import { DatabaseSession, DatabaseCashMovement, CashSessionWithUser } from "@/types/supabase-types";
import { CashSession, CashTransaction } from "@/components/cash/types/cash-types";

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
      transactions: [], // Will be populated separately
      salesTotal: 0, // Will be calculated separately
      cashInTotal: 0, // Will be calculated separately
      cashOutTotal: 0, // Will be calculated separately
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
      const { data, error } = await supabase
        .from('cash_sessions' as any)
        .select(`
          *,
          users:user_id (
            name
          )
        `)
        .eq('status', 'open')
        .eq('branch_id', branchId);

      if (error) {
        console.error('Error fetching open sessions:', error);
        throw error;
      }

      const sessions: CashSession[] = (data as unknown as CashSessionWithUser[]).map(
        cashService.mapDatabaseSessionToFrontend
      );

      // For each session, fetch its transactions
      for (const session of sessions) {
        await cashService.fetchTransactionsForSession(session);
      }

      return sessions;
    } catch (error) {
      console.error('Error in getOpenSessions:', error);
      return []; // Return empty array on error for now
    }
  },

  // Get all closed sessions for the current branch
  getClosedSessions: async (branchId: string, limit = 20, offset = 0): Promise<CashSession[]> => {
    try {
      const { data, error } = await supabase
        .from('cash_sessions' as any)
        .select(`
          *,
          users:user_id (
            name
          )
        `)
        .eq('status', 'closed')
        .eq('branch_id', branchId)
        .order('closing_time', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching closed sessions:', error);
        throw error;
      }

      return (data as unknown as CashSessionWithUser[]).map(cashService.mapDatabaseSessionToFrontend);
    } catch (error) {
      console.error('Error in getClosedSessions:', error);
      return []; // Return empty array on error for now
    }
  },

  // Fetch all transactions for a specific session
  fetchTransactionsForSession: async (session: CashSession): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('cash_movements' as any)
        .select('*')
        .eq('session_id', session.id);

      if (error) {
        console.error(`Error fetching transactions for session ${session.id}:`, error);
        return; // Don't throw, just skip transactions
      }

      const transactions = (data as unknown as DatabaseCashMovement[]).map(
        cashService.mapDatabaseMovementToFrontend
      );

      session.transactions = transactions;

      // Calculate totals
      let cashInTotal = 0;
      let cashOutTotal = 0;
      
      transactions.forEach(txn => {
        if (txn.type === 'in') {
          cashInTotal += txn.amount;
        } else if (txn.type === 'out') {
          cashOutTotal += txn.amount;
        }
      });

      session.cashInTotal = cashInTotal;
      session.cashOutTotal = cashOutTotal;
      
      // TODO: Fetch sales total from sales table when implemented
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
    // Extract register number from name (e.g., "Register 1" -> "1")
    const registerId = registerName.replace(/[^0-9]/g, '');
    
    try {
      const { data, error } = await supabase
        .from('cash_sessions' as any)
        .insert([
          {
            user_id: user.id,
            branch_id: branchId,
            register_id: registerId,
            opening_float: openingFloat,
            notes: notes || null,
            status: 'open',
          }
        ])
        .select(`
          *,
          users:user_id (
            name
          )
        `)
        .single();

      if (error) {
        console.error('Error creating cash session:', error);
        throw error;
      }

      return cashService.mapDatabaseSessionToFrontend(data as unknown as CashSessionWithUser);
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
      // First, get the current session to calculate expected cash
      const { data: sessionData, error: sessionError } = await supabase
        .from('cash_sessions' as any)
        .select(`
          *,
          users:user_id (
            name
          )
        `)
        .eq('id', sessionId)
        .single();

      if (sessionError) {
        console.error('Error fetching session for closing:', sessionError);
        throw sessionError;
      }

      const session = cashService.mapDatabaseSessionToFrontend(sessionData as unknown as CashSessionWithUser);
      await cashService.fetchTransactionsForSession(session);

      // Calculate expected cash
      const expectedCash = session.openingFloat + session.cashInTotal - session.cashOutTotal + session.salesTotal;
      const discrepancy = actualCash - expectedCash;

      // Update the session
      const { data, error } = await supabase
        .from('cash_sessions' as any)
        .update({
          status: 'closed',
          closing_time: new Date().toISOString(),
          expected_cash: expectedCash,
          actual_cash: actualCash,
          discrepancy: discrepancy,
          notes: notes || session.notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sessionId)
        .select(`
          *,
          users:user_id (
            name
          )
        `)
        .single();

      if (error) {
        console.error('Error closing cash session:', error);
        throw error;
      }

      return cashService.mapDatabaseSessionToFrontend(data as unknown as CashSessionWithUser);
    } catch (error) {
      console.error('Error in closeSession:', error);
      throw error;
    }
  },

  // Add a cash movement (in, out, transfer)
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
      const { data, error } = await supabase
        .from('cash_movements' as any)
        .insert([
          {
            session_id: sessionId,
            user_id: userId,
            branch_id: branchId,
            movement_type: type,
            amount: amount,
            reason: reason,
            recipient_session_id: recipientSessionId || null,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding cash movement:', error);
        throw error;
      }

      return cashService.mapDatabaseMovementToFrontend(data as unknown as DatabaseCashMovement);
    } catch (error) {
      console.error('Error in addCashMovement:', error);
      throw error;
    }
  }
};
