
import { User } from '@/hooks/useAuth';

export interface ReportsModuleProps {
  user: User;
}

export interface CurrencyRate {
  USD: number;
  KES: number;
  EUR: number;
  GBP: number;
}

export interface CurrencySymbol {
  USD: string;
  KES: string;
  EUR: string;
  GBP: string;
}

export interface ReportTabProps {
  formatCurrency: (amount: number | string | undefined) => string;
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  account: string;
}

export interface IncomeStatementItem {
  category: string;
  amount: number;
}

export interface BalanceSheetItem {
  item: string;
  amount: number;
}

export interface BalanceSheetData {
  assets: BalanceSheetItem[];
  liabilities: BalanceSheetItem[];
  equity: BalanceSheetItem[];
}

export interface ChartDataItem {
  name: string;
  revenue: number;
  expenses: number;
}
