
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
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        
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
    
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔍 Checking for existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          if (mounted) {
            setUser(null);
            setSession(null);
            setProfile(null);
            setIsLoading(false);
          }
          return;
        }
        
        console.log('🔍 Initial session check:', session?.user?.id || 'No session');
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('👤 Found existing session, fetching profile...');
          const userProfile = await fetchProfile(session.user.id);
          if (mounted) {
            setProfile(userProfile);
          }
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        if (mounted) {
          setUser(null);
          setSession(null);
          setProfile(null);
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event !== 'SIGNED_OUT') {
          console.log('👤 User authenticated, fetching profile...');
          const userProfile = await fetchProfile(session.user.id);
          if (mounted) {
            setProfile(userProfile);
          }
        } else {
          console.log('👤 No user session, clearing profile...');
          if (mounted) {
            setProfile(null);
          }
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      }
    );

    // Initialize auth immediately
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting sign in for:', email);
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Sign in error:', error);
        toast.error(`Sign in failed: ${error.message}`);
        setIsLoading(false);
      } else {
        console.log('✅ Sign in successful');
        toast.success('Signed in successfully');
        // Loading state will be handled by auth state change
      }
      
      return { error };
    } catch (error: any) {
      console.error('❌ Unexpected sign in error:', error);
      toast.error('An unexpected error occurred during sign in');
      setIsLoading(false);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Signed out successfully');
      }
    } catch (error) {
      toast.error('Error signing out');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPin = (pin: string) => {
    return profile?.pin === pin;
  };

  const createInitialAdmin = async () => {
    try {
      console.log('🔧 Creating initial admin user...');
      setIsLoading(true);
      
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
        setIsLoading(false);
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
          setIsLoading(false);
          return { error: profileError };
        }

        console.log('✅ Admin user created successfully');
        toast.success('Initial admin user created successfully! You can now log in with admin@jefftricks.com');
        setIsLoading(false);
        return { error: null };
      }

      const error = new Error('Failed to create user - no user data returned');
      console.error(error);
      toast.error('Failed to create admin user');
      setIsLoading(false);
      return { error };
    } catch (error: any) {
      console.error('❌ Unexpected error creating admin:', error);
      toast.error(`An unexpected error occurred: ${error.message}`);
      setIsLoading(false);
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
