import React from 'react';

import { assetUrl } from "../utils/assetUrls";

export const TopBar: React.FC = () => {
  return (
    <header className="w-full flex items-center justify-between px-6 py-2 z-20">
      {/* Back Button */}
      <button 
        className="relative cursor-pointer hover:scale-105 transition-transform active:scale-95 h-11"
        onClick={() => window.history.back()}
      >
        <img 
          src={assetUrl("/images/status-rectangle-blend.png")} 
          alt="Back"
          className="h-full w-auto"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src={assetUrl("/images/_Back.png")} 
            alt="Back Text"
            className="h-6 w-auto"
            style={{ filter: 'brightness(1.2) contrast(1.3)' }}
          />
        </div>
      </button>
      
      {/* Logo - Bigger */}
      <img 
        src={assetUrl("/images/logo.png")} 
        alt="Auti-Connects"
        className="h-16"
      />

      {/* Icon Buttons */}
      <div className="flex items-center gap-2">
        <img 
          src={assetUrl("/images/home-square.png")} 
          alt="Home"
          className="h-10 w-10 cursor-pointer hover:scale-105 transition-transform active:scale-95"
        />
        <img 
          src={assetUrl("/images/settings-square.png")} 
          alt="Settings"
          className="h-10 w-10 cursor-pointer hover:scale-105 transition-transform active:scale-95"
        />
        <img 
          src={assetUrl("/images/sound-on-square.png")} 
          alt="Sound"
          className="h-10 w-10 cursor-pointer hover:scale-105 transition-transform active:scale-95"
        />
      </div>
    </header>
  );
};
