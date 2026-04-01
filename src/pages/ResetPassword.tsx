import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthBackground from '@/components/auth/AuthBackground';
import WoodenBoard from '@/components/auth/WoodenBoard';
import BackgroundMusic from '@/components/auth/BackgroundMusic';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import { useToast } from '@/hooks/use-toast';
const logo = '/assets/logo.png';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { updatePassword, session, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !session) {
      toast({
        variant: 'destructive',
        title: 'Session Expired',
        description: 'Please request a new password reset link.',
      });
      navigate('/login');
    }
  }, [session, authLoading, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Passwords do not match',
        description: 'Please make sure your passwords match.',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Password too short',
        description: 'Password must be at least 6 characters.',
      });
      return;
    }

    setLoading(true);

    const { error } = await updatePassword(password);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } else {
      toast({
        title: 'Password Updated!',
        description: 'Your password has been successfully reset.',
      });
      navigate('/login');
    }

    setLoading(false);
  };

  return (
    <AuthBackground>
      <BackgroundMusic />
      
      <img 
        src={logo} 
        alt="Auti-Connects Logo" 
        className="absolute top-4 left-4 w-64 h-auto"
      />
      
      <WoodenBoard>
        <h2 className="text-4xl font-bold mb-4 text-yellow-800">Reset Password</h2>
        
        <p className="text-md mb-4 text-center px-4 text-yellow-700">
          Enter your new password below.
        </p>
        
        <form onSubmit={handleSubmit} className="w-full space-y-1 px-4">
          <AuthInput
            type="password"
            label="Enter your new password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <AuthInput
            type="password"
            label="Confirm your new password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          
          <AuthButton type="submit" loading={loading}>
            Reset Password
          </AuthButton>
        </form>
      </WoodenBoard>
    </AuthBackground>
  );
};

export default ResetPassword;
