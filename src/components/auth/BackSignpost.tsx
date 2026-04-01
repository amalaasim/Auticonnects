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
      className="absolute left-4 bottom-0 hover:scale-110 transition-transform duration-200 bg-transparent border-none"
      aria-label={label}
    >
      <img 
        src={backSignpost} 
        alt={label}
        className="h-32 w-auto"
      />
    </button>
  );
};

export default BackSignpost;
