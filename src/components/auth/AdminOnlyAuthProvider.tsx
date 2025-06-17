import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  name: string;
  role: 'Admin' | 'Manager' | 'Cashier' | 'Accountant' | 'Stock Controller' | 'Guest';
  branch_id: string | null;
  pin: string | null;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  verifyPin: (pin: string) => boolean;
  createUser: (userData: {
    email: string;
    password: string;
    name: string;
    role: UserProfile['role'];
    branch_id?: string;
    pin?: string;
  }) => Promise<{ error: any }>;
  canAccess: (module: string) => boolean;
  createInitialAdmin: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Role-based access control configuration
const rolePermissions = {
  'Admin': ['sales', 'inventory', 'purchases', 'reports', 'customers', 'cash', 'admin', 'settings'],
  'Manager': ['sales', 'inventory', 'purchases', 'reports', 'customers', 'cash', 'settings'],
  'Cashier': ['sales', 'customers'],
  'Accountant': ['reports', 'cash'],
  'Stock Controller': ['inventory', 'purchases'],
  'Guest': ['sales']
};

export const AdminOnlyAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔍 Fetching profile for user:', userId);
      console.log('🔍 Current session:', session);
      
      // Check if we can access the profiles table
      const { data: testData, error: testError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      console.log('🔍 Profiles table test query result:', { testData, testError });
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        console.log('❌ Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          console.log('📝 Profile not found, creating one...');
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{
              id: userId,
              name: 'System Administrator',
              role: 'Admin',
              branch_id: null,
              pin: '1234',
              is_active: true
            }])
            .select()
            .single();
            
          if (createError) {
            console.error('❌ Error creating profile:', createError);
            toast.error('Failed to create user profile');
            return null;
          }
          
          console.log('✅ Profile created successfully:', newProfile);
          return newProfile as UserProfile;
        }
        
        toast.error('Failed to load user profile');
        return null;
      }

      console.log('✅ Profile fetched successfully:', data);
      return data as UserProfile;
    } catch (error) {
      console.error('❌ Error in fetchProfile:', error);
      toast.error('An error occurred while loading profile');
      return null;
    }
  };

  useEffect(() => {
    console.log('🚀 Setting up auth listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.id);
        console.log('🔄 Full session object:', session);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('👤 User authenticated, fetching profile...');
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile);
          setIsLoading(false);
        } else {
          console.log('👤 No user session, clearing profile...');
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 Initial session check:', session?.user?.id);
      console.log('🔍 Initial session object:', session);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('👤 Found existing session, fetching profile...');
        fetchProfile(session.user.id).then(userProfile => {
          setProfile(userProfile);
          setIsLoading(false);
        });
      } else {
        console.log('👤 No existing session found');
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting sign in for:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Sign in error:', error);
        toast.error(`Sign in failed: ${error.message}`);
      } else {
        console.log('✅ Sign in successful');
        toast.success('Signed in successfully');
      }
      
      return { error };
    } catch (error: any) {
      console.error('❌ Unexpected sign in error:', error);
      toast.error('An unexpected error occurred during sign in');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Signed out successfully');
      }
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const verifyPin = (pin: string) => {
    return profile?.pin === pin;
  };

  const createInitialAdmin = async () => {
    try {
      console.log('🔧 Creating initial admin user...');
      
      // Create the admin user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'admin@jefftricks.com',
        password: 'Admin123!',
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (authError) {
        console.error('❌ Auth error:', authError);
        if (authError.message.includes('already registered')) {
          toast.error('Admin user already exists. Try logging in instead.');
        } else {
          toast.error(`Failed to create admin user: ${authError.message}`);
        }
        return { error: authError };
      }

      if (authData.user) {
        console.log('✅ Auth user created, creating profile...');
        
        // Create the profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: authData.user.id,
            name: 'System Administrator',
            role: 'Admin',
            branch_id: null,
            pin: '1234',
            is_active: true
          }]);

        if (profileError) {
          console.error('❌ Profile error:', profileError);
          toast.error(`Failed to create admin profile: ${profileError.message}`);
          return { error: profileError };
        }

        console.log('✅ Admin user created successfully');
        toast.success('Initial admin user created successfully! You can now log in with admin@jefftricks.com');
        return { error: null };
      }

      const error = new Error('Failed to create user - no user data returned');
      console.error(error);
      toast.error('Failed to create admin user');
      return { error };
    } catch (error: any) {
      console.error('❌ Unexpected error creating admin:', error);
      toast.error(`An unexpected error occurred: ${error.message}`);
      return { error };
    }
  };

  const createUser = async (userData: {
    email: string;
    password: string;
    name: string;
    role: UserProfile['role'];
    branch_id?: string;
    pin?: string;
  }) => {
    try {
      // Only admins can create users
      if (profile?.role !== 'Admin') {
        const error = new Error('Only administrators can create users');
        toast.error(error.message);
        return { error };
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true
      });

      if (authError) {
        toast.error(authError.message);
        return { error: authError };
      }

      // Create profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: authData.user.id,
            name: userData.name,
            role: userData.role,
            branch_id: userData.branch_id || null,
            pin: userData.pin || null,
            is_active: true
          }]);

        if (profileError) {
          // Clean up auth user if profile creation fails
          await supabase.auth.admin.deleteUser(authData.user.id);
          toast.error('Failed to create user profile');
          return { error: profileError };
        }

        toast.success('User created successfully');
        return { error: null };
      }

      return { error: new Error('Failed to create user') };
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      return { error };
    }
  };

  const canAccess = (module: string): boolean => {
    if (!profile) return false;
    return rolePermissions[profile.role]?.includes(module) || false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      isLoading,
      signIn,
      signOut,
      verifyPin,
      createUser,
      canAccess,
      createInitialAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AdminOnlyAuthProvider');
  }
  return context;
};
