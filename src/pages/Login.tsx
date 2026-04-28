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
        className="absolute left-4 top-4 h-auto w-[clamp(7rem,16vw,16rem)]"
      />
      
      <WoodenBoard scrollable={false} contentClassName="justify-start">
        <h2
          className="mx-auto mt-[1.8%] mb-[1%] w-[94%] font-['Chewy'] text-[3.4cqh] font-bold leading-tight"
          style={{
            color: '#824D1F',
            fontFamily: "'Chewy', cursive",
            fontStyle: 'normal',
            fontWeight: 400,
            mixBlendMode: 'multiply',
            textShadow: '0px -1px 4px #FFCB8F',
          }}
        >
          Log In
        </h2>
        
        <form onSubmit={handleSubmit} className="mx-auto mt-[0.8cqh] flex w-[94%] flex-col gap-[1.4cqh]">
          <div className="mt-[0.7cqh] flex flex-col gap-[1.4cqh]">
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
            
            <div className="-mt-[0.8cqh] text-right">
              <Link 
                to="/forgot-password" 
                className="inline-flex items-center font-['Chewy'] text-[1.6cqh] leading-[125%] hover:opacity-80"
                style={{
                  fontFamily: "'Chewy', cursive",
                  fontStyle: 'normal',
                  fontWeight: 400,
                  color: '#904712',
                }}
              >
                Forgot Password?
              </Link>
            </div>
          </div>
          
          <AuthButton type="submit" loading={loading} className="mt-[1.2cqh]">
            Log In
          </AuthButton>
        </form>
        
        <p className="mt-[1.1cqh] flex w-full items-center justify-center gap-[0.67cqh] font-['Chewy'] text-[1.6cqh] text-[#824D1F] leading-none">
          <span>Don't have an account?</span>
          <Link
            to="/signup"
            className="inline-flex items-center underline hover:opacity-80"
            style={{
              fontFamily: "'Chewy', cursive",
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '136%',
              color: '#8B4720',
              textDecorationLine: 'underline',
            }}
          >
            Register
          </Link>
        </p>
      </WoodenBoard>

      <SocialLoginButtons />
    </AuthBackground>
  );
};

export default Login;
