
import { supabase } from './client';

export const seedInitialData = async () => {
  console.log('Checking if initial seed data is needed...');
  
  // Check if we have at least one branch
  const { data: branches, error: branchError } = await supabase
    .from('branches')
    .select('id')
    .limit(1);
    
  if (branchError) {
    console.error('Error checking branches:', branchError);
    return;
  }
  
  if (branches && branches.length === 0) {
    console.log('No branches found, creating initial data...');
    
    // Create a default branch
    const { data: branch, error: createBranchError } = await supabase
      .from('branches')
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
      
    if (createBranchError) {
      console.error('Error creating default branch:', createBranchError);
      return;
    }
    
    console.log('Default branch created:', branch);
    
    // Create default users for testing
    const { error: usersError } = await supabase
      .from('users')
      .insert([
        {
          id: '00000000-0000-0000-0000-000000000011',
          name: 'Jeff Tricks',
          email: 'jeff@jefftricks.com',
          pin: '1234',
          role: 'admin',
          branch_id: branch.id,
          active: true
        },
        {
          id: '00000000-0000-0000-0000-000000000012',
          name: 'Jane Doe',
          email: 'jane@jefftricks.com',
          pin: '5678',
          role: 'manager',
          branch_id: branch.id,
          active: true
        },
        {
          id: '00000000-0000-0000-0000-000000000013',
          name: 'John Smith',
          email: 'john@jefftricks.com',
          pin: '9012',
          role: 'cashier',
          branch_id: branch.id,
          active: true
        }
      ]);
      
    if (usersError) {
      console.error('Error creating default users:', usersError);
      return;
    }
    
    console.log('Default users created');
  } else {
    console.log('Initial data already exists, skipping seeding');
  }
};
