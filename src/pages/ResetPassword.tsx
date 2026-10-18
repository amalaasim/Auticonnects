import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthBackground from '@/components/auth/AuthBackground';
import WoodenBoard from '@/components/auth/WoodenBoard';
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
      const errorMessage = error.message.toLowerCase();

      if (
        errorMessage.includes('different from the old password') ||
        errorMessage.includes('same password') ||
        errorMessage.includes('same as the old password') ||
        errorMessage.includes('same as your current password')
      ) {
        toast({
          variant: 'destructive',
          title: 'Password Reuse Not Allowed',
          description: 'Your new password cannot be the same as your existing password.',
        });
        setLoading(false);
        return;
      }

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
    <AuthBackground
      backgroundUrl="/assets/mascot.png"
      className="justify-start px-4 pb-6 pt-24 md:px-6 md:pt-28 lg:justify-end lg:px-0 lg:pb-0 lg:pt-0"
      assetUrls={[logo, '/assets/board.png']}
    >
      <img
        src={logo}
        alt="Auti-Connects Logo"
        loading="eager"
        decoding="async"
        className="absolute left-4 top-4 h-auto w-[clamp(7rem,16vw,16rem)] mland:left-3 mland:top-3 mland:w-[clamp(5.5rem,14vw,12rem)]"
      />

      <WoodenBoard scrollable={false} contentClassName="justify-start">
        <h2
          className="mx-auto mt-[1.8%] mb-[1%] w-[94%] phone:mt-0 font-['Chewy'] text-[3.4cqh] font-bold leading-tight"
          style={{
            color: '#824D1F',
            fontFamily: "'Chewy', cursive",
            fontStyle: 'normal',
            fontWeight: 400,
            mixBlendMode: 'multiply',
            textShadow: '0px -1px 4px #FFCB8F',
          }}
        >
          Reset Password
        </h2>

        <p className="mx-auto mb-[1.2cqh] w-[94%] font-['Chewy'] text-[1.6cqh] leading-tight text-[#824D1F] phone:mb-[0.8cqh] phone:text-[2.2cqh]">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto flex w-[94%] flex-col gap-[1.4cqh] phone:gap-[1cqh]">
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

          <AuthButton type="submit" loading={loading} className="mt-[1.2cqh] phone:mt-[0.6cqh]">
            Reset Password
          </AuthButton>
        </form>
      </WoodenBoard>
    </AuthBackground>
  );
};

export default ResetPassword;
