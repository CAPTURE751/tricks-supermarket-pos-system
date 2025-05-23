
import { 
  PurchaseOrder, 
  PurchasePayment, 
  GoodsReceived, 
  SupplierReturn 
} from '../types/purchases-types';
import { Supplier } from '@/components/inventory/types/inventory-types';

// Mock suppliers data
export const mockPurchaseSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Coca-Cola Distributors Ltd',
    contactPerson: 'John Smith',
    email: 'john@ccdistributors.com',
    phone: '+254700123456',
    address: '123 Industrial Area, Nairobi',
    taxId: 'TAX123456',
    paymentTerms: 'Net 30',
    notes: 'Delivers every Monday and Thursday',
    isActive: true,
    createdAt: '2023-01-01T10:00:00Z',
    updatedAt: '2023-01-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Fresh Bakeries Kenya',
    contactPerson: 'Mary Johnson',
    email: 'mary@freshbakeries.co.ke',
    phone: '+254722987654',
    address: '456 Bakery Lane, Nairobi',
    taxId: 'TAX789012',
    paymentTerms: 'Cash on Delivery',
    notes: 'Daily early morning deliveries',
    isActive: true,
    createdAt: '2023-01-02T09:30:00Z',
    updatedAt: '2023-01-02T09:30:00Z'
  },
  {
    id: '3',
    name: 'Kenya Grain Processors',
    contactPerson: 'Sarah Njeri',
    email: 'sarah@kgprocessors.co.ke',
    phone: '+254711222333',
    address: '101 Grain Mill Road, Thika',
    taxId: 'TAX901234',
    paymentTerms: 'Net 45',
    notes: 'Bulk discounts available',
    isActive: true,
    createdAt: '2023-01-04T08:45:00Z',
    updatedAt: '2023-01-04T08:45:00Z'
  }
];

// Mock purchase orders data
export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    orderNumber: 'PO-2023-001',
    supplierId: '1',
    supplierName: 'Coca-Cola Distributors Ltd',
    status: 'received',
    paymentStatus: 'paid',
    orderDate: '2023-06-01T09:00:00Z',
    expectedDeliveryDate: '2023-06-05T09:00:00Z',
    receivedDate: '2023-06-04T14:30:00Z',
    subtotal: 9000,
    taxAmount: 1440,
    shippingCost: 500,
    otherCharges: 0,
    discount: 500,
    total: 10440,
    notes: 'Regular monthly order',
    createdBy: '1',
    createdAt: '2023-06-01T09:00:00Z',
    updatedAt: '2023-06-04T14:30:00Z',
    items: [
      {
        id: '101',
        purchaseOrderId: '1',
        productId: '1',
        productName: 'Coca-Cola 500ml',
        sku: 'CC500',
        quantity: 200,
        orderedQuantity: 200,
        receivedQuantity: 200,
        costPrice: 45,
        taxRate: 16,
        taxAmount: 1440,
        discount: 500,
        total: 9000
      }
    ],
    payments: [
      {
        id: 'pmt-001',
        purchaseOrderId: '1',
        amount: 10440,
        paymentDate: '2023-06-04T15:30:00Z',
        paymentMethod: 'Bank Transfer',
        referenceNumber: 'TRF-123456',
        notes: 'Full payment',
        createdBy: '1',
        createdAt: '2023-06-04T15:30:00Z'
      }
    ]
  },
  {
    id: '2',
    orderNumber: 'PO-2023-002',
    supplierId: '2',
    supplierName: 'Fresh Bakeries Kenya',
    status: 'sent',
    paymentStatus: 'unpaid',
    orderDate: '2023-06-15T08:00:00Z',
    expectedDeliveryDate: '2023-06-16T07:00:00Z',
    subtotal: 2000,
    taxAmount: 0,
    shippingCost: 200,
    otherCharges: 0,
    discount: 0,
    total: 2200,
    notes: 'Urgent order',
    createdBy: '1',
    createdAt: '2023-06-15T08:00:00Z',
    updatedAt: '2023-06-15T08:00:00Z',
    items: [
      {
        id: '201',
        purchaseOrderId: '2',
        productId: '2',
        productName: 'Bread Loaf',
        sku: 'BL001',
        quantity: 50,
        orderedQuantity: 50,
        receivedQuantity: 0,
        costPrice: 40,
        taxRate: 0,
        taxAmount: 0,
        discount: 0,
        total: 2000
      }
    ]
  },
  {
    id: '3',
    orderNumber: 'PO-2023-003',
    supplierId: '3',
    supplierName: 'Kenya Grain Processors',
    status: 'partially_received',
    paymentStatus: 'partially_paid',
    orderDate: '2023-06-10T10:30:00Z',
    expectedDeliveryDate: '2023-06-17T10:30:00Z',
    receivedDate: '2023-06-17T11:45:00Z',
    subtotal: 11000,
    taxAmount: 0,
    shippingCost: 1000,
    otherCharges: 200,
    discount: 1000,
    total: 11200,
    notes: 'Bulk order with partial delivery',
    createdBy: '2',
    createdAt: '2023-06-10T10:30:00Z',
    updatedAt: '2023-06-17T11:45:00Z',
    items: [
      {
        id: '301',
        purchaseOrderId: '3',
        productId: '4',
        productName: 'Rice 2kg',
        sku: 'R2KG',
        quantity: 40,
        orderedQuantity: 40,
        receivedQuantity: 30,
        costPrice: 250,
        taxRate: 0,
        taxAmount: 0,
        discount: 1000,
        total: 10000
      },
      {
        id: '302',
        purchaseOrderId: '3',
        productId: '6',
        productName: 'Sugar 1kg',
        sku: 'S1KG',
        quantity: 10,
        orderedQuantity: 10,
        receivedQuantity: 0,
        costPrice: 100,
        taxRate: 0,
        taxAmount: 0,
        discount: 0,
        total: 1000
      }
    ],
    payments: [
      {
        id: 'pmt-002',
        purchaseOrderId: '3',
        amount: 5000,
        paymentDate: '2023-06-11T09:15:00Z',
        paymentMethod: 'MPESA',
        referenceNumber: 'MP123456789',
        notes: 'Deposit payment',
        createdBy: '2',
        createdAt: '2023-06-11T09:15:00Z'
      }
    ]
  },
  {
    id: '4',
    orderNumber: 'PO-2023-004',
    supplierId: '1',
    supplierName: 'Coca-Cola Distributors Ltd',
    status: 'draft',
    paymentStatus: 'unpaid',
    orderDate: '2023-06-20T14:00:00Z',
    subtotal: 4500,
    taxAmount: 720,
    shippingCost: 0,
    otherCharges: 0,
    discount: 0,
    total: 5220,
    createdBy: '1',
    createdAt: '2023-06-20T14:00:00Z',
    updatedAt: '2023-06-20T14:00:00Z',
    items: [
      {
        id: '401',
        purchaseOrderId: '4',
        productId: '1',
        productName: 'Coca-Cola 500ml',
        sku: 'CC500',
        quantity: 100,
        orderedQuantity: 100,
        receivedQuantity: 0,
        costPrice: 45,
        taxRate: 16,
        taxAmount: 720,
        discount: 0,
        total: 4500
      }
    ]
  }
];

// Mock goods received data
export const mockGoodsReceived: GoodsReceived[] = [
  {
    id: '1',
    grnNumber: 'GRN-2023-001',
    purchaseOrderId: '1',
    receiveDate: '2023-06-04T14:30:00Z',
    deliveryNoteNumber: 'DN-CC-12345',
    receivedBy: '1',
    notes: 'All items received in good condition',
    createdAt: '2023-06-04T14:30:00Z',
    updatedAt: '2023-06-04T14:30:00Z',
    items: [
      {
        id: '101',
        grnId: '1',
        purchaseOrderItemId: '101',
        productId: '1',
        productName: 'Coca-Cola 500ml',
        sku: 'CC500',
        expectedQuantity: 200,
        receivedQuantity: 200,
        acceptedQuantity: 200,
        rejectedQuantity: 0,
        rejectionReason: ''
      }
    ]
  },
  {
    id: '2',
    grnNumber: 'GRN-2023-002',
    purchaseOrderId: '3',
    receiveDate: '2023-06-17T11:45:00Z',
    deliveryNoteNumber: 'DN-KG-54321',
    receivedBy: '2',
    notes: 'Partial delivery, waiting for remaining items',
    createdAt: '2023-06-17T11:45:00Z',
    updatedAt: '2023-06-17T11:45:00Z',
    items: [
      {
        id: '201',
        grnId: '2',
        purchaseOrderItemId: '301',
        productId: '4',
        productName: 'Rice 2kg',
        sku: 'R2KG',
        expectedQuantity: 40,
        receivedQuantity: 32,
        acceptedQuantity: 30,
        rejectedQuantity: 2,
        rejectionReason: 'Damaged packaging'
      }
    ]
  }
];

// Mock supplier returns data
export const mockSupplierReturns: SupplierReturn[] = [
  {
    id: '1',
    returnNumber: 'SR-2023-001',
    supplierId: '1',
    supplierName: 'Coca-Cola Distributors Ltd',
    returnDate: '2023-06-10T09:30:00Z',
    reason: 'Damaged Products',
    total: 450,
    notes: 'Products damaged during transit',
    createdBy: '1',
    createdAt: '2023-06-10T09:30:00Z',
    updatedAt: '2023-06-10T09:30:00Z',
    items: [
      {
        id: '101',
        returnId: '1',
        productId: '1',
        productName: 'Coca-Cola 500ml',
        sku: 'CC500',
        quantity: 10,
        costPrice: 45,
        total: 450,
        reason: 'Bottles broken'
      }
    ]
  }
];
