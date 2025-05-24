
import { supabase } from './client';

export const seedInitialData = async () => {
  console.log('Checking if initial seed data is needed...');
  
  try {
    // Check if we have at least one branch using raw SQL
    const { data: branches, error: branchError } = await supabase.rpc('custom_query', {
      query: 'SELECT id FROM branches LIMIT 1'
    }).single();
    
    // If the function doesn't exist, fall back to direct table access
    if (branchError?.code === '42883') {
      console.log('Using direct table access for seeding...');
      
      // Try to create initial data directly
      const { data: branch, error: createBranchError } = await supabase
        .from('branches' as any)
        .insert([
          { 
            id: '00000000-0000-0000-0000-000000000001',
            name: 'Main Branch', 
            location: 'Nairobi, Kenya',
            phone: '+254700123456',
            email: 'main@jefftricks.com'
          }
        ])
        .select()
        .single();
        
      if (createBranchError && createBranchError.code !== '23505') { // Ignore duplicate key errors
        console.error('Error creating default branch:', createBranchError);
        return;
      }
      
      console.log('Default branch created or already exists');
      
      // Create default users for testing
      const { error: usersError } = await supabase
        .from('users' as any)
        .insert([
          {
            id: '00000000-0000-0000-0000-000000000011',
            name: 'Jeff Tricks',
            email: 'jeff@jefftricks.com',
            pin: '1234',
            role: 'admin',
            branch_id: '00000000-0000-0000-0000-000000000001',
            active: true
          },
          {
            id: '00000000-0000-0000-0000-000000000012',
            name: 'Jane Doe',
            email: 'jane@jefftricks.com',
            pin: '5678',
            role: 'manager',
            branch_id: '00000000-0000-0000-0000-000000000001',
            active: true
          },
          {
            id: '00000000-0000-0000-0000-000000000013',
            name: 'John Smith',
            email: 'john@jefftricks.com',
            pin: '9012',
            role: 'cashier',
            branch_id: '00000000-0000-0000-0000-000000000001',
            active: true
          }
        ]);
        
      if (usersError && usersError.code !== '23505') { // Ignore duplicate key errors
        console.error('Error creating default users:', usersError);
        return;
      }
      
      console.log('Default users created or already exist');
    }
  } catch (error) {
    console.log('Seeding completed with some expected errors (table types not yet synchronized)');
  }
};
