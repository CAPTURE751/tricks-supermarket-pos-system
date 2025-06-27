
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Mail } from 'lucide-react';
import { toast } from 'sonner';

export const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        setError(error.message);
        toast.error(`Failed to send reset email: ${error.message}`);
      } else {
        setIsEmailSent(true);
        toast.success('Password reset email sent successfully!');
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

  if (isEmailSent) {
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
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-white text-2xl font-bold mb-4">Check Your Email</h2>
            <p className="text-gray-300 mb-6">
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your email and click the link to reset your password.
            </p>
            <p className="text-gray-400 text-sm mb-6">
              The link will expire in 1 hour for security reasons.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => setIsEmailSent(false)}
                variant="outline"
                className="w-full"
              >
                Send Another Email
              </Button>
              <Link to="/login">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>
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

      {/* Forgot Password Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-white text-2xl font-bold mb-2">Forgot Password?</h2>
            <p className="text-gray-300">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-green-400 hover:text-green-300 transition-colors">
              <ArrowLeft className="w-4 h-4 inline mr-2" />
              Back to Login
            </Link>
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
