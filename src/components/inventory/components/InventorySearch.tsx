
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Barcode } from 'lucide-react';

interface InventorySearchProps {
  onSearch: (query: string) => void;
  onFilterChange: (status: string) => void;
}

export const InventorySearch = ({ onSearch, onFilterChange }: InventorySearchProps) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  return (
    <div className="bg-muted/30 rounded-lg p-4 space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product name, SKU, or description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit">Search</Button>
        <Button type="button" variant="outline" title="Scan Barcode">
          <Barcode className="h-4 w-4" />
        </Button>
      </form>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onFilterChange('all')}
          className="whitespace-nowrap"
        >
          All Items
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onFilterChange('in-stock')}
          className="whitespace-nowrap"
        >
          In Stock
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onFilterChange('low-stock')}
          className="whitespace-nowrap text-amber-500"
        >
          Low Stock
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onFilterChange('out-of-stock')}
          className="whitespace-nowrap text-red-500"
        >
          Out of Stock
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onFilterChange('expiring-soon')}
          className="whitespace-nowrap text-orange-500"
        >
          Expiring Soon
        </Button>
        <Button variant="outline" size="sm" className="whitespace-nowrap">
          <Filter className="h-3 w-3 mr-1" />
          More Filters
        </Button>
      </div>
    </div>
  );
};
