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
      className={`min-h-screen w-full bg-cover bg-center bg-no-repeat relative flex items-center justify-center ${className}`}
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    >
      {children}
    </div>
  );
};

export default AuthBackground;
