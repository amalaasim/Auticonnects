import React from 'react';

interface AuthBackgroundProps {
  children: React.ReactNode;
  backgroundUrl?: string;
  className?: string;
}

const AuthBackground: React.FC<AuthBackgroundProps> = ({
  children,
  backgroundUrl = '/assets/mascot.png',
  className = '',
}) => {
  return (
    <div 
      className={`relative flex min-h-screen w-full flex-col items-center justify-start overflow-x-hidden bg-cover bg-center bg-no-repeat px-4 pb-8 pt-20 sm:px-6 sm:pt-24 lg:justify-center lg:px-8 lg:pb-10 ${className}`}
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    >
      {children}
    </div>
  );
};

export default AuthBackground;
