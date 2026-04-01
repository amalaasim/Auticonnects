import React from 'react';
const signinBoard = '/assets/board.png';

interface WoodenBoardProps {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
}

const WoodenBoard: React.FC<WoodenBoardProps> = ({ children, className = '', animated = true }) => {
  return (
    <div 
      className={`relative ${animated ? 'animate-bounce-in' : ''} ${className}`}
    >
      <img 
        src={signinBoard} 
        alt="Wooden sign board" 
        className="h-screen"
      />
      <div className="absolute inset-0 -top-32 left-20 w-[calc(100%-12rem)] flex flex-col items-start justify-center p-6">
        {children}
      </div>
    </div>
  );
};

export default WoodenBoard;
