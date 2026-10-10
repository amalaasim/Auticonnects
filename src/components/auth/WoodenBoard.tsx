import React, { useEffect, useState } from 'react';
const signinBoard = '/assets/board.png';

interface WoodenBoardProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  scrollable?: boolean;
}

const WoodenBoard: React.FC<WoodenBoardProps> = ({
  children,
  className = '',
  contentClassName = '',
  scrollable = false,
}) => {
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
      className={`fixed bottom-[2.9vh] left-1/2 -translate-x-1/2 aspect-[817/968] h-[min(92vh,100.7vw)] w-auto object-contain [container-type:size] mland:bottom-auto mland:top-[-6dvh] mland:h-[132dvh] mport:bottom-[4dvh] mport:h-[min(122vw,78dvh)] ${className}`}
    >
      <div className="relative h-full w-full">
        <img 
          src={signinBoard} 
          alt="Wooden sign board" 
          loading="eager"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-200 ${boardLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <div
          className={`absolute left-[12%] right-[12%] top-[21%] bottom-[35%] flex min-h-0 flex-col @container justify-start px-[3%] py-[2%] transition-opacity duration-150 ${scrollable ? 'overflow-y-auto' : 'overflow-y-hidden mland:overflow-y-auto'} ${boardLoaded ? 'opacity-100' : 'opacity-0'} ${contentClassName}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default WoodenBoard;
