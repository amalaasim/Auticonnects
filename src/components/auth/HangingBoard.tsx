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
      className={`relative -top-8 animate-swing md:-top-16 lg:-top-24 ${className}`}
    >
      <img 
        src={hangingBoard} 
        alt="Hanging wooden board" 
        className="h-auto max-h-[70vh] w-[min(88vw,30rem)] object-contain md:max-h-[74vh] md:w-[min(70vw,34rem)] lg:h-[80vh] lg:w-auto"
      />
      <div className={`absolute inset-x-[18%] top-[24%] bottom-[18%] flex items-center justify-center ${messageClassName}`}>
        <p className="font-['Chewy'] text-center text-[clamp(1rem,2vw,2rem)] font-semibold text-inherit">
          {message}
        </p>
      </div>
    </div>
  );
};

export default HangingBoard;
