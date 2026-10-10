import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { hasParentalConsent } from '@/utils/onboarding';
import ChildProfileHeader from '@/components/ChildProfileHeader';
import LoadingWheel from '@/components/LoadingWheel';

const ChildNameSetup: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [childName, setChildName] = useState('');
  const [loading, setLoading] = useState(false);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const childNameInputRef = useRef<HTMLInputElement | null>(null);

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

  useEffect(() => {
    if (authLoading) return;

    const focusInput = () => {
      const input = childNameInputRef.current;
      if (!input || document.activeElement === input) return;
      input.focus({ preventScroll: true });
    };

    const frameId = window.requestAnimationFrame(focusInput);
    const timeoutIds = [150, 400, 800, 1400, 2200].map((delay) =>
      window.setTimeout(focusInput, delay)
    );

    return () => {
      window.cancelAnimationFrame(frameId);
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [authLoading]);

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
    <div className="h-[100dvh] min-h-[100dvh] w-full relative overflow-x-hidden overflow-y-visible [container-type:size]">
      <img
        src="/assets/child-profile-bg-1.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-fill object-center"
      />
      {/* Header */}
      <ChildProfileHeader />

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
          
          {/* Name field: sits in the right half of the bar (original design), ending before the next button. */}
          <div
            className="absolute left-[53%] right-[13%] top-[47cqh] flex items-center mport:left-[38%]"
            style={{ transform: 'translateY(-1.2cqh) rotate(2deg)' }}
          >
            {/* Our own blinking caret stands in for the native one until the parent starts typing,
                so only one caret is ever visible. */}
            {!childName && (
              <span className="child-profile-fake-caret child-profile-name-caret" aria-hidden="true" />
            )}
            <input
              ref={childNameInputRef}
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Enter your child's name"
              className={`child-profile-text-input w-full min-w-0 border-none bg-transparent pl-[1.6cqh] text-[max(16px,20.8cqh)] leading-[1.2] text-[#D5EADC] placeholder:text-[#D5EADC]/60 focus:outline-none`}
              style={{
                fontFamily: "'Chewy', cursive",
                // Inline so it beats the .child-profile-text-input caret-color rule in index.css.
                caretColor: childName ? undefined : "transparent",
              }}
              autoComplete="off"
              required
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading || !childName.trim()}
            className="absolute right-[5%] top-[47cqh] flex-shrink-0 appearance-none border-0 bg-transparent p-0 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            style={{ transform: 'translateY(-3.2cqh) rotate(-6deg)' }}
          >
            <img src="/ui/next-button.png" alt="Submit" className="h-[35cqh] w-[35cqh] object-contain" />
          </button>
        </form>
      </div>

      {/* Footer - Logo */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-8 z-10 mland:pb-3">
        <img src="/assets/logo.png" alt="Auti-Connects Logo" className="w-64 h-auto mland:w-44" />
      </div>
    </div>
  );
};

export default ChildNameSetup;
