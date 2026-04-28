import React from 'react';

interface BottomControlsProps {
  isConnected: boolean;
  isConnecting: boolean;
  isReady: boolean;
  onStart: () => void;
  onStop: () => void;
}

import { assetUrl } from "../utils/assetUrls";

export const BottomControls: React.FC<BottomControlsProps> = ({
  isConnected,
  isConnecting,
  isReady,
  onStart,
  onStop
}) => {
  const canStart = isReady && !isConnecting;

  return (
    <div className="flex items-center justify-center gap-5">
      {/* Center Button - Play/Pause */}
      {!isConnected ? (
        <img 
          src={assetUrl("/images/play-circle.png")} 
          alt="Play"
          onClick={canStart ? onStart : undefined}
          className={`cursor-pointer transition-transform ${
            !canStart
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:scale-110 active:scale-95'
          }`}
          style={{ width: '6cqw', height: '6cqw' }}
        />
      ) : (
        <img 
          src={assetUrl("/images/pause-circle.png")} 
          alt="Pause"
          onClick={onStop}
          className="cursor-pointer hover:scale-110 active:scale-95 transition-transform"
          style={{ width: '6cqw', height: '6cqw' }}
        />
      )}
      
      {/* Right Button - Stop */}
      <img 
        src={assetUrl("/images/stop-circle.png")} 
        alt="Stop"
        onClick={onStop}
        className="cursor-pointer hover:scale-110 transition-transform active:scale-95"
        style={{ width: '6cqw', height: '6cqw' }}
      />
    </div>
  );
};
