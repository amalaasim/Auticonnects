import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthBackground from '@/components/auth/AuthBackground';
import BackSignpost from '@/components/auth/BackSignpost';
import HangingBoard from '@/components/auth/HangingBoard';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import { useToast } from '@/hooks/use-toast';
import layer1Board from '@/assests/layer1board.png';
import layer2Board from '@/assests/layer2board.png';
import blurLayerBoard from '@/assests/blurlayerboard.png';
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
    <AuthBackground className="justify-start px-4 pb-6 pt-24 md:px-6 md:pt-28 lg:justify-end lg:px-0 lg:pb-0 lg:pt-0">
      <img
        src={logo}
        alt="Auti-Connects Logo"
        className="absolute left-4 top-4 h-auto w-[clamp(7rem,16vw,16rem)]"
      />

      <BackSignpost to="/login" label="Back to Login" />
      
      {!sent && (
        <div className="relative mx-auto -mt-40 h-[min(70vh,38rem)] w-[min(92vw,38rem)] md:-mt-40 md:h-[min(72vh,40rem)] md:w-[min(72vw,34rem)] lg:-mt-48 lg:h-[min(78vh,44rem)] lg:w-[min(42vw,42rem)]">
          <img
            src={layer1Board}
            alt="Forgot password board base"
            className="absolute left-1/2 top-0 w-full -translate-x-1/2 object-contain"
          />
          <img
            src={layer2Board}
            alt="Forgot password board front"
            className="pointer-events-none absolute left-[49%] top-[42%] w-full -translate-x-1/2 object-contain"
          />
          <img
            src={blurLayerBoard}
            alt="Forgot password board panel"
            className="pointer-events-none absolute left-[49%] top-[49.5%] w-[71.5%] -translate-x-1/2 object-contain"
          />

          <div className="absolute left-[49%] top-[48%] w-[58%] -translate-x-1/2">
            <h2 className="mb-2 text-center font-['Chewy'] text-[clamp(1.2rem,1.9vw,2rem)] font-bold text-[#824D1F]">
              Forgot Password
            </h2>

            <p className="mb-3 text-center font-['Chewy'] text-[clamp(0.72rem,0.9vw,0.92rem)] text-[#824D1F]">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
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

            <p className="mt-2 text-center font-['Chewy'] text-[clamp(0.82rem,1vw,1rem)] text-[#824D1F]">
              Remember your password?{' '}
              <Link to="/login" className="font-bold underline hover:opacity-80 text-[#824D1F]">
                Login
              </Link>
            </p>
          </div>
        </div>
      )}

      {sent && (
        <HangingBoard
          message="A password reset link has been sent to your email. Please follow the instructions."
          messageClassName="translate-x-[4px] translate-y-10 text-[#B9793E] md:translate-y-16 lg:translate-y-24"
        />
      )}
    </AuthBackground>
  );
};

export default ForgotPassword;
