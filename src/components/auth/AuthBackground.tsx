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

  return (
    <div
      data-auth-shell="true"
      className={`relative flex min-h-screen w-full flex-col items-center justify-start overflow-x-hidden bg-[#dcecb7] px-4 pb-8 pt-20 sm:px-6 sm:pt-24 lg:justify-center lg:px-8 lg:pb-10 ${className}`}
    >
      <img
        src={backgroundUrl}
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="async"
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-300 ${backgroundLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
      {assetsReady ? (
        children
      ) : (
        <div className="relative z-10 flex min-h-[40vh] w-full items-center justify-center">
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
