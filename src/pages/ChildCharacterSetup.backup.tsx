import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';
import TopBarLogoutIcon from '@/components/TopBarLogoutIcon';
import LoadingWheel from '@/components/LoadingWheel';
import signoutNew from '../assests/signout-new.png';

const ChildCharacterSetup: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [hoveredCharacter, setHoveredCharacter] = useState<string>('');
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

  const characters = [
    {
      name: 'Bubbles',
      value: 'bubbles',
      image: '/assets/bubbles.png',
      description: 'Always ready to play!',
      nameClassName: '',
      descriptionClassName: '',
      hoverColor: '#B78FD7',
    },
    {
      name: 'Sheru',
      value: 'rocco',
      image: '/assets/rocco.png',
      description: 'Confident, and super kind!',
      nameClassName: '',
      descriptionClassName: '',
      hoverColor: '#F2A156',
    },
    {
      name: 'Mimmi',
      value: 'mimi',
      image: '/assets/mimmi.png',
      description: 'Sweet, and full of energy!',
      nameClassName: '',
      descriptionClassName: '',
      hoverColor: '#80E2F4',
    },
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
    const name = sessionStorage.getItem('childName');
    const age = sessionStorage.getItem('childAge');
    if (!name || !age) {
      navigate('/child-profile/name');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    playClickSound();
    
    if (!selectedCharacter) {
      toast({
        variant: 'destructive',
        title: 'Character Required',
        description: 'Please select a favorite character.',
      });
      return;
    }

    const childName = sessionStorage.getItem('childName');
    const childAge = sessionStorage.getItem('childAge');

    if (!childName || !childAge || !user?.id) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Missing profile information. Please start over.',
      });
      navigate('/child-profile/name');
      return;
    }

    let favoriteCharacter = selectedCharacter;
    if (favoriteCharacter === 'mimmi') {
      favoriteCharacter = 'mimi';
    }

    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        child_name: childName,
        child_age: parseInt(childAge, 10),
        favorite_character: favoriteCharacter,
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
      setLoading(false);
      return;
    }

    sessionStorage.removeItem('childName');
    sessionStorage.removeItem('childAge');
    sessionStorage.removeItem('favoriteCharacter');

    setLoading(false);
    navigate('/');
  };

  const handleBack = () => {
    playClickSound();
    navigate('/child-profile/age');
  };

  const handleCharacterSelect = (value: string) => {
    playClickSound();
    setSelectedCharacter(value);
  };

  const isCharacterActive = (value: string) =>
    hoveredCharacter === value || selectedCharacter === value;

  if (authLoading) {
    return (
      <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center" style={{ backgroundImage: 'url(/assets/child-profile-bg-3.png)' }}>
        <LoadingWheel size={92} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden [container-type:size]">
      <img
        src="/assets/child-profile-bg-3.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-fill object-center"
      />
      <div
        className="absolute z-[5]"
        style={{
          left: '-4.58%',
          right: '-5.14%',
          top: '23%',
          aspectRatio: '1440 / 204',
          transform: 'scaleX(-1)',
        }}
      >
        <img
          src="/assets/CharRect.svg"
          alt="Rectangle"
          className="h-full w-full object-fill"
        />
      </div>
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

      {/* Question - Centered at top */}
      <div className="absolute top-[12cqh] left-0 right-0 px-4 flex justify-center z-10">
        <h2
          className="w-full max-w-[120cqh] text-center text-[7.2cqh] text-white"
          style={{
            fontFamily: "'Chewy', cursive",
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '105%',
            letterSpacing: '0.05em',
          }}
        >
          Choose your child’s favorite character
        </h2>
      </div>

      <div
        className="fixed bottom-[2.9vh] left-1/2 z-20 -translate-x-1/2 [container-type:size]"
        style={{
          height: '92vh',
          width: '100vw',
        }}
      >
        <div
          className="absolute inset-x-0 [container-type:size]"
          style={{
            aspectRatio: '1440 / 214',
            top: 'calc(40cqh + 8cqh - 14.861111vw)',
          }}
        >
          <form onSubmit={handleSubmit} className="absolute inset-0 px-[2.2cqh]">
            <button
              type="button"
              onClick={handleBack}
              className="absolute left-[15cqh] top-[10.5cqh] appearance-none border-0 bg-transparent p-0 transition-opacity hover:opacity-80 z-20"
            >
              <img
                src="/assets/arrow.png"
                alt="Back"
                className="w-[35cqh] h-[35cqh] object-contain"
                style={{ transform: 'scaleX(-1)' }}
              />
            </button>

            <button
              type="submit"
              disabled={loading || !selectedCharacter}
              className="absolute right-[15cqh] top-[10.5cqh] flex-shrink-0 appearance-none border-0 bg-transparent p-0 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed z-20"
              style={{ transform: 'rotate(-6deg)' }}
            >
              <img src="/ui/next-button.png" alt="Submit" className="h-[35cqh] w-[35cqh] object-contain" />
            </button>

            <div className="absolute left-1/2 top-[3.8cqh] z-20 w-[150cqh] max-w-[150cqh] -translate-x-1/2">
              <div className="grid grid-cols-3 gap-[2cqh] w-full">
                {characters.map((character) => (
                  <div key={`text-${character.value}`} className="relative flex justify-center">
                    <div
                      className="w-full flex flex-col items-center"
                      style={{ transform: 'rotate(-3deg)' }}
                    >
                      {selectedCharacter === character.value && (
                        <div className="absolute right-[2.2cqh] top-[-1.5cqh] flex h-[4cqh] w-[4cqh] items-center justify-center rounded-full bg-yellow-400 shadow-lg">
                          <Check className="h-[2.4cqh] w-[2.4cqh] text-white" />
                        </div>
                      )}
                      <p
                        className={`text-[4cqh] font-bold text-center w-full ${character.nameClassName}`}
                        style={{
                          fontFamily: "'Chewy', cursive",
                          color: isCharacterActive(character.value) ? character.hoverColor : '#FFFFFF',
                          opacity: isCharacterActive(character.value) ? 1 : 0.72,
                          transition: 'color 180ms ease, opacity 180ms ease',
                        }}
                      >
                        {character.name}
                      </p>
                      <p
                        className={`mt-[0.6cqh] w-[40cqh] text-center text-[3.6cqh] leading-tight ${character.descriptionClassName}`}
                        style={{
                          fontFamily: "'Chewy', cursive",
                          color: isCharacterActive(character.value) ? character.hoverColor : '#FFFFFF',
                          opacity: isCharacterActive(character.value) ? 1 : 0.72,
                          transition: 'color 180ms ease, opacity 180ms ease',
                        }}
                      >
                        {character.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        <div className="absolute left-1/2 top-[40cqh] z-10 w-[130cqh] -translate-x-1/2 pointer-events-auto px-[2cqh]" style={{ height: '55cqh' }}>
          <div className="grid grid-cols-3 gap-[0cqh] w-full h-full">
            {characters.map((character) => (
              <button
                key={character.value}
                type="button"
                onClick={() => handleCharacterSelect(character.value)}
                className={`relative flex h-full justify-center appearance-none border-0 bg-transparent p-0 transition-all duration-200 ${
                  selectedCharacter === character.value
                    ? 'scale-105'
                    : 'hover:scale-102'
                }`}
                onMouseEnter={() => setHoveredCharacter(character.value)}
                onMouseLeave={() => setHoveredCharacter('')}
              >
                <img
                  src={character.image}
                  alt={character.name}
                  className="h-full w-auto max-w-full object-contain"
                  style={{
                    opacity: isCharacterActive(character.value) ? 1 : 0.72,
                    transition: 'opacity 180ms ease',
                    transform: character.value === 'rocco' ? 'scale(1.3125) translateY(-1.2cqh)' : 'scale(1.10)',
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildCharacterSetup;
