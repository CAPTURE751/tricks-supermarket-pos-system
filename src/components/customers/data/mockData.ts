
import { Customer, CustomerTransaction, CustomerPayment, LoyaltyTier } from '../types/customer-types';

export const mockCustomers: Customer[] = [
  {
    id: 'C001',
    name: 'John Doe',
    phone: '+254711234567',
    email: 'john.doe@example.com',
    gender: 'Male',
    birthDate: '1985-05-15',
    address: '123 Moi Avenue, Nairobi',
    joinDate: '2023-01-15',
    lastPurchase: '2025-05-10',
    category: 'VIP',
    profileImage: undefined,
    loyaltyPoints: 520,
    totalSpent: 25000,
    hasMarketingConsent: true,
    creditLimit: 10000,
    outstandingBalance: 2500
  },
  {
    id: 'C002',
    name: 'Jane Smith',
    phone: '+254722345678',
    email: 'jane.smith@example.com',
    gender: 'Female',
    birthDate: '1990-08-22',
    address: '456 Kenyatta Avenue, Nairobi',
    joinDate: '2023-02-20',
    lastPurchase: '2025-05-15',
    category: 'Regular',
    profileImage: undefined,
    loyaltyPoints: 150,
    totalSpent: 8000,
    hasMarketingConsent: true,
    outstandingBalance: 0
  },
  {
    id: 'C003',
    name: 'Michael Johnson',
    phone: '+254733456789',
    email: 'michael.j@example.com',
    gender: 'Male',
    joinDate: '2023-03-10',
    lastPurchase: '2025-04-28',
    category: 'Wholesale',
    profileImage: undefined,
    loyaltyPoints: 1200,
    totalSpent: 120000,
    hasMarketingConsent: false,
    creditLimit: 50000,
    outstandingBalance: 15000
  },
  {
    id: 'C004',
    name: 'Sarah Williams',
    phone: '+254744567890',
    email: 'sarah.w@example.com',
    gender: 'Female',
    birthDate: '1988-12-10',
    address: '789 Uhuru Highway, Nairobi',
    joinDate: '2023-04-05',
    lastPurchase: '2025-05-02',
    category: 'Regular',
    profileImage: undefined,
    loyaltyPoints: 320,
    totalSpent: 15000,
    hasMarketingConsent: true,
    outstandingBalance: 0
  },
  {
    id: 'C005',
    name: 'David Brown',
    phone: '+254755678901',
    email: 'david.b@example.com',
    gender: 'Male',
    joinDate: '2023-05-12',
    category: 'Walk-in',
    profileImage: undefined,
    loyaltyPoints: 0,
    totalSpent: 2500,
    hasMarketingConsent: false,
    outstandingBalance: 0
  }
];

export const mockTransactions: CustomerTransaction[] = [
  {
    id: 'T001',
    customerId: 'C001',
    date: '2025-05-10T14:32:00',
    items: [
      { id: '1', name: 'Milk 1L', quantity: 2, price: 120, total: 240 },
      { id: '4', name: 'Rice 2kg', quantity: 1, price: 350, total: 350 }
    ],
    total: 590,
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    amountPaid: 590,
    balance: 0
  },
  {
    id: 'T002',
    customerId: 'C001',
    date: '2025-04-25T10:15:00',
    items: [
      { id: '2', name: 'Bread Loaf', quantity: 2, price: 60, total: 120 },
      { id: '5', name: 'Cooking Oil 1L', quantity: 1, price: 280, total: 280 },
      { id: '6', name: 'Sugar 1kg', quantity: 2, price: 150, total: 300 }
    ],
    total: 700,
    paymentMethod: 'Credit',
    paymentStatus: 'Credit',
    amountPaid: 0,
    balance: 700
  },
  {
    id: 'T003',
    customerId: 'C002',
    date: '2025-05-15T16:45:00',
    items: [
      { id: '1', name: 'Milk 1L', quantity: 1, price: 120, total: 120 },
      { id: '3', name: 'Bread Loaf', quantity: 1, price: 60, total: 60 }
    ],
    total: 180,
    paymentMethod: 'Mobile Money',
    paymentStatus: 'Paid',
    amountPaid: 180,
    balance: 0
  }
];

export const mockPayments: CustomerPayment[] = [
  {
    id: 'P001',
    customerId: 'C001',
    transactionId: 'T002',
    date: '2025-05-10T09:30:00',
    amount: 500,
    method: 'Cash',
    reference: 'Manual Payment'
  },
  {
    id: 'P002',
    customerId: 'C003',
    transactionId: 'T004',
    date: '2025-05-05T14:20:00',
    amount: 10000,
    method: 'Bank Transfer',
    reference: 'INV-2025-05-C003'
  }
];

export const loyaltyTiers: LoyaltyTier[] = [
  {
    id: 'tier1',
    name: 'Bronze',
    threshold: 0,
    discountPercent: 0,
    pointsMultiplier: 1
  },
  {
    id: 'tier2',
    name: 'Silver',
    threshold: 10000,
    discountPercent: 5,
    pointsMultiplier: 1.5
  },
  {
    id: 'tier3',
    name: 'Gold',
    threshold: 50000,
    discountPercent: 10,
    pointsMultiplier: 2
  },
  {
    id: 'tier4',
    name: 'Platinum',
    threshold: 100000,
    discountPercent: 15,
    pointsMultiplier: 3
  }
];

export const getCustomerTier = (totalSpent: number): LoyaltyTier => {
  const tier = [...loyaltyTiers]
    .sort((a, b) => b.threshold - a.threshold)
    .find(tier => totalSpent >= tier.threshold);
  
  return tier || loyaltyTiers[0];
};

export const getCustomerTransactions = (customerId: string): CustomerTransaction[] => {
  return mockTransactions.filter(transaction => transaction.customerId === customerId);
};

export const getCustomerPayments = (customerId: string): CustomerPayment[] => {
  return mockPayments.filter(payment => payment.customerId === customerId);
};
