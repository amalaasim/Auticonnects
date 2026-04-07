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
    <AuthBackground className="justify-start px-4 pb-6 pt-24 md:px-6 md:pt-28 lg:justify-end lg:px-0 lg:pb-0 lg:pt-0">
      <img 
        src={logo} 
        alt="Auti-Connects Logo" 
        className="absolute left-4 top-4 h-auto w-[clamp(7rem,16vw,16rem)]"
      />

      <BackSignpost to="/login" label="Back to Login" />
      
      {!emailSent && (
        <WoodenBoard className="mt-10 lg:mt-24">
          <div className="pt-[2%]">
          <h2 className="mx-auto mb-2 w-[94%] font-['Chewy'] text-[clamp(1.25rem,1.9vw,2.15rem)] font-bold text-[#824D1F]">Sign Up</h2>
          
          {step === 1 ? (
            <form onSubmit={handleContinue} className="mx-auto flex w-[94%] flex-col gap-2">
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
              
              <AuthButton type="submit">
                Continue
              </AuthButton>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto -mt-1 flex w-[94%] flex-col gap-2">
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
          
          <div className="mt-2 flex gap-2">
            <div className={`h-2 w-2 rounded-full ${step === 1 ? 'bg-[#824D1F]' : 'bg-[#E6C99A]'}`} />
            <div className={`h-2 w-2 rounded-full ${step === 2 ? 'bg-[#824D1F]' : 'bg-[#E6C99A]'}`} />
          </div>
          
          <p className="w-full -mt-1 font-['Chewy'] text-center text-[clamp(0.8rem,1vw,1rem)] text-[#824D1F]">
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
          messageClassName="translate-x-[4px] translate-y-10 text-[#B9793E] md:translate-y-16 lg:translate-y-24"
        />
      )}

      <SocialLoginButtons />
    </AuthBackground>
  );
};

export default Signup;
