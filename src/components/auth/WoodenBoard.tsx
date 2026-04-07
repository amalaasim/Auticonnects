import React, { useEffect, useState } from 'react';
const signinBoard = '/assets/board.png';

interface WoodenBoardProps {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
}

const WoodenBoard: React.FC<WoodenBoardProps> = ({ children, className = '', animated = true }) => {
  const [boardLoaded, setBoardLoaded] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.onload = () => setBoardLoaded(true);
    image.onerror = () => setBoardLoaded(true);
    image.src = signinBoard;

    if (typeof image.decode === 'function') {
      image.decode().then(() => setBoardLoaded(true)).catch(() => {});
    }
  }, []);

  return (
    <div 
      className={`relative mx-auto aspect-[817/968] w-[min(92vw,32rem)] md:w-[min(76vw,38rem)] lg:w-[min(48vw,44rem)] xl:w-[min(42vw,46rem)] ${animated ? 'animate-bounce-in' : ''} ${className}`}
    >
      <img 
        src={signinBoard} 
        alt="Wooden sign board" 
        loading="eager"
        decoding="async"
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-200 ${boardLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className={`absolute bottom-[20%] left-[13.2%] right-[14.8%] top-[23%] flex min-h-0 flex-col justify-start px-[1%] pt-[2%] transition-opacity duration-150 ${boardLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </div>
    </div>
  );
};

export default WoodenBoard;
