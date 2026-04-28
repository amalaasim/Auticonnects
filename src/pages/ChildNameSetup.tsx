import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { hasParentalConsent } from '@/utils/onboarding';
import TopBarLogoutIcon from '@/components/TopBarLogoutIcon';
import LoadingWheel from '@/components/LoadingWheel';
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
        <LoadingWheel size={92} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden [container-type:size]">
      <img
        src="/assets/child-profile-bg-1.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-fill object-center"
      />
      {/* Header */}
      <div
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-[3.5cqh]"
        style={{
          height: '10cqh',
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.656) 6.88%, rgba(0, 0, 0, 0) 94.56%)',
        }}
      >
        <div className="mt-[1.1cqh] flex flex-col">
          <h1 className="text-white" style={{ fontFamily: "'Chewy', cursive", fontSize: '3.6cqh', lineHeight: '1' }}>
            Child Profile
          </h1>
          <p className="mt-[0.35cqh] text-white" style={{ fontFamily: "'Chewy', cursive", fontSize: '1.35cqh', lineHeight: '1' }}>
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
        className="absolute left-1/2 top-[43.08%] z-10 w-[200cqh] max-w-[100vw] -translate-x-1/2"
        style={{ aspectRatio: '1440 / 214' }}
      >
        <img 
          src="/assets/child-profile-name-bar.svg" 
          alt="Rectangle" 
          className="h-full w-full object-contain"
        />
      </div>

      <div
        className="absolute left-1/2 top-[43.08%] z-20 w-[200cqh] max-w-[100vw] -translate-x-1/2 [container-type:size]"
        style={{ aspectRatio: '1440 / 214' }}
      >
        <form onSubmit={handleSubmit} className="absolute inset-0 flex flex-col items-center justify-start px-[2.2cqh] pt-[2.2cqh]">
          <h2
            className="absolute left-[80cqh] -top-[10.2cqh] mb-[2cqh] text-center text-[20.8cqh] font-bold text-white rotate-[2.23deg]"
            style={{ fontFamily: "'Chewy', cursive" }}
          >
            What is your child's name?
          </h2>
          
          <div className="absolute -top-[-47cqh] right-[70cqh] flex items-center pr-[34cqh]">
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Enter your child's name"
              className="flex-1 bg-transparent border-none text-[20.8cqh] text-[#D5EADC] placeholder:text-[#D5EADC]/60 focus:outline-none"
              style={{ fontFamily: "'Chewy', cursive", transform: 'translate(-4.1cqh, -1.2cqh) rotate(2deg)' }}
              required
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !childName.trim()}
              className="absolute right-[-40cqh] flex-shrink-0 appearance-none border-0 bg-transparent p-0 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ transform: 'translateY(-3.2cqh) rotate(-6deg)' }}
            >
              <img src="/ui/next-button.png" alt="Submit" className="h-[35cqh] w-[35cqh] object-contain" />
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
