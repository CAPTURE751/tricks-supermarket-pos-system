
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatabaseProduct, DatabaseCategory } from '@/services/products-service';

interface ProductFormProps {
  product?: DatabaseProduct | null;
  categories: DatabaseCategory[];
  onSubmit: (product: any) => void;
  onCancel: () => void;
}

export const ProductForm = ({ product, categories, onSubmit, onCancel }: ProductFormProps) => {
  const isEditing = !!product;
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    barcode: product?.barcode || '',
    description: product?.description || '',
    category_id: product?.category_id || '',
    cost_price: product?.cost_price || 0,
    selling_price: product?.selling_price || 0,
    stock_quantity: product?.stock_quantity || 0,
    min_stock_level: product?.min_stock_level || 0,
    max_stock_level: product?.max_stock_level || 0,
    unit: product?.unit || 'piece',
    tax_rate: product?.tax_rate || 0,
    location: product?.location || '',
    expiry_date: product?.expiry_date ? product.expiry_date.split('T')[0] : '',
    is_active: product?.is_active !== false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Transform form data back to proper types
    const transformedData = {
      ...formData,
      cost_price: Number(formData.cost_price),
      selling_price: Number(formData.selling_price),
      stock_quantity: Number(formData.stock_quantity),
      min_stock_level: Number(formData.min_stock_level),
      max_stock_level: Number(formData.max_stock_level),
      tax_rate: Number(formData.tax_rate),
      expiry_date: formData.expiry_date || null,
      category_id: formData.category_id || null,
    };

    if (isEditing) {
      onSubmit({
        ...transformedData,
        id: product.id,
        created_at: product.created_at,
        updated_at: new Date().toISOString(),
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
          
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium mb-1">
              Category
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="">-- Select Category --</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
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
              <label htmlFor="cost_price" className="block text-sm font-medium mb-1">
                Cost Price *
              </label>
              <Input
                id="cost_price"
                name="cost_price"
                type="number"
                min="0"
                step="0.01"
                value={formData.cost_price}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="selling_price" className="block text-sm font-medium mb-1">
                Selling Price *
              </label>
              <Input
                id="selling_price"
                name="selling_price"
                type="number"
                min="0"
                step="0.01"
                value={formData.selling_price}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="stock_quantity" className="block text-sm font-medium mb-1">
                Current Stock *
              </label>
              <Input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="min_stock_level" className="block text-sm font-medium mb-1">
                Min Stock
              </label>
              <Input
                id="min_stock_level"
                name="min_stock_level"
                type="number"
                min="0"
                value={formData.min_stock_level}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="max_stock_level" className="block text-sm font-medium mb-1">
                Max Stock
              </label>
              <Input
                id="max_stock_level"
                name="max_stock_level"
                type="number"
                min="0"
                value={formData.max_stock_level}
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
              <label htmlFor="tax_rate" className="block text-sm font-medium mb-1">
                Tax Rate (%)
              </label>
              <Input
                id="tax_rate"
                name="tax_rate"
                type="number"
                min="0"
                max="100"
                value={formData.tax_rate}
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
            <label htmlFor="expiry_date" className="block text-sm font-medium mb-1">
              Expiry Date
            </label>
            <Input
              id="expiry_date"
              name="expiry_date"
              type="date"
              value={formData.expiry_date}
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
