import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthBackground from '@/components/auth/AuthBackground';
import WoodenBoard from '@/components/auth/WoodenBoard';
import BackSignpost from '@/components/auth/BackSignpost';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import { useToast } from '@/hooks/use-toast';
import HangingBoard from '@/components/auth/HangingBoard';
const logo = '/assets/logo.png';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, signOut } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && email && username) {
      setStep(2);
    }
  };

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

    const { error } = await signUp(email, password, username);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error.message,
      });
    } else {
      await signOut();
      toast({
        title: 'Account Created!',
        description: 'An email verification has been sent to your email address.',
      });
      setEmailSent(true);
    }

    setLoading(false);
  };

  return (
    <AuthBackground
      className="justify-start px-4 pb-6 pt-24 md:px-6 md:pt-28 lg:justify-end lg:px-0 lg:pb-0 lg:pt-0"
      assetUrls={[logo, '/assets/board.png', '/assets/back.png', '/assets/hanging-board.png']}
    >
      <img 
        src={logo} 
        alt="Auti-Connects Logo" 
        loading="eager"
        decoding="async"
        className="absolute left-4 top-4 h-auto w-[clamp(7rem,16vw,16rem)]"
      />

      <BackSignpost to="/login" label="Back to Login" />
      
      {!emailSent && (
        <WoodenBoard className="mt-[3cqh]" scrollable={false} contentClassName="justify-start">
          <div className="pt-[2%]">
          <h2
            className="mx-auto mt-[0.5%] mb-[1.8cqh] w-[94%] font-['Chewy'] text-[3.4cqh] font-bold leading-tight"
            style={{
              color: '#824D1F',
              fontFamily: "'Chewy', cursive",
              fontStyle: 'normal',
              fontWeight: 400,
              mixBlendMode: 'multiply',
              textShadow: '0px -1px 4px #FFCB8F',
            }}
          >
            Sign Up
          </h2>
          
          {step === 1 ? (
            <form onSubmit={handleContinue} className="mx-auto flex w-[94%] flex-col gap-[1.5cqh]">
              <AuthInput
                type="email"
                label="Enter your email address"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <AuthInput
                type="text"
                label="Enter your username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              
              <AuthButton type="submit" className="mt-[2.2cqh]">
                Continue
              </AuthButton>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto flex w-[94%] flex-col gap-[1.5cqh]">
              <AuthInput
                type="password"
                label="Enter your password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              <AuthInput
                type="password"
                label="Confirm your password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              
              <AuthButton type="submit" loading={loading}>
                Create Account
              </AuthButton>
            </form>
          )}
          
          <p className="mt-[1.9cqh] w-full font-['Chewy'] text-center text-[1.6cqh] text-[#824D1F] leading-none">
            Already have an account?{' '}
            <Link to="/login" className="font-bold underline hover:opacity-80 text-[#824D1F]">
              Login
            </Link>
          </p>
          </div>
        </WoodenBoard>
      )}
      {emailSent && (
        <HangingBoard
          message="A verification email has been sent to your email address. Please check your inbox."
          messageClassName="translate-x-[4px] text-[#B9793E]"
        />
      )}

      <SocialLoginButtons />
    </AuthBackground>
  );
};

export default Signup;
