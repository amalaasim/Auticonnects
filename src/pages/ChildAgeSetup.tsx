import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import TopBarLogoutIcon from '@/components/TopBarLogoutIcon';
import LoadingWheel from '@/components/LoadingWheel';
import signoutNew from '../assests/signout-new.png';

const ChildAgeSetup: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [childAge, setChildAge] = useState('');
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
    }
    const name = sessionStorage.getItem('childName');
    if (!name) {
      navigate('/child-profile/name');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    
    const age = parseInt(childAge, 10);
    
    if (!childAge.trim() || isNaN(age) || age < 1 || age > 18) {
      toast({
        variant: 'destructive',
        title: 'Invalid Age',
        description: 'Please enter a valid age between 1 and 18.',
      });
      return;
    }

    setLoading(true);
    sessionStorage.setItem('childAge', age.toString());
    setLoading(false);
    navigate('/child-profile/character');
  };

  const handleBack = () => {
    playClickSound();
    navigate('/child-profile/name');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center" style={{ backgroundImage: 'url(/assets/child-profile-bg-2.png)' }}>
        <LoadingWheel size={92} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden [container-type:size]">
      <img
        src="/assets/child-profile-bg-2.png"
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
        {/* Left side - Title */}
        <div className="mt-[1.1cqh] flex flex-col">
          <h1 className="text-white" style={{ fontFamily: "'Chewy', cursive", fontSize: '3.6cqh', lineHeight: '1' }}>
            Child Profile
          </h1>
          <p className="mt-[0.35cqh] text-white" style={{ fontFamily: "'Chewy', cursive", fontSize: '1.35cqh', lineHeight: '1' }}>
            Creation by Parent
          </p>
        </div>

        {/* Right side - Sign out only */}
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
        {/* Content inside Rectangle */}
        <form onSubmit={handleSubmit} className="absolute inset-0 flex flex-col items-center justify-start px-[2.2cqh] pt-[2.2cqh]">
          {/* Back Arrow at start of rectangle */}
          <button
            type="button"
            onClick={handleBack}
            className="absolute left-[15cqh] top-[35cqh] appearance-none border-0 bg-transparent p-0 transition-opacity hover:opacity-80 z-20"
            style={{ transform: 'translateY(-3.2cqh)' }}
          >
            <img 
              src="/assets/arrow.png" 
              alt="Back" 
              className="w-[35cqh] h-[35cqh] object-contain"
              style={{ transform: 'scaleX(-1)' }}
            />
          </button>
          
          <h2
            className="absolute left-[95cqh] -top-[10.2cqh] mb-[2cqh] text-center text-[20.8cqh] font-bold text-white rotate-[2.23deg]"
            style={{ fontFamily: "'Chewy', cursive" }}
          >
            How old is your child?
          </h2>

          <div className="absolute -top-[-47cqh] right-[70cqh] flex items-center pr-[34cqh]">
            <input
              type="number"
              value={childAge}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '') {
                  setChildAge('');
                  return;
                }
                const num = parseInt(val, 10);
                if (!isNaN(num) && num <= 18) {
                  setChildAge(num.toString());
                }
              }}
              placeholder=""
              min="1"
              max="18"
              className="bg-transparent border-none text-[20.8cqh] text-white text-right focus:outline-none w-[26cqh] mr-4"
              style={{ 
                fontFamily: "'Chewy', cursive", 
                transform: 'translate(-4.1cqh, -1.2cqh) rotate(2deg)',
                MozAppearance: 'textfield'
              }}
              required
              autoFocus
            />
            <span
              className="text-[20.8cqh] text-white whitespace-nowrap"
              style={{ fontFamily: "'Chewy', cursive", transform: 'translate(-4.1cqh, -1.2cqh) rotate(2deg)' }}
            >
              years old
            </span>
            <button
              type="submit"
              disabled={loading || !childAge.trim()}
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

export default ChildAgeSetup;
