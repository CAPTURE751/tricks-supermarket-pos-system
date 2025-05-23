
import { useState } from 'react';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Product } from '../types/inventory-types';
import { mockSuppliers } from '../data/mockData';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (product: any) => void;
  onCancel: () => void;
}

export const ProductForm = ({ product, onSubmit, onCancel }: ProductFormProps) => {
  const isEditing = !!product;
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    barcode: product?.barcode || '',
    description: product?.description || '',
    category: product?.category || '',
    department: product?.department || '',
    costPrice: product?.costPrice || 0,
    sellingPrice: product?.sellingPrice || 0,
    stock: product?.stock || 0,
    minStockLevel: product?.minStockLevel || 0,
    maxStockLevel: product?.maxStockLevel || 0,
    unit: product?.unit || 'piece',
    secondaryUnit: product?.secondaryUnit || '',
    conversionRate: product?.conversionRate || 1,
    taxRate: product?.taxRate || 0,
    supplierId: product?.supplierId || '',
    isActive: product?.isActive !== false,
    expiryDate: product?.expiryDate ? product.expiryDate.split('T')[0] : '',
    location: product?.location || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Transform form data back to proper types
    const transformedData = {
      ...formData,
      costPrice: Number(formData.costPrice),
      sellingPrice: Number(formData.sellingPrice),
      stock: Number(formData.stock),
      minStockLevel: Number(formData.minStockLevel),
      maxStockLevel: Number(formData.maxStockLevel),
      conversionRate: formData.conversionRate ? Number(formData.conversionRate) : undefined,
      taxRate: Number(formData.taxRate),
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : undefined,
    };

    if (isEditing) {
      onSubmit({
        ...transformedData,
        id: product.id,
        createdAt: product.createdAt,
        updatedAt: new Date().toISOString(),
      });
    } else {
      onSubmit(transformedData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-xl font-semibold mb-4">
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-base font-medium">Basic Information</h3>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Product Name *
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sku" className="block text-sm font-medium mb-1">
                SKU *
              </label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="barcode" className="block text-sm font-medium mb-1">
                Barcode
              </label>
              <Input
                id="barcode"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">
                Category
              </label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="department" className="block text-sm font-medium mb-1">
                Department
              </label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="supplierId" className="block text-sm font-medium mb-1">
              Supplier
            </label>
            <select
              id="supplierId"
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="">-- Select Supplier --</option>
              {mockSuppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Pricing & Stock Information */}
        <div className="space-y-4">
          <h3 className="text-base font-medium">Pricing & Stock</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="costPrice" className="block text-sm font-medium mb-1">
                Cost Price *
              </label>
              <Input
                id="costPrice"
                name="costPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.costPrice}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="sellingPrice" className="block text-sm font-medium mb-1">
                Selling Price *
              </label>
              <Input
                id="sellingPrice"
                name="sellingPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.sellingPrice}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="stock" className="block text-sm font-medium mb-1">
                Current Stock *
              </label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="minStockLevel" className="block text-sm font-medium mb-1">
                Min Stock
              </label>
              <Input
                id="minStockLevel"
                name="minStockLevel"
                type="number"
                min="0"
                value={formData.minStockLevel}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="maxStockLevel" className="block text-sm font-medium mb-1">
                Max Stock
              </label>
              <Input
                id="maxStockLevel"
                name="maxStockLevel"
                type="number"
                min="0"
                value={formData.maxStockLevel}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="unit" className="block text-sm font-medium mb-1">
                Unit *
              </label>
              <Input
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="taxRate" className="block text-sm font-medium mb-1">
                Tax Rate (%)
              </label>
              <Input
                id="taxRate"
                name="taxRate"
                type="number"
                min="0"
                max="100"
                value={formData.taxRate}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Storage Location
            </label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium mb-1">
              Expiry Date
            </label>
            <Input
              id="expiryDate"
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};
