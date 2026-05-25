import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function AppLogo({ className = '', size = 'md' }: AppLogoProps) {
  // Determine width and height classes based on sizing
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48 md:w-56 md:h-56',
  };

  const selectedSize = sizeClasses[size];

  return (
    <div id="app-logo-container" className={`inline-block select-none relative filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.15)] ${selectedSize} ${className}`}>
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Emerald Green gradient for Moroccan background */}
          <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#064e40" />
            <stop offset="50%" stopColor="#022c22" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Premium Gold gradient for frames/borders */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="30%" stopColor="#FBBF24" />
            <stop offset="70%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Red banner gradient representing Morocco's flag */}
          <linearGradient id="bannerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#991b1b" />
            <stop offset="50%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>

          {/* Text gradients */}
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          <linearGradient id="brandYGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>

          <linearGradient id="brandGGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Filter for glowing effects */}
          <filter id="goldGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. MOROCCAN ISLAMIC GEOMETRIC ENCLOSURE (Zellij Pattern Silhouette) */}
        {/* Base rotated square 1 */}
        <rect
          x="75"
          y="75"
          width="350"
          height="350"
          rx="60"
          fill="url(#emeraldGrad)"
          stroke="url(#goldGrad)"
          strokeWidth="8"
        />
        {/* Base rotated square 2 (creates the octagram star layout) */}
        <rect
          x="75"
          y="75"
          width="350"
          height="350"
          rx="60"
          transform="rotate(45 250 250)"
          fill="url(#emeraldGrad)"
          stroke="url(#goldGrad)"
          strokeWidth="8"
          strokeLinejoin="round"
          className="fill-opacity-95"
        />

        {/* Concentric inner octagram line */}
        <rect
          x="90"
          y="90"
          width="320"
          height="320"
          rx="50"
          stroke="url(#goldGrad)"
          strokeWidth="2"
          strokeDasharray="4,4"
          fill="none"
          transform="rotate(45 250 250)"
        />

        {/* 2. SILHOUETTED MOROCCAN KOUTOUBIA TOWER (Left Background) */}
        <g opacity="0.15" transform="translate(110, 150) scale(0.6)">
          <rect x="0" y="50" width="80" height="230" fill="#ffffff" />
          <rect x="-10" y="270" width="100" height="15" fill="#ffffff" />
          <rect x="10" y="0" width="60" height="50" fill="#ffffff" />
          <polygon points="40,-50 10,0 70,0" fill="#ffffff" />
          <line x1="40" y1="-50" x2="40" y2="280" stroke="#000000" strokeWidth="2" />
        </g>

        {/* 3. MOROCCAN RED FLAG WITH GREEN STAR */}
        <g transform="translate(90, 110) rotate(-10)">
          {/* Flagpole */}
          <line x1="20" y1="20" x2="20" y2="110" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
          <circle cx="20" cy="18" r="4" fill="#FBBF24" />
          {/* Flag fabric */}
          <path d="M20,25 Q45,20 70,30 Q95,40 120,30 L120,70 Q95,80 70,70 Q45,60 20,65 Z" fill="#DC2626" />
          {/* Moroccan Green Pentagram (Sulayman Star) */}
          <polygon points="70,42 74,54 85,54 76,61 79,72 70,65 61,72 64,61 55,54 66,54" fill="none" stroke="#059669" strokeWidth="3" strokeLinejoin="round" />
        </g>

        {/* 4. SYMBOLS OF KNOWLEDGE, INSPIRATION, & SUCCESS */}
        {/* Open Book of Knowledge (Right Center) */}
        <g transform="translate(330, 190) scale(0.85)">
          <path d="M10,25 Q35,15 60,25" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M60,25 Q85,15 110,25" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M10,25 L10,65 Q35,55 60,65 L60,25" fill="#FFFFFF" fillOpacity="0.15" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M60,25 L60,65 Q85,55 110,65 L110,25" fill="#FFFFFF" fillOpacity="0.15" stroke="#FFFFFF" strokeWidth="2" />
          {/* Book bookmark binding ribbon */}
          <line x1="60" y1="25" x2="60" y2="75" stroke="#FBBF24" strokeWidth="4" />
        </g>

        {/* Golden Trophy (Right Low) */}
        <g transform="translate(370, 240) scale(0.8)">
          <path d="M15,10 h50 v25 q0,25 -25,25 q-25,0 -25,-25 Z" fill="url(#goldGrad)" stroke="#F59E0B" strokeWidth="2" />
          <path d="M15,18 h-10 v12 q0,5 10,2 Z" fill="none" stroke="url(#goldGrad)" strokeWidth="4" strokeLinecap="round" />
          <path d="M65,18 h10 v12 q0,5 -10,2 Z" fill="none" stroke="url(#goldGrad)" strokeWidth="4" strokeLinecap="round" />
          <rect x="35" y="60" width="10" height="15" fill="none" stroke="url(#goldGrad)" strokeWidth="4" />
          <rect x="25" y="75" width="30" height="8" fill="url(#goldGrad)" rx="2" />
        </g>

        {/* Glowing Intellect Light Bulb */}
        <g transform="translate(360, 110) scale(0.9)">
          <circle cx="30" cy="30" r="18" fill="#FBBF24" fillOpacity="0.1" stroke="#FDE047" strokeWidth="3" />
          <path d="M22,44 h16 L35,50 h-10 Z" fill="#94A3B8" />
          <path d="M26,50 h8 v4 h-8 Z" fill="#64748B" />
          {/* Glowing filaments */}
          <path d="M30,12 L30,6 M30,48 L30,42" stroke="#FDE047" strokeWidth="2" />
          <path d="M12,30 L6,30 M48,30 L42,30" stroke="#FDE047" strokeWidth="2" />
        </g>

        {/* Glowing Golden Question Mark */}
        <g transform="translate(290, 80) scale(1.1)">
          <text
            x="0"
            y="50"
            fontFamily="sans-serif"
            fontWeight="900"
            fontSize="55"
            fill="url(#goldGrad)"
            filter="url(#goldGlow)"
            textAnchor="middle"
          >
            ؟
          </text>
        </g>

        {/* 5. CHEERFUL MOROCCAN BOY CHARACTER ("AMIN") AT CENTER */}
        <g transform="translate(0, 0)">
          {/* Hair back */}
          <circle cx="250" cy="165" r="50" fill="#1e1b4b" />
          <circle cx="215" cy="155" r="18" fill="#1e1b4b" />
          <circle cx="285" cy="155" r="18" fill="#1e1b4b" />
          <circle cx="250" cy="125" r="22" fill="#1e1b4b" />

          {/* Ears */}
          <circle cx="192" cy="195" r="14" fill="#fbcfe8" />
          <circle cx="192" cy="195" r="8" fill="#fda4af" />
          <circle cx="308" cy="195" r="14" fill="#fbcfe8" />
          <circle cx="308" cy="195" r="8" fill="#fda4af" />

          {/* Face */}
          <path
            d="M 195 195 Q 195 260 250 260 Q 305 260 305 195 Z"
            fill="#fecdd3"
          />
          {/* Forehead / cheecks rounding */}
          <circle cx="250" cy="180" r="50" fill="#fecdd3" />

          {/* Curly brown hair overlaps on forehead */}
          <circle cx="215" cy="135" r="14" fill="#1e1b4b" />
          <circle cx="235" cy="130" r="15" fill="#1e1b4b" />
          <circle cx="255" cy="132" r="14" fill="#1e1b4b" />
          <circle cx="275" cy="135" r="15" fill="#1e1b4b" />
          <circle cx="202" cy="148" r="12" fill="#1e1b4b" />
          <circle cx="298" cy="148" r="12" fill="#1e1b4b" />

          {/* Friendly Eyebrows */}
          <path d="M 210,172 Q 222,164 232,171" stroke="#1e1b4b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M 290,172 Q 278,164 268,171" stroke="#1e1b4b" strokeWidth="4.5" strokeLinecap="round" fill="none" />

          {/* Big Sparkly Eyes based on traditional Moroccan warmth */}
          <circle cx="225" cy="188" r="11" fill="#312e81" />
          <circle cx="225" cy="188" r="9" fill="#1e1b4b" />
          <circle cx="222" cy="184" r="3.5" fill="#FFFFFF" /> {/* Sparkle */}
          <circle cx="228" cy="192" r="1.5" fill="#FFFFFF" />

          <circle cx="275" cy="188" r="11" fill="#312e81" />
          <circle cx="275" cy="188" r="9" fill="#1e1b4b" />
          <circle cx="272" cy="184" r="3.5" fill="#FFFFFF" /> {/* Sparkle */}
          <circle cx="278" cy="192" r="1.5" fill="#FFFFFF" />

          {/* Humble Nose */}
          <path d="M 245,198 Q 250,206 255,198" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Energetic bright Smile */}
          <path d="M 230,222 Q 250,238 270,222" stroke="#e11d48" strokeWidth="4.5" fill="#FFFFFF" strokeLinecap="round" />
          <path d="M 233,223 Q 250,234 267,223" fill="#fda4af" />

          {/* Rosy Cheeks */}
          <circle cx="206" cy="210" r="10" fill="#f43f5e" fillOpacity="0.25" />
          <circle cx="294" cy="210" r="10" fill="#f43f5e" fillOpacity="0.25" />

          {/* Thumb Up Hand gesture (Left Side of Boy) */}
          <g transform="translate(132, 210) scale(0.95)">
            {/* Denim jacket sleeve */}
            <path d="M15,50 L42,32 L56,58 L28,74 Z" fill="#2563EB" stroke="#1D4ED8" strokeWidth="2" />
            {/* Hand thumb-up outline */}
            <path d="M48,32 Q54,12 62,14 Q68,16 63,32 L68,34 Q76,35 74,42 Q72,48 64,48 L64,54" fill="#fecdd3" stroke="#e11d48" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Clenched fingers */}
            <path d="M60,34 Q67,31 66,38 Q65,44 58,42" fill="#fecdd3" stroke="#e11d48" strokeWidth="1.5" />
            <path d="M58,40 Q65,37 64,44 Q63,49 56,47" fill="#fecdd3" stroke="#e11d48" strokeWidth="1.5" />
            <path d="M55,46 Q62,43 60,50 Q58,54 52,52" fill="#fecdd3" stroke="#e11d48" strokeWidth="1.5" />
            {/* Thumbs up badge */}
            <span className="hidden">👍</span>
          </g>

          {/* Over-shirt (Blue Denim Jacket) */}
          <path d="M190,250 C180,270 185,340 185,340 L315,340 C315,340 320,270 310,250 Z" fill="#2563EB" />
          {/* T-Shirt under (white with color accents) */}
          <path d="M225,251 Q250,272 275,251" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          {/* T-shirt graphical print */}
          <circle cx="250" cy="285" r="18" fill="#FBBF24" />
          <text x="250" y="291" fontSize="18" fontWeight="bold" fill="#000000" textAnchor="middle">🏆</text>

          {/* Golden Collar zipper/buttons */}
          <circle cx="215" cy="280" r="4" fill="#FBBF24" />
          <circle cx="285" cy="280" r="4" fill="#FBBF24" />
        </g>

        {/* 6. SPECTACULAR 3D STYLIZED TEXT "سين وجيم" */}
        <g transform="translate(250, 360)">
          {/* Text Shadow for 3D depth effect */}
          <text
            x="0"
            y="10"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="950"
            fontSize="74"
            fill="#064e3b"
            textAnchor="middle"
            letterSpacing="-2"
          >
            سين وجيم
          </text>
          {/* Front gradient-filled bold Arabic title */}
          <text
            x="0"
            y="2"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="950"
            fontSize="74"
            fill="url(#brandGGrad)"
            stroke="url(#goldGrad)"
            strokeWidth="3.5"
            textAnchor="middle"
            letterSpacing="-2"
          >
            سين وجيم
          </text>
        </g>

        {/* 7. REVOLUTIONARY MOROCCAN RED RIBBON/BANNER (Underneath) */}
        <g transform="translate(0, 385)">
          {/* Left ribbon tail */}
          <polygon points="60,65 100,25 100,85" fill="#7f1d1d" />
          <polygon points="60,65 50,25 100,25" fill="#450a0a" />

          {/* Right ribbon tail */}
          <polygon points="440,65 400,25 400,85" fill="#7f1d1d" />
          <polygon points="440,65 450,25 400,25" fill="#450a0a" />

          {/* Center banner piece */}
          <path
            d="M 100,25 Q 250,45 400,25 L 400,75 Q 250,95 100,75 Z"
            fill="url(#bannerGrad)"
            stroke="url(#goldGrad)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Little green Moroccan star decoration on both sides of banner */}
          <g transform="translate(130, 52) scale(0.6)">
            <polygon points="0,-15 4,-3 15,-3 6,5 9,17 0,9 -9,17 -6,5 -15,-3 -4,-3" fill="#047857" stroke="#FDE047" strokeWidth="1" />
          </g>
          <g transform="translate(370, 52) scale(0.6)">
            <polygon points="0,-15 4,-3 15,-3 6,5 9,17 0,9 -9,17 -6,5 -15,-3 -4,-3" fill="#047857" stroke="#FDE047" strokeWidth="1" />
          </g>

          {/* Red Banner Arabic Text: "مع أمين" */}
          <text
            x="250"
            y="61"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="30"
            fill="url(#brandYGrad)"
            filter="url(#goldGlow)"
            textAnchor="middle"
          >
            مع أمين
          </text>
        </g>

        {/* 8. MINI DETAILED GEOMETRIC STAR FOOTER */}
        <g transform="translate(250, 465) scale(0.7)">
          <rect x="-20" y="-20" width="40" height="40" fill="url(#goldGrad)" transform="rotate(22.5)" />
          <rect x="-18" y="-18" width="36" height="36" fill="#065f46" transform="rotate(22.5)" />
          <rect x="-20" y="-20" width="40" height="40" fill="url(#goldGrad)" transform="rotate(45)" />
          <rect x="-18" y="-18" width="36" height="36" fill="#065f46" transform="rotate(45)" />
          <circle cx="0" cy="0" r="8" fill="#FBBF24" />
        </g>
      </svg>
    </div>
  );
}
