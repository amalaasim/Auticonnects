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
    <AuthBackground
      className="justify-start px-4 pb-6 pt-24 md:px-6 md:pt-28 lg:justify-end lg:px-0 lg:pb-0 lg:pt-0"
      assetUrls={[logo, '/assets/back.png', '/assets/hanging-board.png', layer1Board, layer2Board]}
    >
      <img
        src={logo}
        alt="Auti-Connects Logo"
        className="absolute left-4 top-4 h-auto w-[clamp(7rem,16vw,16rem)]"
      />

      <BackSignpost to="/login" label="Back to Login" />
      
      {!sent && (
        <>
          <div className="absolute left-[50%] -translate-x-1/2 top-0 h-[70%] aspect-[794/536.26]">
            <img
              src={layer1Board}
              alt="Forgot password board base"
              className="absolute inset-0 h-full w-full object-contain"
            />
            
            {/* We size a div to exact Layer 2 boundaries, so everything inside is relative to it! */}
            <div className="absolute left-[7%] top-[43%] h-[86%] w-[86%]">
              <img
                src={layer2Board}
                alt="Forgot password board front"
                className="pointer-events-none absolute inset-0 h-full w-full object-contain"
              />

              {/* Blur box positioned exactly relative to the front board, keeping colors clean */}
              <div className="absolute left-[12%] top-[16%] h-[52%] w-[76%]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-md"
                  style={{
                    background: 'rgba(186, 118, 43, 0.91)',
                    filter: 'blur(11.2px)',
                  }}
                />

                {/* Content starts exactly 2% down relative to the Blur box */}
                <div className="absolute inset-x-0 top-[2%] w-full">
                  <h2
              className="mx-auto mb-[1.8cqh] w-[84%] font-['Chewy'] text-[3.4cqh]"
              style={{
                color: '#824D1F',
                fontFamily: "'Chewy', cursive",
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '90%',
                mixBlendMode: 'multiply',
                textShadow: '0px -1px 4px #FFCB8F',
              }}
            >
              Forgot Password
            </h2>

            <p className="mx-auto mb-[1.8cqh] w-[84%] font-['Chewy'] text-[1.6cqh] leading-tight text-[#824D1F]">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="mx-auto flex w-[84%] flex-col gap-[1.5cqh]">
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

            <p className="mx-auto mt-[1.9cqh] w-[84%] font-['Chewy'] text-[1.6cqh] leading-none text-[#824D1F]">
              Remember your password?{' '}
              <Link to="/login" className="font-bold underline hover:opacity-80 text-[#824D1F]">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </>
      )}

      {sent && (
        <HangingBoard
          message="A password reset link has been sent to your email. Please follow the instructions."
          messageClassName="text-[#B9793E]"
        />
      )}
    </AuthBackground>
  );
};

export default ForgotPassword;
