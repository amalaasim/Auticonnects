import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TopBarLogoutIcon from '@/components/TopBarLogoutIcon';
import LoadingWheel from '@/components/LoadingWheel';
import signoutNew from '../assests/signout-new.png';
import languageBanner from '../assests/language-banner.svg';

const ChildCharacterSetup: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [hoveredCharacter, setHoveredCharacter] = useState('');
  const [loading, setLoading] = useState(false);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const characters = [
    {
      name: 'Bubbles',
      value: 'bubbles',
      image: '/assets/bubbles.png',
      description: 'Always ready to play!',
      hoverColor: '#B78FD7',
    },
    {
      name: 'Sheru',
      value: 'rocco',
      image: '/assets/rocco.png',
      description: 'Confident, and super kind!',
      hoverColor: '#F2A156',
    },
    {
      name: 'Mimmi',
      value: 'mimi',
      image: '/assets/mimmi.png',
      description: 'Sweet, and full of energy!',
      hoverColor: '#80E2F4',
    },
  ];

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

    const name = sessionStorage.getItem('childName');
    const age = sessionStorage.getItem('childAge');
    if (!name || !age) {
      navigate('/child-profile/name');
    }
  }, [authLoading, navigate, user]);

  const handleSubmit = async () => {
    if (loading) return;

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
      .upsert(
        {
          user_id: user.id,
          child_name: childName,
          child_age: parseInt(childAge, 10),
          favorite_character: favoriteCharacter,
        },
        {
          onConflict: 'user_id',
        }
      );

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
        <div
          className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
          style={{ backgroundImage: 'url(/assets/charx3.png)' }}
        >
        <LoadingWheel size={92} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden [container-type:size]">
      <div
        className="child-character-bg absolute inset-0 flex items-end justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(/assets/charbg.png)',
          width: '100vw',
          height: '100vh',
          minHeight: '100vh',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          position: 'relative',
          overflow: 'hidden',
          containerType: 'size',
        }}
      >
        {/* Gradient overlay above bg image, below all content */}
        <div
          style={{
            position: 'absolute',
            width: '1458px',
            height: '378px',
            left: '-12px',
            top: 0,
            background: 'linear-gradient(180.3deg, rgba(0, 0, 0, 0.656) 28.39%, rgba(0, 0, 0, 0) 106.06%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: '-0.5cqw',
            bottom: 0,
            width: '100.5cqw',
            height: '13.8cqh',
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.82) 28%, rgba(0, 0, 0, 0) 94.56%)',
            transform: 'scaleY(-1)',
            transformOrigin: 'center',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

          <div
            className="child-character-row"
            style={{
              position: 'absolute',
              left: '50%',
              width: '80cqw',
              height: 'auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              transform: 'translateX(-50%)',
              zIndex: 10,
              overflow: 'visible',
            }}
          >
            {characters.map((character) => (
              <button
                key={character.value}
                type="button"
                onClick={() => handleCharacterSelect(character.value)}
                onMouseEnter={() => setHoveredCharacter(character.value)}
                onMouseLeave={() => setHoveredCharacter('')}
                style={{
                  height: 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  background: 'none',
                  border: 0,
                  padding: 0,
                  pointerEvents: 'auto',
                  transition: 'filter 0.18s',
                  overflow: 'visible',
                }}
              >
                <img
                  className={character.value === 'rocco' ? 'child-character-img child-character-img-rocco' : 'child-character-img'}
                  src={character.image}
                  alt={character.name}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    opacity: isCharacterActive(character.value) ? 1 : 0.72,
                    transition: 'opacity 180ms ease, filter 180ms ease',
                    filter: isCharacterActive(character.value) ? 'drop-shadow(0 0 16px rgba(0,0,0,0.18))' : 'none',
                    transformOrigin: 'center bottom',
                  }}
                />
              </button>
            ))}
          </div>

      <div
        className="child-character-banner absolute pointer-events-auto"
        style={{
          left: '-5.55%',
          right: '-2.67%',
          zIndex: 3,
          background: 'none',
          borderRadius: '24px',
          overflow: 'hidden',
          isolation: 'auto',
          containerType: 'inline-size',
        }}
      >
        <img
          src={languageBanner}
          alt="Rectangle"
          className="absolute inset-0 z-0 h-full w-full object-fill pointer-events-none"
        />
        <div className="child-character-banner-text absolute z-10 pointer-events-auto">
          {characters.map((character) => (
            <button
              key={`text-${character.value}`}
              type="button"
              onClick={() => handleCharacterSelect(character.value)}
              onMouseEnter={() => setHoveredCharacter(character.value)}
              onMouseLeave={() => setHoveredCharacter('')}
              className="child-character-text-item appearance-none border-0 bg-transparent p-0"
              style={{
                opacity: isCharacterActive(character.value) ? 1 : 0.72,
                transition: 'opacity 180ms ease',
              }}
            >
              <p
                className="child-character-text-name"
                style={{
                  fontFamily: "'Chewy', cursive",
                  color: isCharacterActive(character.value) ? character.hoverColor : '#FFFFFF',
                  transition: 'color 180ms ease',
                }}
              >
                {character.name}
              </p>
              <p
                className="child-character-text-description"
                style={{
                  fontFamily: "'Chewy', cursive",
                  color: isCharacterActive(character.value) ? character.hoverColor : '#FFFFFF',
                  transition: 'color 180ms ease',
                }}
              >
                {character.description}
              </p>
            </button>
          ))}
        </div>

      </div>

      <button
        type="button"
        aria-label="Next"
        aria-disabled={loading || !selectedCharacter}
        onClick={handleSubmit}
        className={`child-character-next-button absolute transition-opacity ${
          loading || !selectedCharacter ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        }`}
        style={{
          left: '94cqw',
          width: '12cqw',
          height: '14cqh',
          transform: 'translate(-50%, -50%)',
          zIndex: 100,
          background: 'transparent',
          border: 0,
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
        }}
      >
        <img
          src="/ui/next-button.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{
            width: 'auto',
            height: '60%',
            transform: 'rotate(-5deg)',
            pointerEvents: 'none',
          }}
        />
      </button>

      <button
        type="button"
        aria-label="Back"
        onClick={handleBack}
        className="child-character-back-button absolute cursor-pointer"
        style={{
          width: '12cqw',
          height: '14cqh',
          transform: 'translateY(-50%)',
          zIndex: 100,
          background: 'transparent',
          border: 0,
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
        }}
      >
        <img
          src="/assets/arrow.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{
            width: 'auto',
            height: '60%',
            transform: 'scaleX(-1) rotate(20deg)',
            pointerEvents: 'none',
          }}
        />
      </button>

      <img
        src="/assets/logo.png"
        alt="AutiConnect"
        className="child-character-logo absolute pointer-events-none"
      />

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

      <div
        className="absolute left-0 right-0 top-[12%] z-20 flex justify-center"
        style={{ aspectRatio: '1440 / 214' }}
      >
        <div className="relative flex flex-col items-center justify-start">
          <h2
            className="mb-[2cqh] text-center text-[6cqh] font-bold text-white"
            style={{ fontFamily: "'Chewy', cursive" }}
          >
            Choose your child&apos;s favorite character
          </h2>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ChildCharacterSetup;
