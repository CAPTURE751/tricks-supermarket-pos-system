
export type DatabaseSession = {
  id: string;
  user_id: string;
  branch_id: string;
  register_id: string;
  status: 'open' | 'closed';
  opening_float: number;
  opening_time: string;
  closing_time: string | null;
  expected_cash: number | null;
  actual_cash: number | null;
  discrepancy: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type DatabaseCashMovement = {
  id: string;
  session_id: string;
  user_id: string;
  branch_id: string;
  movement_type: 'cash_in' | 'cash_out' | 'transfer';
  amount: number;
  reason: string;
  recipient_session_id: string | null;
  created_at: string;
}

export type CashSessionWithUser = DatabaseSession & {
  users: {
    name: string;
  };
}
