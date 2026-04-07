import React from 'react';
import { useNavigate } from 'react-router-dom';
const backSignpost = '/assets/back.png';

interface BackSignpostProps {
  to: string;
  label?: string;
}

const BackSignpost: React.FC<BackSignpostProps> = ({ to, label = 'Back' }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="absolute -bottom-3 left-2 bg-transparent border-none transition-transform duration-200 hover:scale-110 md:-bottom-5 md:left-4 lg:-bottom-8"
      aria-label={label}
    >
      <img 
        src={backSignpost} 
        alt={label}
        loading="eager"
        decoding="async"
        className="h-36 w-auto md:h-44 lg:h-56"
      />
    </button>
  );
};

export default BackSignpost;
