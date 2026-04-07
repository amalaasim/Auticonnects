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
      className={`relative mx-auto aspect-[817/968] w-[min(92vw,32rem)] md:w-[min(76vw,38rem)] lg:w-[min(48vw,44rem)] xl:w-[min(42vw,46rem)] ${animated ? 'animate-bounce-in' : ''} ${className}`}
    >
      <img 
        src={signinBoard} 
        alt="Wooden sign board" 
        className="absolute inset-0 h-full w-full object-contain"
      />
      <div className="absolute bottom-[20%] left-[13.2%] right-[14.8%] top-[23%] flex min-h-0 flex-col justify-start px-[1%] pt-[2%]">
        {children}
      </div>
    </div>
  );
};

export default WoodenBoard;
