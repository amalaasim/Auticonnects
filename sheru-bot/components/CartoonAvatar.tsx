import React from "react";

import { assetUrl } from "../utils/assetUrls";

interface CartoonAvatarProps {
  isTalking: boolean;
  volume: number;
  isListening: boolean;
  userVolume: number;
  currentText?: string;
  isConnected: boolean;
}

export const CartoonAvatar: React.FC<CartoonAvatarProps> = ({
  isTalking,
  volume,
  isListening,
  userVolume,
  currentText = "",
  isConnected
}) => {
  // Determine which image to show based on connection and talking state
  const getCatImage = () => {
    if (!isConnected) {
      // Not connected = static idle
      return assetUrl("/images/cat_static.png");
    } else if (isTalking) {
      // AI is talking = animated GIF
      return assetUrl("/images/cat_moving.gif");
    } else {
      // Connected but not talking = mouth open
      return assetUrl("/images/cat_mouth_open.png");
    }
  };

  const catImage = getCatImage();

  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ paddingTop: '60px' }}>
      
      {/* Background Glow - circles.png - ALWAYS VISIBLE */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <img 
          src={assetUrl("/images/circles.png")} 
          alt="Background Glow"
          className="w-[500px] h-[500px] object-contain opacity-50"
        />
      </div>

      {/* Cat Character Container - Fixed size */}
      <div className="relative w-[340px] h-[340px] z-10">
       
        {/* Cat Image - Single image that changes based on state */}
        <img
          src={catImage}
          alt="Mimi"
          draggable={false}
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: 'cover',
            width: '340px',
            height: '340px'
          }}
          key={catImage} // Force re-render when image changes (restarts GIF)
        />

        {/* Listening Indicator (Green Ring) */}
        {isListening && !isTalking && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="absolute w-44 h-44 border-4 border-green-400 rounded-full animate-ping opacity-50" />
            <div className="absolute w-36 h-36 border-4 border-green-400 rounded-full animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};
