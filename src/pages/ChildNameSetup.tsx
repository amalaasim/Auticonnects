import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { hasParentalConsent } from '@/utils/onboarding';
import TopBarLogoutIcon from '@/components/TopBarLogoutIcon';
import signoutNew from '../assests/signout-new.png';

const ChildNameSetup: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [childName, setChildName] = useState('');
  const [loading, setLoading] = useState(false);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    clickSoundRef.current = new Audio('/assets/sounds/click.wav');
    clickSoundRef.current.volume = 0.5;
  }, []);

  const playClickSound = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (!authLoading && user && !hasParentalConsent(user.id)) {
      navigate('/child-profile/consent');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    
    if (!childName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Name Required',
        description: "Please enter your child's name.",
      });
      return;
    }

    setLoading(true);
    sessionStorage.setItem('childName', childName.trim());
    setLoading(false);
    navigate('/child-profile/age');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center" style={{ backgroundImage: 'url(/assets/child-profile-bg-1.png)' }}>
        <div className="text-2xl animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/assets/child-profile-bg-1.png)' }}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-6 z-10">
        <div className="flex flex-col">
          <h1 className="text-white text-4xl font-bold" style={{ fontFamily: "'Chewy', cursive" }}>
            Child Profile
          </h1>
          <p className="text-white text-sm mt-1" style={{ fontFamily: "'Chewy', cursive" }}>
            Creation by Parent
          </p>
        </div>

        <div className="flex">
          <TopBarLogoutIcon
            src={signoutNew}
            sx={{
              width: '45.23px',
              height: '45.23px',
              objectFit: 'contain',
              opacity: 1,
              filter: 'brightness(1.12) contrast(1.08) drop-shadow(0 2px 6px rgba(0,0,0,0.22))',
            }}
          />
        </div>
      </div>

      {/* Rectangle Image */}
      <div
        className="absolute z-10"
        style={{ left: '-0.15%', right: '-0.08%', top: '43.08%', bottom: '38.3%' }}
      >
        <img 
          src="/assets/rectangle.png" 
          alt="Rectangle" 
          className="w-screen h-auto object-contain"
          style={{ mixBlendMode: 'multiply', filter: 'brightness(0.1) saturate(1.5) contrast(1.2)', opacity: 0.5 }}
        />
        
        <form onSubmit={handleSubmit} className="absolute inset-0 flex flex-col items-center justify-start px-8 pt-8">
          <h2
            className="absolute left-20 -top-8 mb-8 text-center text-4xl font-bold text-white md:text-5xl rotate-3"
            style={{ fontFamily: "'Chewy', cursive" }}
          >
            What is your kid's name?
          </h2>
          
          <div className="absolute -bottom-8 right-12 flex items-center gap-12">
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Enter your child's name"
              className="flex-1 bg-transparent border-none text-white text-5xl placeholder:text-white/60 focus:outline-none"
              style={{ fontFamily: "'Chewy', cursive", transform: 'translate(-35px, -10px) rotate(2deg)' }}
              required
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !childName.trim()}
              className="flex-shrink-0 appearance-none border-0 bg-transparent p-0 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ transform: 'translateY(-20px)' }}
            >
              <img src="/ui/next-button.png" alt="Submit" className="w-20 h-20 object-contain" />
            </button>
          </div>
        </form>
      </div>

      {/* Footer - Logo */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-8 z-10">
        <img src="/assets/logo.png" alt="Auti-Connects Logo" className="w-64 h-auto" />
      </div>
    </div>
  );
};

export default ChildNameSetup;
