
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AdminOnlyAuthProvider, useAuth } from '@/components/auth/AdminOnlyAuthProvider';
import { AdminLoginScreen } from '@/components/auth/AdminLoginScreen';
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

  // If no user or no profile, show login screen
  if (!user || !profile) {
    return <AdminLoginScreen />;
  }

  // If user is authenticated and has profile, show the role-based POS system
  return <RoleBasedPOSLayout />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminOnlyAuthProvider>
        <Router>
          <div className="min-h-screen">
            <Routes>
              <Route path="/*" element={<AppContent />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AdminOnlyAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
