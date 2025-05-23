
export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  description: string;
  category: string;
  department: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minStockLevel: number;
  maxStockLevel: number;
  unit: string;
  secondaryUnit?: string;
  conversionRate?: number;
  image?: string;
  taxRate: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  supplierId?: string;
  expiryDate?: string;
  location?: string;
  serialNumbers?: string[];
  batchNumber?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
  paymentTerms?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  status: 'draft' | 'sent' | 'received' | 'partially_received' | 'cancelled';
  orderDate: string;
  expectedDeliveryDate?: string;
  receivedDate?: string;
  total: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  items: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  orderedQuantity: number;
  receivedQuantity: number;
  costPrice: number;
  total: number;
}

export interface InventoryAdjustment {
  id: string;
  referenceNumber: string;
  adjustmentDate: string;
  reason: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  items: InventoryAdjustmentItem[];
}

export interface InventoryAdjustmentItem {
  id: string;
  adjustmentId: string;
  productId: string;
  productName: string;
  sku: string;
  previousQuantity: number;
  newQuantity: number;
  change: number;
  cost: number;
}

export interface StockTransferOrder {
  id: string;
  referenceNumber: string;
  fromLocation: string;
  toLocation: string;
  status: 'pending' | 'in_transit' | 'completed' | 'cancelled';
  transferDate: string;
  expectedArrivalDate?: string;
  completedDate?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  items: StockTransferItem[];
}

export interface StockTransferItem {
  id: string;
  transferId: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  receivedQuantity?: number;
}

export interface InventoryTransaction {
  id: string;
  date: string;
  type: 'sale' | 'purchase' | 'adjustment' | 'transfer' | 'return';
  referenceNumber: string;
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  location: string;
  notes?: string;
  createdBy: string;
}

export interface InventoryValuation {
  costingMethod: 'fifo' | 'lifo' | 'average';
  asOfDate: string;
  totalValue: number;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }[];
}
