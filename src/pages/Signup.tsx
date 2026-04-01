import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthBackground from '@/components/auth/AuthBackground';
import WoodenBoard from '@/components/auth/WoodenBoard';
import BackSignpost from '@/components/auth/BackSignpost';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import BackgroundMusic from '@/components/auth/BackgroundMusic';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import { useToast } from '@/hooks/use-toast';
import HangingBoard from '@/components/auth/HangingBoard';
const logo = '/assets/logo.png';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
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
      toast({
        title: 'Account Created!',
        description: 'An email verification has been sent to your email address.',
      });
    }

    setLoading(false);
    setEmailSent(true);
  };

  return (
    <AuthBackground>
      <BackgroundMusic />
      
      <img 
        src={logo} 
        alt="Auti-Connects Logo" 
        className="absolute top-4 left-4 w-64 h-auto"
      />

      <BackSignpost to="/login" label="Back to Login" />
      
      {!emailSent && (
        <WoodenBoard>
          <h2 className="text-4xl font-bold mb-4 text-yellow-800">Sign Up</h2>
          
          {step === 1 ? (
            <form onSubmit={handleContinue} className="w-full space-y-1 px-4">
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
            <form onSubmit={handleSubmit} className="w-full space-y-1 px-4">
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
              
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-md underline hover:opacity-80 text-yellow-700"
              >
                ← Back
              </button>
            </form>
          )}
          
          <div className="flex gap-2 mt-3">
            <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-yellow-700' : 'bg-yellow-200'}`} />
            <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-yellow-700' : 'bg-yellow-200'}`} />
          </div>
          
          <p className="w-full mt-3 text-md text-center text-yellow-800">
            Already have an account?{' '}
            <Link to="/login" className="font-bold underline hover:opacity-80">
              Login
            </Link>
          </p>
        </WoodenBoard>
      )}
      {emailSent && (
        <HangingBoard
          message="A verification email has been sent to your email address. Please check your inbox."
        />
      )}

      <SocialLoginButtons />
    </AuthBackground>
  );
};

export default Signup;
