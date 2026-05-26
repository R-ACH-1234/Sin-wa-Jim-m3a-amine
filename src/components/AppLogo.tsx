import React, { useState } from 'react';
import logoPng from '../logo.png';
import logoJpg from '../logo.jpg';

interface AppLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function AppLogo({ className = '', size = 'md' }: AppLogoProps) {
  const [logoSrc, setLogoSrc] = useState(logoPng);
  const [hasError, setHasError] = useState(false);

  // Determine width and height classes based on sizing
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48 md:w-56 md:h-56',
  };

  const selectedSize = sizeClasses[size];

  const handleImageError = () => {
    if (logoSrc === logoPng) {
      setLogoSrc(logoJpg);
    } else {
      setHasError(true);
    }
  };

  return (
    <div 
      id="app-custom-logo-container" 
      className={`inline-block select-none relative filter drop-shadow-[0_8px_20px_rgba(4,120,87,0.15)] ${selectedSize} ${className}`}
    >
      {!hasError ? (
        <img 
          src={logoSrc} 
          alt="لوغو سين وجيم"
          id="custom-logo-image"
          className="w-full h-full object-contain rounded-2xl"
          onError={handleImageError}
          referrerPolicy="no-referrer"
        />
      ) : (
        // Minimal elegant text capsule fallback
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 border-2 border-amber-500 flex items-center justify-center shadow-lg text-center p-2">
          <span className="font-display font-black text-amber-500 text-lg md:text-xl transform leading-none">
            س وج
          </span>
        </div>
      )}
    </div>
  );
}

