
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AdminOnlyAuthProvider, useAuth } from '@/components/auth/AdminOnlyAuthProvider';
import { AdminLoginScreen } from '@/components/auth/AdminLoginScreen';
import { ForgotPasswordScreen } from '@/components/auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from '@/components/auth/ResetPasswordScreen';
import { RoleBasedPOSLayout } from '@/components/layout/RoleBasedPOSLayout';

const queryClient = new QueryClient();

function AppContent() {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<AdminLoginScreen />} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
      <Route path="/reset-password" element={<ResetPasswordScreen />} />
      <Route 
        path="/*" 
        element={
          // If no user or no profile, show login screen
          !user || !profile ? <AdminLoginScreen /> : <RoleBasedPOSLayout />
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminOnlyAuthProvider>
        <Router>
          <div className="min-h-screen">
            <AppContent />
            <Toaster />
          </div>
        </Router>
      </AdminOnlyAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
