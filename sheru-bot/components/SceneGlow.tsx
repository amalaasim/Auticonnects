import React from 'react';

export const SceneGlow: React.FC = () => {
  return (
    <div
      className="absolute w-[700px] h-[700px] rounded-full pointer-events-none"
      style={{
        background:
          'radial-gradient(circle, rgba(100,200,255,0.35) 0%, transparent 65%)',
        filter: 'blur(80px)'
      }}
    />
  );
};
