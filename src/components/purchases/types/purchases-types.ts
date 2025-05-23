
// Purchase order status types
export type PurchaseOrderStatus = 'draft' | 'submitted' | 'approved' | 'sent' | 'partially_received' | 'received' | 'cancelled';

// Payment status types
export type PaymentStatus = 'unpaid' | 'partially_paid' | 'paid';

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  status: PurchaseOrderStatus;
  paymentStatus: PaymentStatus;
  orderDate: string;
  expectedDeliveryDate?: string;
  receivedDate?: string;
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  otherCharges: number;
  discount: number;
  total: number;
  notes?: string;
  reference?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  items: PurchaseOrderItem[];
  payments?: PurchasePayment[];
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
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  notes?: string;
}

export interface PurchasePayment {
  id: string;
  purchaseOrderId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  referenceNumber?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface GoodsReceived {
  id: string;
  grnNumber: string;
  purchaseOrderId: string;
  receiveDate: string;
  deliveryNoteNumber?: string;
  receivedBy: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: GoodsReceivedItem[];
}

export interface GoodsReceivedItem {
  id: string;
  grnId: string;
  purchaseOrderItemId: string;
  productId: string;
  productName: string;
  sku: string;
  expectedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  rejectionReason?: string;
  notes?: string;
}

export interface SupplierReturn {
  id: string;
  returnNumber: string;
  supplierId: string;
  supplierName: string;
  returnDate: string;
  reason: string;
  total: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  items: SupplierReturnItem[];
}

export interface SupplierReturnItem {
  id: string;
  returnId: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  costPrice: number;
  total: number;
  reason: string;
}
