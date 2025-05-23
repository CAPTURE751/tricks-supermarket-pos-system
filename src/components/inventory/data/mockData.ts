
import { Product, Supplier, PurchaseOrder, InventoryAdjustment, StockTransferOrder, InventoryTransaction } from '../types/inventory-types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Coca-Cola 500ml',
    sku: 'CC500',
    barcode: '5000112637922',
    description: 'Coca-Cola Classic Soda 500ml bottle',
    category: 'Beverages',
    department: 'Drinks',
    costPrice: 45,
    sellingPrice: 80,
    stock: 120,
    minStockLevel: 30,
    maxStockLevel: 200,
    unit: 'bottle',
    taxRate: 16,
    isActive: true,
    createdAt: '2023-01-15T08:30:00Z',
    updatedAt: '2023-01-15T08:30:00Z',
    supplierId: '1',
    location: 'Main Shelf A1'
  },
  {
    id: '2',
    name: 'Bread Loaf',
    sku: 'BL001',
    barcode: '5001092831023',
    description: 'Fresh white bread loaf 400g',
    category: 'Bread',
    department: 'Bakery',
    costPrice: 40,
    sellingPrice: 60,
    stock: 25,
    minStockLevel: 10,
    maxStockLevel: 50,
    unit: 'loaf',
    taxRate: 0,
    isActive: true,
    createdAt: '2023-01-16T07:15:00Z',
    updatedAt: '2023-01-16T07:15:00Z',
    supplierId: '2',
    expiryDate: '2023-06-30T00:00:00Z',
    location: 'Bakery Section B2'
  },
  {
    id: '3',
    name: 'Fresh Milk 1L',
    sku: 'FM001',
    barcode: '5900113642810',
    description: 'Fresh whole milk 1 liter carton',
    category: 'Dairy',
    department: 'Fresh Products',
    costPrice: 90,
    sellingPrice: 120,
    stock: 30,
    minStockLevel: 20,
    maxStockLevel: 100,
    unit: 'carton',
    taxRate: 0,
    isActive: true,
    createdAt: '2023-01-17T06:45:00Z',
    updatedAt: '2023-01-17T06:45:00Z',
    supplierId: '3',
    expiryDate: '2023-06-15T00:00:00Z',
    location: 'Refrigerated Section C3'
  },
  {
    id: '4',
    name: 'Rice 2kg',
    sku: 'R2KG',
    barcode: '5800112233445',
    description: 'Premium long grain rice 2kg pack',
    category: 'Grains',
    department: 'Dry Goods',
    costPrice: 250,
    sellingPrice: 350,
    stock: 15,
    minStockLevel: 20,
    maxStockLevel: 100,
    unit: 'pack',
    secondaryUnit: 'kg',
    conversionRate: 2,
    taxRate: 0,
    isActive: true,
    createdAt: '2023-01-18T09:30:00Z',
    updatedAt: '2023-01-18T09:30:00Z',
    supplierId: '4',
    expiryDate: '2024-01-10T00:00:00Z',
    location: 'Dry Goods D4'
  },
  {
    id: '5',
    name: 'Cooking Oil 1L',
    sku: 'CO1L',
    barcode: '5700009876543',
    description: 'Vegetable cooking oil 1 liter bottle',
    category: 'Oils',
    department: 'Cooking',
    costPrice: 200,
    sellingPrice: 280,
    stock: 20,
    minStockLevel: 15,
    maxStockLevel: 80,
    unit: 'bottle',
    secondaryUnit: 'L',
    conversionRate: 1,
    taxRate: 16,
    isActive: true,
    createdAt: '2023-01-19T10:15:00Z',
    updatedAt: '2023-01-19T10:15:00Z',
    supplierId: '5',
    expiryDate: '2023-12-15T00:00:00Z',
    location: 'Cooking Supplies E5'
  },
  {
    id: '6',
    name: 'Sugar 1kg',
    sku: 'S1KG',
    barcode: '5600001234567',
    description: 'White sugar 1kg pack',
    category: 'Sweeteners',
    department: 'Pantry',
    costPrice: 110,
    sellingPrice: 150,
    stock: 40,
    minStockLevel: 25,
    maxStockLevel: 120,
    unit: 'pack',
    secondaryUnit: 'kg',
    conversionRate: 1,
    taxRate: 0,
    isActive: true,
    createdAt: '2023-01-20T11:00:00Z',
    updatedAt: '2023-01-20T11:00:00Z',
    supplierId: '4',
    expiryDate: '2024-02-20T00:00:00Z',
    location: 'Pantry F6'
  },
  {
    id: '7',
    name: 'Laptop HP Pavilion',
    sku: 'HPLAP001',
    barcode: '5500009988776',
    description: 'HP Pavilion Laptop 15" 8GB RAM 512GB SSD',
    category: 'Laptops',
    department: 'Electronics',
    costPrice: 45000,
    sellingPrice: 65000,
    stock: 5,
    minStockLevel: 3,
    maxStockLevel: 15,
    unit: 'piece',
    taxRate: 16,
    isActive: true,
    createdAt: '2023-01-21T12:30:00Z',
    updatedAt: '2023-01-21T12:30:00Z',
    supplierId: '6',
    serialNumbers: ['HP20230001', 'HP20230002', 'HP20230003', 'HP20230004', 'HP20230005'],
    location: 'Electronics G7'
  }
];

export const mockSuppliers: Supplier[] = [
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
    name: 'Dairy Fresh Products',
    contactPerson: 'Robert Milk',
    email: 'robert@dairyfresh.com',
    phone: '+254733456789',
    address: '789 Dairy Road, Nakuru',
    taxId: 'TAX345678',
    paymentTerms: 'Net 15',
    notes: 'Refrigerated delivery truck',
    isActive: true,
    createdAt: '2023-01-03T11:15:00Z',
    updatedAt: '2023-01-03T11:15:00Z'
  },
  {
    id: '4',
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
  },
  {
    id: '5',
    name: 'Kenafric Industries',
    contactPerson: 'David Omondi',
    email: 'david@kenafric.com',
    phone: '+254744555666',
    address: '202 Industrial Way, Nairobi',
    taxId: 'TAX567890',
    paymentTerms: 'Net 60',
    notes: 'Requires one week lead time for orders',
    isActive: true,
    createdAt: '2023-01-05T13:20:00Z',
    updatedAt: '2023-01-05T13:20:00Z'
  },
  {
    id: '6',
    name: 'Tech Imports Ltd',
    contactPerson: 'Alice Wanjiku',
    email: 'alice@techimports.co.ke',
    phone: '+254766777888',
    address: '303 Digital Plaza, Nairobi',
    taxId: 'TAX234567',
    paymentTerms: 'Payment in Advance',
    notes: 'International shipments monthly',
    isActive: true,
    createdAt: '2023-01-06T14:10:00Z',
    updatedAt: '2023-01-06T14:10:00Z'
  }
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    orderNumber: 'PO-2023-001',
    supplierId: '1',
    supplierName: 'Coca-Cola Distributors Ltd',
    status: 'received',
    orderDate: '2023-06-01T09:00:00Z',
    expectedDeliveryDate: '2023-06-05T09:00:00Z',
    receivedDate: '2023-06-04T14:30:00Z',
    total: 9000,
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
        total: 9000
      }
    ]
  },
  {
    id: '2',
    orderNumber: 'PO-2023-002',
    supplierId: '2',
    supplierName: 'Fresh Bakeries Kenya',
    status: 'sent',
    orderDate: '2023-06-15T08:00:00Z',
    expectedDeliveryDate: '2023-06-16T07:00:00Z',
    receivedDate: undefined,
    total: 2000,
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
        total: 2000
      }
    ]
  },
  {
    id: '3',
    orderNumber: 'PO-2023-003',
    supplierId: '4',
    supplierName: 'Kenya Grain Processors',
    status: 'partially_received',
    orderDate: '2023-06-10T10:30:00Z',
    expectedDeliveryDate: '2023-06-17T10:30:00Z',
    receivedDate: '2023-06-17T11:45:00Z',
    total: 11000,
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
        total: 1000
      }
    ]
  }
];

export const mockAdjustments: InventoryAdjustment[] = [
  {
    id: '1',
    referenceNumber: 'ADJ-2023-001',
    adjustmentDate: '2023-06-10T15:30:00Z',
    reason: 'Damaged Stock',
    notes: '3 bottles broken during shelf stocking',
    createdBy: '1',
    createdAt: '2023-06-10T15:30:00Z',
    updatedAt: '2023-06-10T15:30:00Z',
    items: [
      {
        id: '101',
        adjustmentId: '1',
        productId: '1',
        productName: 'Coca-Cola 500ml',
        sku: 'CC500',
        previousQuantity: 123,
        newQuantity: 120,
        change: -3,
        cost: 135
      }
    ]
  },
  {
    id: '2',
    referenceNumber: 'ADJ-2023-002',
    adjustmentDate: '2023-06-12T09:15:00Z',
    reason: 'Stock Count',
    notes: 'Monthly inventory count adjustment',
    createdBy: '2',
    createdAt: '2023-06-12T09:15:00Z',
    updatedAt: '2023-06-12T09:15:00Z',
    items: [
      {
        id: '201',
        adjustmentId: '2',
        productId: '4',
        productName: 'Rice 2kg',
        sku: 'R2KG',
        previousQuantity: 12,
        newQuantity: 15,
        change: 3,
        cost: 750
      },
      {
        id: '202',
        adjustmentId: '2',
        productId: '5',
        productName: 'Cooking Oil 1L',
        sku: 'CO1L',
        previousQuantity: 22,
        newQuantity: 20,
        change: -2,
        cost: 400
      }
    ]
  }
];

export const mockTransfers: StockTransferOrder[] = [
  {
    id: '1',
    referenceNumber: 'TRF-2023-001',
    fromLocation: 'Main Store',
    toLocation: 'Branch 2',
    status: 'completed',
    transferDate: '2023-06-05T10:00:00Z',
    expectedArrivalDate: '2023-06-06T14:00:00Z',
    completedDate: '2023-06-06T13:30:00Z',
    notes: 'Weekly stock transfer',
    createdBy: '1',
    createdAt: '2023-06-05T10:00:00Z',
    updatedAt: '2023-06-06T13:30:00Z',
    items: [
      {
        id: '101',
        transferId: '1',
        productId: '1',
        productName: 'Coca-Cola 500ml',
        sku: 'CC500',
        quantity: 50,
        receivedQuantity: 50
      },
      {
        id: '102',
        transferId: '1',
        productId: '3',
        productName: 'Fresh Milk 1L',
        sku: 'FM001',
        quantity: 20,
        receivedQuantity: 20
      }
    ]
  },
  {
    id: '2',
    referenceNumber: 'TRF-2023-002',
    fromLocation: 'Main Store',
    toLocation: 'Branch 3',
    status: 'in_transit',
    transferDate: '2023-06-14T11:30:00Z',
    expectedArrivalDate: '2023-06-15T15:00:00Z',
    completedDate: undefined,
    notes: 'Urgent electronics transfer',
    createdBy: '1',
    createdAt: '2023-06-14T11:30:00Z',
    updatedAt: '2023-06-14T11:30:00Z',
    items: [
      {
        id: '201',
        transferId: '2',
        productId: '7',
        productName: 'Laptop HP Pavilion',
        sku: 'HPLAP001',
        quantity: 2,
        receivedQuantity: undefined
      }
    ]
  }
];

export const mockTransactions: InventoryTransaction[] = [
  {
    id: '1',
    date: '2023-06-01T14:30:00Z',
    type: 'purchase',
    referenceNumber: 'PO-2023-001',
    productId: '1',
    productName: 'Coca-Cola 500ml',
    quantity: 200,
    unitCost: 45,
    totalCost: 9000,
    location: 'Main Store',
    createdBy: '1'
  },
  {
    id: '2',
    date: '2023-06-02T09:45:00Z',
    type: 'sale',
    referenceNumber: 'INV-2023-1001',
    productId: '1',
    productName: 'Coca-Cola 500ml',
    quantity: -5,
    unitCost: 45,
    totalCost: 225,
    location: 'Main Store',
    createdBy: '3'
  },
  {
    id: '3',
    date: '2023-06-05T10:00:00Z',
    type: 'transfer',
    referenceNumber: 'TRF-2023-001',
    productId: '1',
    productName: 'Coca-Cola 500ml',
    quantity: -50,
    unitCost: 45,
    totalCost: 2250,
    location: 'Main Store',
    notes: 'Transferred to Branch 2',
    createdBy: '1'
  },
  {
    id: '4',
    date: '2023-06-06T13:30:00Z',
    type: 'transfer',
    referenceNumber: 'TRF-2023-001',
    productId: '1',
    productName: 'Coca-Cola 500ml',
    quantity: 50,
    unitCost: 45,
    totalCost: 2250,
    location: 'Branch 2',
    notes: 'Received from Main Store',
    createdBy: '4'
  },
  {
    id: '5',
    date: '2023-06-10T15:30:00Z',
    type: 'adjustment',
    referenceNumber: 'ADJ-2023-001',
    productId: '1',
    productName: 'Coca-Cola 500ml',
    quantity: -3,
    unitCost: 45,
    totalCost: 135,
    location: 'Main Store',
    notes: 'Damaged Stock',
    createdBy: '1'
  },
  {
    id: '6',
    date: '2023-06-17T11:45:00Z',
    type: 'purchase',
    referenceNumber: 'PO-2023-003',
    productId: '4',
    productName: 'Rice 2kg',
    quantity: 30,
    unitCost: 250,
    totalCost: 7500,
    location: 'Main Store',
    notes: 'Partial order received',
    createdBy: '2'
  }
];
