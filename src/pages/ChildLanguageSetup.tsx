import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LoadingWheel from '@/components/LoadingWheel';
import { User, Search, RotateCcw, Settings } from 'lucide-react';

const backgroundFrameStyle = {
  width: 'max(100vw, calc(100vh * (1440 / 1026)))',
  height: 'max(100vh, calc(100vw * (1026 / 1440)))',
  flexShrink: 0,
} as const;

const ChildLanguageSetup: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
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
    const age = sessionStorage.getItem('childAge');
    const character = sessionStorage.getItem('favoriteCharacter');
    if (!name || !age || !character) {
      navigate('/child-profile/name');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (language: string) => {
    if (loading) return;
    
    playClickSound();
    setLoading(true);

    const childName = sessionStorage.getItem('childName');
    const childAge = sessionStorage.getItem('childAge');
    let favoriteCharacter = sessionStorage.getItem('favoriteCharacter');

    if (!childName || !childAge || !favoriteCharacter || !user?.id) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Missing profile information. Please start over.',
      });
      setLoading(false);
      navigate('/child-profile/name');
      return;
    }

    if (favoriteCharacter === 'mimmi') {
      favoriteCharacter = 'mimi';
    }

    const validCharacters = ['bubbles', 'rocco', 'mimi'];
    const validLanguages = ['english', 'urdu'];
    
    if (!validCharacters.includes(favoriteCharacter)) {
      toast({
        variant: 'destructive',
        title: 'Invalid Character',
        description: `Invalid character value: ${favoriteCharacter}. Please select again.`,
      });
      setLoading(false);
      navigate('/child-profile/character');
      return;
    }

    if (!validLanguages.includes(language)) {
      toast({
        variant: 'destructive',
        title: 'Invalid Language',
        description: `Invalid language value: ${language}. Please select again.`,
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        child_name: childName,
        child_age: parseInt(childAge, 10),
        favorite_character: favoriteCharacter,
        language: language,
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

    toast({
      title: 'Profile Complete!',
      description: 'Welcome to Auti-Connects!',
    });

    setLoading(false);
    navigate('/');
  };

  const handleBack = () => {
    playClickSound();
    navigate('/child-profile/character');
  };

  const handleLanguageSelect = (value: string) => {
    handleSubmit(value);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
          <div className="relative" style={backgroundFrameStyle}>
            <img
              src="/assets/child-profile-bg-1.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full object-fill object-center"
            />
          </div>
        </div>
        <div className="relative z-10 flex items-center justify-center">
          <LoadingWheel size={92} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden [container-type:size]">
      <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
        <div className="relative" style={backgroundFrameStyle}>
          <img
            src="/assets/child-profile-bg-1.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-fill object-center"
          />
        </div>
      </div>
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

      {/* Main Content - Language Board */}
      <div 
        className="absolute bottom-[5%] left-1/2 z-10 w-[68vmin] -translate-x-1/2 aspect-[1721/1454] pointer-events-auto"
      >
        <div className="relative h-full w-full">
          <img 
            src="/assets/language-board.png" 
            alt="Language Board" 
            className="absolute inset-0 h-full w-full object-contain pointer-events-none"
          />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 py-[8%]">
            <div className="w-full relative h-full flex flex-col items-center justify-center gap-4 sm:gap-[3cqh]">
              <button 
                type="button" 
                onClick={() => handleLanguageSelect('english')} 
                disabled={loading}
                className="text-white font-bold py-2 px-6 sm:py-[1.5cqh] sm:px-[4cqh] rounded-lg text-[4vh] sm:text-[4.5cqh] lg:text-[5cqh] transition-opacity disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                style={{ fontFamily: "'Chewy', cursive" }}
              >
                English
              </button>

              <button 
                type="button" 
                onClick={() => handleLanguageSelect('urdu')} 
                disabled={loading}
                className="text-white font-bold py-2 px-6 sm:py-[1.5cqh] sm:px-[4cqh] rounded-lg text-[4vh] sm:text-[4.5cqh] lg:text-[5cqh] transition-opacity disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                style={{ fontFamily: "'Chewy', cursive" }}
              >
                Urdu
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Logo */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-8 z-10">
        <img src="/assets/logo.png" alt="Auti-Connects Logo" className="w-64 h-auto" />
      </div>
    </div>
  );
};

export default ChildLanguageSetup;
