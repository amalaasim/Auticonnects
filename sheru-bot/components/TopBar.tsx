import React from 'react';

import { assetUrl } from "../utils/assetUrls";

export const TopBar: React.FC = () => {
  return (
    <header className="w-full flex items-center justify-between px-6 py-2 z-20">
      {/* Back Button */}
      <button 
        className="relative cursor-pointer hover:scale-105 transition-transform active:scale-95"
        style={{ width: '10vw' }}
        onClick={() => window.history.back()}
      >
        <img 
          src={assetUrl("/images/status-rectangle-blend.png")} 
          alt="Back"
          className="h-auto w-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            aria-hidden="true"
            style={{
              fontFamily: "'Chewy', cursive",
              fontStyle: "normal",
              fontWeight: 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "55%",
              aspectRatio: "108 / 39",
              fontSize: "1.75vw",
              lineHeight: "90%",
              textAlign: "center",
              color: "#43270F",
              mixBlendMode: "multiply",
              textShadow: "0px -1px 4px #FFCB8F",
              whiteSpace: "nowrap",
            }}
          >
            {"< Back"}
          </span>
        </div>
      </button>
      
      {/* Logo - Bigger */}
      <img 
        src={assetUrl("/images/logo.png")} 
        alt="Auti-Connects"
        className="h-16"
      />
    </header>
  );
};
