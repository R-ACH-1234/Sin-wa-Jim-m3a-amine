import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function AppLogo({ className = '', size = 'md' }: AppLogoProps) {
  // Determine width and height classes based on sizing
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48 md:w-56 md:h-56',
  };

  const selectedSize = sizeClasses[size];

  return (
    <div 
      id="app-custom-logo-container" 
      className={`inline-block select-none relative filter drop-shadow-[0_8px_20px_rgba(4,120,87,0.15)] ${selectedSize} ${className}`}
    >
      <img 
        src="/logo.png" 
        alt="لوغو سين وجيم"
        id="custom-logo-image"
        className="w-full h-full object-contain rounded-2xl"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

