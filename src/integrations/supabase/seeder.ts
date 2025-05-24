
import { supabase } from './client';

export const seedInitialData = async () => {
  console.log('Checking if initial seed data is needed...');
  
  try {
    // For now, just check if we can connect to Supabase
    // Since the database schema only has a users table currently,
    // we'll skip seeding until the proper tables are created
    
    const { data: users, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
      
    if (error) {
      console.log('Database tables not yet created, skipping seed data');
      return;
    }
    
    console.log('Database connection successful, seed data will be added when tables are created');
    
  } catch (error) {
    console.log('Seeding skipped - database tables not yet created');
  }
};
