import React, { useEffect, useState } from "react";

import { assetUrl } from "../utils/assetUrls";

interface CartoonAvatarProps {
  isTalking: boolean;
  volume: number;
  isListening: boolean;
  userVolume: number;
  currentText?: string;
  isConnected: boolean;
  isBubbles?: boolean;
  isMimmi?: boolean;
}

export const CartoonAvatar: React.FC<CartoonAvatarProps> = ({
  isTalking,
  volume,
  isListening,
  userVolume,
  currentText = "",
  isConnected,
  isBubbles = false,
  isMimmi = false
}) => {
  const [mimmiBottom, setMimmiBottom] = useState("13%");

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
    preload(assetUrl("/images/cat_static.png"));
    preload("/assets/Bubbles/Bubbles_Sleeping.png");
    preload("/assets/Bubbles/standing-loop.gif");
    preload("/assets/Bubbles/talking-loop.gif");
    preload("/assets/Bubbles/mimmi_sleeping.png");
    preload("/assets/Mimmi/standing_mimmi.gif");
    preload("/assets/Mimmi/talking_mimmi.gif");
  }, []);

  useEffect(() => {
    const updateMimmiBottom = () => {
      if (typeof window === "undefined") return;

      const isIpadMini = window.matchMedia("(min-width: 1100px) and (max-width: 1160px) and (max-height: 780px) and (min-aspect-ratio: 1.45)").matches;
      const isIpad11 = window.matchMedia("(min-width: 1161px) and (max-width: 1250px) and (max-height: 860px) and (min-aspect-ratio: 1.35)").matches;
      const isIpad13 = window.matchMedia("(min-width: 1300px) and (max-width: 1400px) and (min-height: 950px) and (max-height: 1100px) and (max-aspect-ratio: 1.4)").matches;

      if (isIpad13) {
        setMimmiBottom("8%");
      } else if (isIpad11) {
        setMimmiBottom("10%");
      } else if (isIpadMini) {
        setMimmiBottom("12%");
      } else {
        setMimmiBottom("13%");
      }
    };

    updateMimmiBottom();
    window.addEventListener("resize", updateMimmiBottom);
    window.addEventListener("orientationchange", updateMimmiBottom);

    return () => {
      window.removeEventListener("resize", updateMimmiBottom);
      window.removeEventListener("orientationchange", updateMimmiBottom);
    };
  }, []);

  // Determine which image to show based on connection and talking state
  const getCatImage = () => {
    if (!isConnected) {
      // Before play is clicked, keep the sleeping image.
      if (isBubbles) return "/assets/Bubbles/Bubbles_Sleeping.png";
      if (isMimmi) return "/assets/Bubbles/mimmi_sleeping.png";
      return assetUrl("/images/cat_static.png");
    } else if (isTalking) {
      if (isBubbles) return "/assets/Bubbles/talking-loop.gif";
      if (isMimmi) return "/assets/Mimmi/talking_mimmi.gif";
      return assetUrl("/images/talking.gif");
    } else {
      // After play is clicked and Sheru is awake but idle, use standing lion.
      if (isBubbles) return "/assets/Bubbles/standing-loop.gif";
      if (isMimmi) return "/assets/Mimmi/standing_mimmi.gif";
      return assetUrl("/images/standinglion-loop.gif");
    }
  };

  const catImage = getCatImage();
  const isSleeping = !isConnected;
  const isStanding = isConnected && !isTalking;
  const catImageStyle = {
    objectFit: 'contain' as const,
    width: isMimmi ? '40cqw' : isBubbles && isSleeping ? '38.5cqw' : isStanding ? '38.5cqw' : isConnected ? '39cqw' : '40cqw',
    height: isMimmi ? '40cqh' : isBubbles && isSleeping ? '38.5cqh' : isStanding ? '38.5cqh' : isConnected ? '39cqh' : '40cqh',
    left: isMimmi ? 0 : isBubbles && isSleeping ? '50%' : 0,
    top: isMimmi ? 0 : isBubbles && isSleeping ? '50%' : 0,
    transform: isMimmi ? 'none' : isBubbles && isSleeping ? 'translate(-50%, -51%)' : isBubbles && isTalking ? 'translate(2%, -2%)' : isTalking ? 'translateY(-5%)' : isStanding ? 'translateX(2%)' : 'none',
  };

  return (
    <div className="relative w-full h-full overflow-visible" style={{ paddingTop: '60px' }}>
      
      {isBubbles ? (
        <div
          className="absolute pointer-events-none z-0"
          style={{
            width: "44.55cqw",
            height: "69.79cqh",
            left: "calc(50cqw - 22.28cqw - 0.22cqw)",
            top: "25.5cqh",
            opacity: 0.4,
          }}
        >
          <div
            className="absolute rounded-full"
            style={{
              width: "100%",
              height: "100%",
              left: 0,
              top: 0,
              background: "#A500B1",
              filter: "blur(1.48cqh)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: "75.03%",
              height: "75.16%",
              left: "12.48%",
              top: "12.42%",
              background: "#551BD2",
              filter: "blur(1.48cqh)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: "43.82%",
              height: "43.85%",
              left: "28.09%",
              top: "28.07%",
              background: "#6747A9",
              filter: "blur(1.48cqh)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: "18.85%",
              height: "18.76%",
              left: "40.57%",
              top: "40.62%",
              background: "#FFFFFF",
              filter: "blur(1.48cqh)",
            }}
          />
        </div>
      ) : (
        isMimmi ? (
          <div
            className="absolute pointer-events-none z-0"
            style={{
              width: "44.55cqw",
              height: "44.55cqw",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, calc(-50% + 10%))",
              opacity: 0.4,
            }}
          >
            <div
              className="absolute rounded-full"
              style={{
                width: "100%",
                height: "100%",
                left: 0,
                top: 0,
                background: "#0091B1",
                filter: "blur(1.48cqh)",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: "75.03%",
                height: "75.16%",
                left: "12.48%",
                top: "12.42%",
                background: "#1BABD2",
                filter: "blur(1.48cqh)",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: "43.82%",
                height: "43.85%",
                left: "28.09%",
                top: "28.07%",
                background: "#73CEE3",
                filter: "blur(1.48cqh)",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: "18.85%",
                height: "18.76%",
                left: "40.57%",
                top: "40.62%",
                background: "#FFFFFF",
                filter: "blur(1.48cqh)",
              }}
            />
          </div>
        ) : (
          <div
            className="absolute pointer-events-none z-0"
            style={{
              width: "54cqh",
              height: "54cqh",
              left: "50%",
              top: "58%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <img
              src={assetUrl("/images/circles.png")}
              alt="Background Glow"
              className="object-contain"
              style={{ width: "100%", height: "100%", opacity: 0.5 }}
            />
          </div>
        )
      )}

      {/* Cat Character Container - Fixed size */}
      <div
        className="absolute left-1/2 z-10 overflow-visible"
        style={{ bottom: isMimmi ? mimmiBottom : '16%', width: '40cqw', height: '40cqh', transform: 'translateX(-50%)' }}
      >
        {/* Mimmi Halo (placed behind character, relative to container) */}
        {isMimmi && (
          <div
            className="absolute z-0"
            style={{
              width: "32cqw",
              height: "32cqh",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -54%)",
              opacity: 0.4,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: '#0091B1',
                filter: 'blur(1.2cqh)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '13%',
                top: '13%',
                width: '74%',
                height: '74%',
                borderRadius: '50%',
                background: '#1BABD2',
                filter: 'blur(1.2cqh)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '28%',
                top: '28%',
                width: '44%',
                height: '44%',
                borderRadius: '50%',
                background: '#73CEE3',
                filter: 'blur(1.2cqh)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '42%',
                top: '42%',
                width: '16%',
                height: '16%',
                borderRadius: '50%',
                background: '#fff',
                filter: 'blur(1.2cqh)',
              }}
            />
          </div>
        )}
       
        {/* Cat Image - Single image that changes based on state */}
        {isStanding && !isBubbles && (
          <div
            className="absolute pointer-events-none z-0"
            style={{
              left: '33.9%',
              top: '35.9%',
              width: '35.8%',
              height: '11.8%',
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
            <div
              className="absolute w-44 h-44 border-4 rounded-full animate-ping opacity-50"
              style={{
                borderColor: isBubbles ? '#ee7ef6' : isMimmi ? 'rgb(105, 137, 184)' : '#22c55e',
              }}
            />
            <div
              className="absolute w-36 h-36 border-4 rounded-full animate-pulse"
              style={{
                borderColor: isBubbles ? '#ee7ef600' : isMimmi ? 'rgba(105, 137, 184, 0)' : '#22c55e',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
