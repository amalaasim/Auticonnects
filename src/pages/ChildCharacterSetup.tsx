import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';
import TopBarLogoutIcon from '@/components/TopBarLogoutIcon';
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
      nameClassName: 'md:translate-x-6',
      descriptionClassName: 'md:translate-x-6',
      hoverColor: '#B78FD7',
    },
    {
      name: 'Rocco',
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
      nameClassName: 'md:-translate-x-6',
      descriptionClassName: 'md:-translate-x-6',
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
        <div className="text-2xl animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/assets/child-profile-bg-3.png)' }}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-6 z-10">
        {/* Left side - Title */}
        <div className="flex flex-col">
          <h1 className="text-white text-4xl font-bold" style={{ fontFamily: "'Chewy', cursive" }}>
            Child Profile
          </h1>
          <p className="text-white text-sm mt-1" style={{ fontFamily: "'Chewy', cursive" }}>
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
      <div className="absolute top-32 left-0 right-0 flex justify-center z-10">
        <h2 className="text-white text-4xl md:text-5xl font-bold text-center" style={{ fontFamily: "'Chewy', cursive" }}>
          Choose a favorite character
        </h2>
      </div>

      {/* Rectangle Image */}
      <div
        className="absolute z-10"
        style={{
          left: '-0.15%',
          right: '-0.08%',
          top: '23.08%',
          bottom: '38.3%',
        }}
      >
        <img 
          src="/assets/rectangle.png" 
          alt="Rectangle" 
          className="w-screen h-auto object-contain"
          style={{
            mixBlendMode: 'multiply',
            filter: 'brightness(0.1) saturate(1.5) contrast(1.2)',
            opacity: 0.5,
          }}
        />
        
        {/* Content inside Rectangle */}
        <form onSubmit={handleSubmit} className="absolute inset-0 flex flex-col items-center justify-start px-8 pt-8">
          {/* Back Arrow at start of rectangle */}
          <button
            type="button"
            onClick={handleBack}
            className="absolute left-12 top-12 appearance-none border-0 bg-transparent p-0 transition-opacity hover:opacity-80 z-20"
            style={{ transform: 'translateY(10px)' }}
          >
            <img 
              src="/assets/arrow.png" 
              alt="Back" 
              className="w-20 h-20 object-contain"
              style={{ transform: 'scaleX(-1)' }}
            />
          </button>
          
          {/* Character Names on Rectangle */}
          <div className="absolute inset-0 flex items-center justify-center px-8 -top-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
              {characters.map((character) => (
                <div key={character.value} className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleCharacterSelect(character.value)}
                    onMouseEnter={() => setHoveredCharacter(character.value)}
                    onMouseLeave={() => setHoveredCharacter('')}
                    className={`relative appearance-none border-0 bg-transparent p-0 transition-all duration-200 ${
                      selectedCharacter === character.value
                        ? 'scale-105'
                        : 'hover:scale-102'
                    }`}
                    style={
                      character.value === 'bubbles'
                        ? { transform: 'translateY(-20px) rotate(3deg)' }
                        : character.value === 'rocco'
                          ? { transform: 'translateY(-5px) rotate(3deg)' }
                          : character.value === 'mimi'
                            ? { transform: 'translateY(10px) rotate(3deg)' }
                          : undefined
                    }
                  >
                    <p
                      className={`text-5xl font-bold ${character.nameClassName}`}
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
                      className={`mt-2 text-center text-2xl ${character.descriptionClassName}`}
                      style={{
                        fontFamily: "'Chewy', cursive",
                        color: isCharacterActive(character.value) ? character.hoverColor : '#FFFFFF',
                        opacity: isCharacterActive(character.value) ? 1 : 0.72,
                        transition: 'color 180ms ease, opacity 180ms ease',
                      }}
                    >
                      {character.description}
                    </p>
                    {selectedCharacter === character.value && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Character Images Below Rectangle */}
      <div className="absolute left-0 right-0 z-10" style={{ top: 'calc(33.08% + 14%)' }}>
        <div className="flex justify-center px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20 w-full max-w-5xl">
            {characters.map((character) => (
              <button
                key={character.value}
                type="button"
                onClick={() => handleCharacterSelect(character.value)}
                className={`relative flex justify-center appearance-none border-0 bg-transparent p-0 transition-all duration-200 ${
                  selectedCharacter === character.value
                    ? 'scale-105'
                    : 'hover:scale-102'
                }`}
              >
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-96 h-96 md:w-[28rem] md:h-[28rem] object-contain"
                  style={{
                    opacity: isCharacterActive(character.value) ? 1 : 0.72,
                    transition: 'opacity 180ms ease',
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

      {/* Forward Arrow Button */}
      <div className="absolute right-12 top-1/3 z-20">
        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={loading || !selectedCharacter}
          className="appearance-none border-0 bg-transparent p-0 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img 
            src="/assets/arrow.png" 
            alt="Continue" 
            className="w-20 h-20 object-contain"
          />
        </button>
      </div>
    </div>
  );
};

export default ChildCharacterSetup;
