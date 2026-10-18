import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import AuthBackground from '@/components/auth/AuthBackground';
import WoodenBoard from '@/components/auth/WoodenBoard';
const logo = '/assets/logo.png';

const EmailVerified: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth();

  useEffect(() => {
    let active = true;

    const finalizeVerification = async () => {
      await signOut();

      if (!active) return;

      toast({
        title: 'Email Verified Successfully!',
        description: 'Your email has been verified. You can now log in to your account.',
      });

      const timer = setTimeout(() => {
        navigate('/login');
      }, 2000);

      return () => clearTimeout(timer);
    };

    const cleanupPromise = finalizeVerification();

    return () => {
      active = false;
      cleanupPromise.then((cleanup) => cleanup?.());
    };
  }, [navigate, signOut, toast]);

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
        <div className="mx-auto flex w-[94%] flex-col items-center pt-[2.5cqh] text-center phone:pt-[1cqh]">
          <svg
            className="h-[9cqh] w-[9cqh] text-green-600 phone:h-[max(8cqh,36px)] phone:w-[max(8cqh,36px)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <h2
            className="mt-[2cqh] mb-[1.8cqh] font-['Chewy'] text-[3.4cqh] font-bold leading-tight phone:mt-[1cqh] phone:mb-[1cqh]"
            style={{
              color: '#824D1F',
              fontFamily: "'Chewy', cursive",
              fontStyle: 'normal',
              fontWeight: 400,
              mixBlendMode: 'multiply',
              textShadow: '0px -1px 4px #FFCB8F',
            }}
          >
            Email Verified!
          </h2>

          <p className="mb-[1cqh] font-['Chewy'] text-[1.6cqh] leading-tight text-[#824D1F] phone:text-[2.2cqh]">
            Your email has been successfully verified.
          </p>
          <p className="font-['Chewy'] text-[1.6cqh] leading-tight text-[#824D1F] phone:text-[2.2cqh]">
            Redirecting you to login...
          </p>
        </div>
      </WoodenBoard>
    </AuthBackground>
  );
};

export default EmailVerified;
