
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
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(async () => {
            const userProfile = await fetchProfile(session.user.id);
            setProfile(userProfile);
            setIsLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id).then(userProfile => {
          setProfile(userProfile);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
      }
      
      return { error };
    } catch (error: any) {
      toast.error('An unexpected error occurred');
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
      canAccess
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
