
import { LoginScreen } from '@/components/auth/LoginScreen';
import { POSLayout } from '@/components/layout/POSLayout';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <POSLayout user={user} />;
};

export default Index;
