import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Search, RotateCcw, Settings, Check } from 'lucide-react';

const ChildCharacterSetup: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
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
    { name: 'Bubbles', value: 'bubbles', image: '/assets/bubbles.png' },
    { name: 'Rocco', value: 'rocco', image: '/assets/rocco.png' },
    { name: 'Mimmi', value: 'mimi', image: '/assets/mimmi.png' },
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

        {/* Right side - Icons */}
        <div className="flex gap-4">
          <button onClick={playClickSound} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <User className="w-5 h-5 text-white" />
          </button>
          <button onClick={playClickSound} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <Search className="w-5 h-5 text-white" />
          </button>
          <button onClick={playClickSound} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <RotateCcw className="w-5 h-5 text-white" />
          </button>
          <button onClick={playClickSound} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <Settings className="w-5 h-5 text-white" />
          </button>
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
            className="absolute left-12 top-12 transition-opacity hover:opacity-80 z-20"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
              {characters.map((character, index) => (
                <div key={character.value} className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleCharacterSelect(character.value)}
                    className={`relative transition-all duration-200 ${
                      selectedCharacter === character.value
                        ? 'scale-105'
                        : 'hover:scale-102'
                    }`}
                  >
                    <p className="text-white font-bold text-5xl" style={{ fontFamily: "'Chewy', cursive" }}>
                      {character.name}
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
      <div className="absolute left-0 right-0 z-10" style={{ top: 'calc(33.08% + 18.62%)' }}>
        <div className="flex justify-center px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
            {characters.map((character) => (
              <button
                key={character.value}
                type="button"
                onClick={() => handleCharacterSelect(character.value)}
                className={`relative transition-all duration-200 flex justify-center ${
                  selectedCharacter === character.value
                    ? 'scale-105'
                    : 'hover:scale-102'
                }`}
              >
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-72 h-72 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'w-48 h-48 bg-white/20 rounded flex items-center justify-center text-white font-bold text-xl';
                    fallback.textContent = character.name.charAt(0);
                    target.parentNode?.appendChild(fallback);
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
          className="transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img 
            src="/assets/arrow.png" 
            alt="Continue" 
            className="w-20 h-20 object-contain"
          />
        </button>
      </div>

      {/* Footer - Logo */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-8 z-10">
        <img src="/assets/logo.png" alt="Auti-Connects Logo" className="w-64 h-auto" />
      </div>
    </div>
  );
};

export default ChildCharacterSetup;
