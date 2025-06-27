
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AdminOnlyAuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff } from 'lucide-react';

export const AdminLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { signIn, isLoading, createInitialAdmin } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
    }
  };

  const handleCreateInitialAdmin = async () => {
    setError('');
    const { error } = await createInitialAdmin();
    
    if (error) {
      setError(error.message);
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleString('en-KE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Africa/Nairobi'
    }) + ' EAT';
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-KE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Africa/Nairobi'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">JT</span>
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">Jeff Tricks Supermarket</h1>
            <p className="text-gray-300 text-sm">Point of Sale System</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white font-mono text-lg">{getCurrentTime()}</div>
          <div className="text-gray-300 text-sm">{getCurrentDate()}</div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-white text-2xl font-bold mb-2">Administrator Login</h2>
            <p className="text-gray-300">Please sign in to access the POS system</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@jefftricks.com"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/forgot-password" 
              className="text-green-400 hover:text-green-300 transition-colors text-sm"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm text-center mb-4">
              First time setup? Create an initial admin account:
            </p>
            <Button
              onClick={handleCreateInitialAdmin}
              variant="outline"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Creating...' : 'Create Initial Admin'}
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 p-4 text-center border-t border-gray-700">
        <p className="text-gray-400">Jeff Tricks Supermarket, Nairobi | Hotline: +254700123456</p>
      </div>
    </div>
  );
};
