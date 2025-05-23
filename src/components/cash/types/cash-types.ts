
// Session status types
export type SessionStatus = 'open' | 'closed' | 'pending_closure';

// Cash movement types
export type CashMovementType = 'in' | 'out' | 'transfer' | 'float' | 'petty_cash';

// Discrepancy status types
export type DiscrepancyStatus = 'none' | 'minor' | 'significant' | 'critical';

export interface CashSession {
  id: string;
  registerName: string;
  registerID: string;
  cashierID: string;
  cashierName: string;
  openingTime: string;
  closingTime?: string;
  openingFloat: number;
  expectedClosingAmount?: number;
  actualClosingAmount?: number;
  discrepancyAmount?: number;
  discrepancyStatus?: DiscrepancyStatus;
  discrepancyNotes?: string;
  status: SessionStatus;
  transactions: CashTransaction[];
  salesTotal: number;
  cashInTotal: number;
  cashOutTotal: number;
  notes?: string;
}

export interface CashTransaction {
  id: string;
  sessionId: string;
  timestamp: string;
  amount: number;
  type: CashMovementType;
  reason: string;
  notes?: string;
  referenceNumber?: string;
  authorizedBy?: string;
  receivedBy?: string;
  transferredTo?: string;
  createdBy: string;
}

export interface SessionReport {
  id: string;
  sessionId: string;
  generatedAt: string;
  totalSales: number;
  totalCashIn: number;
  totalCashOut: number;
  netAmount: number;
  discrepancyAmount?: number;
  discrepancyStatus?: DiscrepancyStatus;
  notes?: string;
  generatedBy: string;
}
