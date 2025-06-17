
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from './AdminOnlyAuthProvider';
import { PINKeypad } from './PINKeypad';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export const AdminLoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const { signIn, verifyPin, profile } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(loginData.email, loginData.password);
    
    if (!error) {
      // If sign in successful and user has PIN, show PIN verification
      setShowPin(true);
    }
    
    setIsLoading(false);
  };

  const handlePinEntry = (digit: string) => {
    if (digit === 'clear') {
      setPin('');
      return;
    }
    
    if (digit === 'enter') {
      if (verifyPin(pin)) {
        // PIN verified, user will be redirected by the auth state change
        return;
      } else {
        setPin('');
      }
      return;
    }
    
    if (pin.length < 4) {
      setPin(prev => prev + digit);
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

  if (showPin && profile) {
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

        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="w-96 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-center">Enter PIN</CardTitle>
              <p className="text-gray-300 text-center">Welcome, {profile.name}</p>
              <p className="text-gray-400 text-center text-sm">
                Role: {profile.role}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center space-x-2 mb-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full border-2 ${
                      i < pin.length ? 'bg-green-500 border-green-500' : 'border-gray-600'
                    }`}
                  />
                ))}
              </div>

              <PINKeypad onKeyPress={handlePinEntry} />
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowPin(false)}
              >
                Back to Login
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 p-4 text-center border-t border-gray-700">
          <p className="text-gray-400">Jeff Tricks Supermarket, Nairobi | Hotline: +254700123456</p>
        </div>
      </div>
    );
  }

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

      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-center">Secure Access</CardTitle>
            <p className="text-gray-300 text-center text-sm">
              Sign in with your administrator-assigned credentials
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-8 bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-8 pr-8 bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-2 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 p-4 text-center border-t border-gray-700">
        <p className="text-gray-400">Jeff Tricks Supermarket, Nairobi | Hotline: +254700123456</p>
      </div>
    </div>
  );
};
