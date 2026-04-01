import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AuthBackground from '@/components/auth/AuthBackground';
import WoodenBoard from '@/components/auth/WoodenBoard';

const EmailVerified: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: 'Email Verified Successfully!',
      description: 'Your email has been verified. You can now log in to your account.',
    });

    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, toast]);

  return (
    <AuthBackground>
      <WoodenBoard>
        <div className="text-center py-8">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-yellow-800">
            Email Verified!
          </h2>
          <p className="mb-2 text-yellow-700 text-md">
            Your email has been successfully verified.
          </p>
          <p className="text-md text-yellow-700">
            Redirecting you to login...
          </p>
        </div>
      </WoodenBoard>
    </AuthBackground>
  );
};

export default EmailVerified;
