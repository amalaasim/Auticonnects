import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthBackground from '@/components/auth/AuthBackground';
import WoodenBoard from '@/components/auth/WoodenBoard';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import { useToast } from '@/hooks/use-toast';
import eyeIcon from '@/assests/eye.png';
const logo = '/assets/logo.png';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message,
      });
    } else {
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      navigate('/');
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
      
      <WoodenBoard className="mt-8 lg:mt-24">
        <h2 className="mx-auto mb-2 w-[94%] font-['Chewy'] text-[clamp(1.25rem,1.9vw,2.15rem)] font-bold text-[#824D1F]">Log In</h2>
        
        <form onSubmit={handleSubmit} className="mx-auto flex w-[94%] flex-col gap-1.5 md:gap-2">
          <AuthInput
            type="email"
            label="Enter your email address"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <AuthInput
            type="password"
            label="Enter your password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            toggleIconSrc={eyeIcon}
            required
          />
          
          <div className="text-right">
            <Link 
              to="/forgot-password" 
              className="font-['Chewy'] text-[clamp(0.75rem,0.9vw,0.9rem)] text-[#824D1F] hover:opacity-80"
            >
              Forgot Password?
            </Link>
          </div>
          
          <AuthButton type="submit" loading={loading}>
            Login
          </AuthButton>
        </form>
        
        <p className="mt-1.5 w-full font-['Chewy'] text-center text-[clamp(0.75rem,0.9vw,0.9rem)] text-[#824D1F]">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold underline hover:opacity-80 text-[#824D1F]">
            Register
          </Link>
        </p>
      </WoodenBoard>

      <SocialLoginButtons />
    </AuthBackground>
  );
};

export default Login;
