
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from './AdminOnlyAuthProvider';
import { toast } from 'sonner';

export const AdminLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const { signIn, createInitialAdmin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with:', { email });
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        console.error('Login error:', error);
        toast.error('Invalid credentials. Please try again.');
      } else {
        console.log('Login successful');
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast.error('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateInitialAdmin = async () => {
    console.log('Creating initial admin...');
    setIsCreatingAdmin(true);
    try {
      const { error } = await createInitialAdmin();
      if (!error) {
        // Pre-fill the form with admin credentials for convenience
        setEmail('admin@jefftricks.com');
        setPassword('Admin123!');
      }
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="modern-card p-8 animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-modern-lg">
              <span className="text-white font-bold text-3xl">JT</span>
            </div>
            <h1 className="text-3xl font-bold text-text-gray mb-2">Welcome Back</h1>
            <p className="text-gray-600 font-medium">Sign in to Jeff Tricks POS System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-text-gray font-semibold">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="touch-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-text-gray font-semibold">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="touch-input"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full touch-button text-lg font-semibold"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            <Button
              onClick={handleCreateInitialAdmin}
              disabled={isCreatingAdmin}
              variant="outline"
              className="w-full mt-4 touch-button text-lg font-semibold"
              size="lg"
            >
              {isCreatingAdmin ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Admin...</span>
                </div>
              ) : (
                'Create Initial Admin User'
              )}
            </Button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-800 font-medium text-center">
              🔒 Secure Access Only
            </p>
            <p className="text-xs text-blue-600 text-center mt-1">
              Default credentials: admin@jefftricks.com / Admin123!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
