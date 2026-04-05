import React from 'react';

interface BottomControlsProps {
  isConnected: boolean;
  isConnecting: boolean;
  onStart: () => void;
  onStop: () => void;
}

import { assetUrl } from "../utils/assetUrls";

export const BottomControls: React.FC<BottomControlsProps> = ({
  isConnected,
  isConnecting,
  onStart,
  onStop
}) => {
  return (
    <div className="flex items-center justify-center gap-5">
      {/* Center Button - Play/Pause */}
      {!isConnected ? (
        <img 
          src={assetUrl("/images/play-circle.png")} 
          alt="Play"
          onClick={onStart}
          className={`h-20 w-20 cursor-pointer transition-transform ${
            isConnecting 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:scale-110 active:scale-95'
          }`}
        />
      ) : (
        <img 
          src={assetUrl("/images/pause-circle.png")} 
          alt="Pause"
          onClick={onStop}
          className="h-20 w-20 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
        />
      )}
      
      {/* Right Button - Stop */}
      <img 
        src={assetUrl("/images/stop-circle.png")} 
        alt="Stop"
        onClick={onStop}
        className="h-14 w-14 cursor-pointer hover:scale-110 transition-transform active:scale-95"
      />
    </div>
  );
};
