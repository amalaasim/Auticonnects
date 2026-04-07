import React, { useEffect } from "react";

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
  useEffect(() => {
    const preload = (src: string) => {
      const image = new Image();
      image.src = src;
      if (typeof image.decode === "function") {
        image.decode().catch(() => {});
      }
    };

    preload(assetUrl("/images/talking.gif"));
    preload(assetUrl("/images/standinglion-loop.gif"));
  }, []);

  // Determine which image to show based on connection and talking state
  const getCatImage = () => {
    if (!isConnected) {
      // Before play is clicked, keep the sleeping image.
      return assetUrl("/images/cat_static.png");
    } else if (isTalking) {
      // When Sheru is talking, use the lion talking animation.
      return assetUrl("/images/talking.gif");
    } else {
      // After play is clicked and Sheru is awake but idle, use standing lion.
      return assetUrl("/images/standinglion-loop.gif");
    }
  };

  const catImage = getCatImage();
  const isStanding = isConnected && !isTalking;
  const catImageStyle = {
    objectFit: 'cover' as const,
    width: '340px',
    height: '340px',
    transform: isTalking ? 'translateY(-18px)' : 'none',
  };

  return (
    <div className="relative w-full h-full flex items-end justify-center" style={{ paddingTop: '60px', paddingBottom: '8px' }}>
      
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
        {isStanding && (
          <div
            className="absolute pointer-events-none z-0"
            style={{
              left: '118px',
              top: '122px',
              width: '128px',
              height: '44px',
              background: '#000000',
              borderRadius: '999px',
            }}
          />
        )}

        <img
          src={catImage}
          alt="Sheru"
          draggable={false}
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full z-10"
          style={catImageStyle}
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
