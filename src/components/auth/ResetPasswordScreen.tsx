
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export const ResetPasswordScreen = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have the required tokens in the URL
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    if (!accessToken || !refreshToken) {
      setError('Invalid or expired reset link. Please request a new password reset.');
      return;
    }

    // Set the session with the tokens from the URL
    const setSession = async () => {
      try {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        
        if (error) {
          setError('Invalid or expired reset link. Please request a new password reset.');
        }
      } catch (error) {
        setError('Failed to validate reset link. Please try again.');
      }
    };

    setSession();
  }, [searchParams]);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(pwd)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      return 'Password must contain at least one special character';
    }
    return null;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
        toast.error(`Failed to reset password: ${error.message}`);
      } else {
        setIsSuccess(true);
        toast.success('Password reset successfully!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error: any) {
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
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

  if (isSuccess) {
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

        {/* Success Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-white text-2xl font-bold mb-4">Password Reset Successful!</h2>
            <p className="text-gray-300 mb-6">
              Your password has been successfully reset. You will be redirected to the login page in a few seconds.
            </p>
            <Button
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Go to Login
            </Button>
          </div>
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

      {/* Reset Password Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-white text-2xl font-bold mb-2">Reset Your Password</h2>
            <p className="text-gray-300">
              Please enter your new password below.
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
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
              <p className="text-gray-400 text-xs">
                Password must be at least 8 characters with uppercase, lowercase, number, and special character.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 p-4 text-center border-t border-gray-700">
        <p className="text-gray-400">Jeff Tricks Supermarket, Nairobi | Hotline: +254700123456</p>
      </div>
    </div>
  );
};
