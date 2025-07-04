
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AdminOnlyAuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff } from 'lucide-react';
import { PINKeypad } from './PINKeypad';

export const AdminLoginScreen = () => {
  const [loginMode, setLoginMode] = useState<'email' | 'pin'>('pin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { signIn, loginWithPin, isLoading, createInitialAdmin } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
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

  const handlePinKeyPress = (key: string) => {
    if (key === 'clear') {
      setPin('');
      return;
    }
    
    if (key === 'enter') {
      handlePinLogin();
      return;
    }
    
    if (pin.length < 5) {
      setPin(prev => prev + key);
    }
  };

  const handlePinLogin = async () => {
    if (!pin) {
      setError('Please enter your PIN');
      return;
    }

    setError('');
    const { error } = await loginWithPin(pin);
    
    if (error) {
      setError('Invalid PIN. Please try again.');
      setPin('');
    }
  };

  const handleCreateInitialAdmin = async () => {
    setError('');
    const { error } = await createInitialAdmin();
    
    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-bright-green rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white font-bold text-3xl">JT</span>
          </div>
          
          {/* Headlines */}
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-lg">Sign in to Jeff Tricks POS System</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Login Mode Toggle */}
          <div className="flex mb-6 bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setLoginMode('pin')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMode === 'pin' 
                  ? 'bg-bright-green text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              PIN Login
            </button>
            <button
              onClick={() => setLoginMode('email')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMode === 'email' 
                  ? 'bg-bright-green text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Email Login
            </button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-900/50 border-red-500">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loginMode === 'pin' ? (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-white text-xl font-semibold mb-2">Enter PIN</h3>
                <p className="text-gray-400 text-sm mb-6">Demo PIN: 12345 (Admin)</p>
                
                {/* PIN Display */}
                <div className="flex justify-center space-x-2 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-full border-2 ${
                        i < pin.length ? 'bg-bright-green border-bright-green' : 'border-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <PINKeypad onKeyPress={handlePinKeyPress} disabled={isLoading} />
            </div>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="h-12 text-base bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-bright-green focus:ring-bright-green"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-12 text-base pr-12 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-bright-green focus:ring-bright-green"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link 
                  to="/forgot-password" 
                  className="text-bright-green hover:text-green-400 text-sm font-medium transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-semibold bg-bright-green hover:bg-green-600 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  'Log In'
                )}
              </Button>
            </form>
          )}

          {/* Initial Admin Setup */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm text-center mb-4">
              First time setup? Create an initial admin account:
            </p>
            <Button
              onClick={handleCreateInitialAdmin}
              variant="outline"
              disabled={isLoading}
              className="w-full h-10 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              {isLoading ? 'Creating...' : 'Create Initial Admin'}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">Jeff Tricks Supermarket, Nairobi</p>
          <p className="text-gray-500 text-xs mt-1">Hotline: +254700123456</p>
        </div>
      </div>
    </div>
  );
};
