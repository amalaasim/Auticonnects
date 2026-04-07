import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LoadingWheel from '@/components/LoadingWheel';
import { User, Search, RotateCcw, Settings } from 'lucide-react';

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
      <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center" style={{ backgroundImage: 'url(/assets/child-profile-bg-1.png)' }}>
        <LoadingWheel size={92} />
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
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10">
        <div className="relative w-full max-w-4xl">
          <img 
            src="/assets/language-board.png" 
            alt="Language Board" 
            className="w-full h-auto"
          />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center px-12 py-16">
            <div className="w-full relative h-full">
              <button 
                type="button" 
                onClick={() => handleLanguageSelect('english')} 
                disabled={loading}
                className="text-white font-bold py-4 px-8 rounded-lg text-6xl transition-opacity disabled:opacity-50 disabled:cursor-not-allowed absolute top-[20%] left-1/2 transform -translate-x-1/2"
                style={{ fontFamily: "'Chewy', cursive" }}
              >
                English
              </button>

              <button 
                type="button" 
                onClick={() => handleLanguageSelect('urdu')} 
                disabled={loading}
                className="text-white font-bold py-4 px-8 rounded-lg text-6xl transition-opacity disabled:opacity-50 disabled:cursor-not-allowed absolute bottom-1/4 right-1/2 transform translate-x-1/2"
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
