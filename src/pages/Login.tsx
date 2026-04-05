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
    <AuthBackground>
      <img 
        src={logo} 
        alt="Auti-Connects Logo" 
        className="absolute top-4 left-4 w-64 h-auto"
      />

      <BackSignpost to="/" label="Back to Home" />
      
      <WoodenBoard>
        <h2 className="text-4xl font-bold mt-6 ml-6 mb-4 text-yellow-800">Log In</h2>
        
        <form onSubmit={handleSubmit} className="w-full space-y-1 px-4">
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
            required
          />
          
          <div className="text-right">
            <Link 
              to="/forgot-password" 
              className="text-md hover:opacity-80 text-yellow-700"
            >
              Forgot Password?
            </Link>
          </div>
          
          <AuthButton type="submit" loading={loading}>
            Login
          </AuthButton>
        </form>
        
        <p className="w-full mt-3 text-md text-center text-yellow-800">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold underline hover:opacity-80">
            Register
          </Link>
        </p>
      </WoodenBoard>

      <SocialLoginButtons />
    </AuthBackground>
  );
};

export default Login;
