import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthBackground from '@/components/auth/AuthBackground';
import WoodenBoard from '@/components/auth/WoodenBoard';
import BackSignpost from '@/components/auth/BackSignpost';
import HangingBoard from '@/components/auth/HangingBoard';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import { useToast } from '@/hooks/use-toast';
const logo = '/assets/logo.png';

const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } else {
      setSent(true);
      toast({
        title: 'Email Sent!',
        description: 'Check your inbox for password reset instructions.',
      });
    }

    setLoading(false);
  };

  return (
    <AuthBackground>
      <img
        src={logo}
        alt="Auti-Connects Logo"
        className="absolute top-4 left-4 w-64 h-auto"
      />

      <BackSignpost to="/login" label="Back to Login" />
      
      {!sent && (
        <WoodenBoard>
          <h2 className="text-4xl font-bold mb-4 text-yellow-800">Forgot Password</h2>
          
          <p className="text-md mb-4 text-center px-4 text-yellow-700">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          <form onSubmit={handleSubmit} className="w-full space-y-1 px-4">
            <AuthInput
              type="email"
              label="Enter your email address"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <AuthButton type="submit" loading={loading}>
              Send Reset Link
            </AuthButton>
          </form>
          
          <p className="w-full mt-3 text-md text-center text-yellow-800">
            Remember your password?{' '}
            <Link to="/login" className="font-bold underline hover:opacity-80 text-yellow-800">
              Login
            </Link>
          </p>
        </WoodenBoard>
      )}

      {sent && (
        <HangingBoard
          message="A password reset link has been sent to your email. Please follow the instructions."
          messageClassName="translate-x-[45px]"
        />
      )}
    </AuthBackground>
  );
};

export default ForgotPassword;
