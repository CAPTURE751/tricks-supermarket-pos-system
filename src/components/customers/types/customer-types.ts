
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  birthDate?: string;
  address?: string;
  joinDate: string;
  lastPurchase?: string;
  category: CustomerCategory;
  profileImage?: string;
  loyaltyPoints: number;
  totalSpent: number;
  hasMarketingConsent: boolean;
  creditLimit?: number;
  outstandingBalance: number;
}

export type CustomerCategory = 'VIP' | 'Regular' | 'Wholesale' | 'Walk-in' | 'New';

export interface CustomerTransaction {
  id: string;
  customerId: string;
  date: string;
  items: TransactionItem[];
  total: number;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Partial' | 'Credit';
  amountPaid: number;
  balance: number;
}

export interface TransactionItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface CustomerPayment {
  id: string;
  customerId: string;
  transactionId: string;
  date: string;
  amount: number;
  method: string;
  reference: string;
}

export interface LoyaltyTier {
  id: string;
  name: string;
  threshold: number;
  discountPercent: number;
  pointsMultiplier: number;
}
