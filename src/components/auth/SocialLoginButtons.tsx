import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const SocialLoginButtons: React.FC = () => {
  const { signInWithGoogle, signInWithFacebook } = useAuth();

  const handleGoogleLogin = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      console.error('Google login error:', error.message);
    }
  };

  const handleFacebookLogin = async () => {
    const { error } = await signInWithFacebook();
    if (error) {
      console.error('Facebook login error:', error.message);
    }
  };

  return (
    <div className="mt-4 w-full max-w-[22rem] px-2 md:mt-5 lg:absolute lg:bottom-[4%] lg:right-[1%] lg:mt-0 lg:px-4">
      <div 
        className="flex items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 shadow-lg md:px-5 md:py-4"
        style={{ 
          backgroundColor: '#6B8E3D',
          backgroundImage: 'linear-gradient(to bottom, rgba(107, 142, 61, 0.9), rgba(85, 112, 48, 1))',
          borderColor: '#556930'
        }}
      >
        <span className="flex shrink-0 translate-x-2 items-center gap-2 whitespace-nowrap text-base font-medium text-black/60 md:text-xl lg:translate-x-2">
          Continue with <span className="text-xl">&gt;</span>
        </span>
        
        <div className="flex translate-x-2 items-center gap-3 shrink-0 lg:translate-x-2">
          <button
            onClick={handleGoogleLogin}
            className="bg-white rounded-full p-2.5 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#6B8E3D] border border-white"
            aria-label="Sign in with Google"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 md:h-6 md:w-6">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </button>
          <button
            onClick={handleFacebookLogin}
            className="bg-[#1877F2] rounded-full p-2.5 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#6B8E3D] border border-white"
            aria-label="Sign in with Facebook"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white md:h-6 md:w-6">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialLoginButtons;
