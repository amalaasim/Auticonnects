import React, { useEffect, useState } from 'react';
import LoadingWheel from '@/components/LoadingWheel';

interface AuthBackgroundProps {
  children: React.ReactNode;
  backgroundUrl?: string;
  className?: string;
  assetUrls?: string[];
}

const AuthBackground: React.FC<AuthBackgroundProps> = ({
  children,
  backgroundUrl = '/assets/mascot.png',
  className = '',
  assetUrls = [],
}) => {
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.onload = () => setBackgroundLoaded(true);
    image.onerror = () => setBackgroundLoaded(true);
    image.src = backgroundUrl;

    if (typeof image.decode === 'function') {
      image.decode().then(() => setBackgroundLoaded(true)).catch(() => {});
    }
  }, [backgroundUrl]);

  useEffect(() => {
    const preloadAsset = (src: string) =>
      new Promise<void>((resolve) => {
        const image = new Image();
        image.onload = () => resolve();
        image.onerror = () => resolve();
        image.src = src;

        if (typeof image.decode === 'function') {
          image.decode().then(() => resolve()).catch(() => {});
        }
      });

    let cancelled = false;
    const urls = Array.from(new Set([backgroundUrl, ...assetUrls].filter(Boolean)));

    Promise.all(urls.map(preloadAsset)).then(() => {
      if (!cancelled) {
        setAssetsReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [backgroundUrl, assetUrls]);

  useEffect(() => {
    let cancelled = false;

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready
        .then(() => {
          if (!cancelled) {
            setFontsReady(true);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setFontsReady(true);
          }
        });
    } else {
      setFontsReady(true);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!assetsReady || !fontsReady) {
      setContentVisible(false);
      return;
    }

    let frame1 = 0;
    let frame2 = 0;
    frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => {
        setContentVisible(true);
      });
    });

    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
    };
  }, [assetsReady, fontsReady]);

  return (
    <div
      data-auth-shell="true"
      className={`relative flex h-[100dvh] min-h-[100dvh] w-full flex-col items-center justify-start overflow-x-hidden bg-[#dcecb7] px-4 pb-8 pt-20 [container-type:size] sm:px-6 sm:pt-24 lg:justify-center lg:px-8 lg:pb-10 ${className}`}
    >
      <img
        src={backgroundUrl}
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="async"
        className={`pointer-events-none absolute inset-0 h-full w-full object-fill object-center transition-opacity duration-300 ${backgroundLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 top-0 z-0"
        style={{
          height: '10cqh',
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.656) 6.88%, rgba(0, 0, 0, 0) 94.56%)',
        }}
      />
      {contentVisible ? (
        children
      ) : (
        <div className="relative z-10 flex min-h-[40dvh] w-full items-center justify-center">
          <LoadingWheel
            size={96}
            text="Loading..."
            textClassName="rounded-2xl bg-[rgba(255,255,255,0.18)] px-6 py-3 font-['Chewy'] text-[clamp(1rem,1.8vw,1.5rem)] text-[#6b3f16] shadow-lg backdrop-blur-sm"
          />
        </div>
      )}
    </div>
  );
};

export default AuthBackground;
