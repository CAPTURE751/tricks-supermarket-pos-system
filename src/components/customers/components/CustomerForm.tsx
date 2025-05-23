
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Customer, CustomerCategory } from '../types/customer-types';

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: Customer) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say']).optional(),
  birthDate: z.string().optional(),
  address: z.string().optional(),
  category: z.enum(['VIP', 'Regular', 'Wholesale', 'Walk-in', 'New']),
  hasMarketingConsent: z.boolean(),
  creditLimit: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const CustomerForm = ({ customer, onSubmit, onCancel }: CustomerFormProps) => {
  const [profileImage, setProfileImage] = useState<string | undefined>(customer?.profileImage);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: customer?.name || '',
      phone: customer?.phone || '',
      email: customer?.email || '',
      gender: customer?.gender,
      birthDate: customer?.birthDate || '',
      address: customer?.address || '',
      category: customer?.category || 'Regular',
      hasMarketingConsent: customer?.hasMarketingConsent || false,
      creditLimit: customer?.creditLimit || undefined,
    }
  });

  const handleSubmit = (data: FormValues) => {
    const customerData = {
      ...data,
      id: customer?.id || '',
      joinDate: customer?.joinDate || new Date().toISOString().split('T')[0],
      profileImage,
      loyaltyPoints: customer?.loyaltyPoints || 0,
      totalSpent: customer?.totalSpent || 0,
      lastPurchase: customer?.lastPurchase,
      outstandingBalance: customer?.outstandingBalance || 0,
    } as Customer;
    
    onSubmit(customerData);
  };

  const categories: CustomerCategory[] = ['VIP', 'Regular', 'Wholesale', 'Walk-in', 'New'];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-2">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="creditLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credit Limit (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    value={field.value || ''} 
                    onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St, City, Country" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="hasMarketingConsent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Customer consents to receiving marketing communications
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {customer ? 'Update Customer' : 'Add Customer'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
