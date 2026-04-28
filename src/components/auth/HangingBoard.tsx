import React from 'react';
const hangingBoard = '/assets/hanging-board.png';

interface HangingBoardProps {
  message: string;
  className?: string;
  messageClassName?: string;
}

const HangingBoard: React.FC<HangingBoardProps> = ({ message, className = '', messageClassName = '' }) => {
  return (
    <div 
      className={`absolute left-1/2 -translate-x-1/2 ${className}`}
      style={{ top: '-3%' }}
    >
      {/* Wrapper natively shrinks to fit the image perfectly */}
      <div className="relative animate-swing inline-block">
        <img 
          src={hangingBoard} 
          alt="Hanging wooden board" 
          className="block h-[80vh] w-auto max-w-none"
        />
	        <div className="absolute inset-0">
	          <div
	            className={`absolute left-[19%] top-[60%] h-[18%] w-[62%] [container-type:size] ${messageClassName}`}
	          >
	            <p className="w-full font-['Chewy'] text-center text-[22cqh] font-semibold leading-tight text-inherit">
	              {message}
	            </p>
	          </div>
	        </div>
	      </div>
	    </div>
	  );
};

export default HangingBoard;
