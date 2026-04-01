import React from 'react';
const hangingBoard = '/assets/hanging-board.png';

interface HangingBoardProps {
  message: string;
  className?: string;
}

const HangingBoard: React.FC<HangingBoardProps> = ({ message, className = '' }) => {
  return (
    <div 
      className={`relative -top-24 animate-swing ${className}`}
    >
      <img 
        src={hangingBoard} 
        alt="Hanging wooden board" 
        className="h-[80vh]"
      />
      <div className="absolute left-20 top-72 w-[30vw] inset-0 flex flex-col items-center justify-center">
        <p className="text-4xl text-center text-amber-700 font-semibold">
          {message}
        </p>
      </div>
    </div>
  );
};

export default HangingBoard;
