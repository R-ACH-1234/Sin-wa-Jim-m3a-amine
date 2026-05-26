import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuizStore } from '../store/useQuizStore';
import { soundEffects } from '../utils/audio';
import { 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon as MoonIcon, 
  ShieldAlert, 
  ArrowLeft, 
  Trophy, 
  User, 
  Home, 
  Compass, 
  Sliders, 
  Flame,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AppLogo from './AppLogo';

interface MoroccanLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  backTo?: string;
  title?: string;
}

export default function MoroccanLayout({ 
  children, 
  showBackButton = false, 
  backTo, 
  title 
}: MoroccanLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, soundEnabled, theme, setSoundEnabled, toggleTheme } = useQuizStore();
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleSoundToggle = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      soundEffects.playClick();
    }
  };

  const handleThemeToggle = () => {
    if (soundEnabled) soundEffects.playClick();
    toggleTheme();
  };

  const handleAdminAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminCode === 'rachid1234' || adminCode === 'AMINE-ADMIN-2026') {
      setShowAdminPrompt(false);
      setAdminCode('');
      setAdminError('');
      if (soundEnabled) soundEffects.playFanfare();
      navigate('/admin');
    } else {
      if (soundEnabled) soundEffects.playWrong();
      setAdminError('الرمز السري غير صحيح!');
    }
  };

  const currentPath = location.pathname;
  const isQuizPage = currentPath.startsWith('/quiz');

  return (
    <div className={`min-h-screen flex flex-col items-center justify-between font-sans select-none overflow-x-hidden relative transition-colors duration-500 ${
      theme === 'dark' 
        ? (isQuizPage ? 'bg-[#0d2d23] text-slate-100' : 'bg-[#030c0a] text-slate-100') 
        : 'bg-[#fcfaf5] text-emerald-950'
    }`}>
      
      {/* 1. LAYERED BACKGROUND FOR MODERN MOROCCAN ELEGANCE */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        
        {/* Soft elegant gradient backdrop */}
        <div className={`absolute inset-0 transition-all duration-700 ${
          theme === 'dark' 
            ? (isQuizPage 
                ? 'bg-gradient-to-b from-[#144335] via-[#0e3126] to-[#082019]' 
                : 'bg-gradient-to-b from-[#020b08] via-[#051411] to-[#0a1820]') 
            : (isQuizPage
                ? 'bg-gradient-to-b from-[#fbf9f2] via-[#f5efe3] to-[#ebdcc4]'
                : 'bg-gradient-to-b from-[#fbf9f4] via-[#f7f3ec] to-[#ebdcc8]')
        }`} />

        {/* Delicate premium geometric Zellij lattice watermarked pattern */}
        <div className={`absolute inset-0 opacity-[0.035] ${
          theme === 'dark' 
            ? 'bg-[radial-gradient(#d97706_1px,transparent_1px)]' 
            : 'bg-[radial-gradient(#047857_1px,transparent_1px)]'
        } [background-size:20px_20px]`} />

        {/* Giant Watermarked Background Logo (Subtle, elegant background element for game immersion) */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-[500px] sm:h-[500px] pointer-events-none select-none z-0 flex items-center justify-center transition-all duration-700 ${
          theme === 'dark'
            ? (isQuizPage ? 'opacity-[0.14]' : 'opacity-[0.04]')
            : (isQuizPage ? 'opacity-[0.16]' : 'opacity-[0.06]')
        }`}>
          <motion.img 
            animate={isQuizPage ? { rotate: 0 } : { rotate: 360 }}
            transition={isQuizPage ? { duration: 0.8, ease: "easeOut" } : { repeat: Infinity, duration: 80, ease: "linear" }}
            src="/logo.png"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/logo.jpg';
            }}
            alt="Logo background watermark"
            className="w-full h-full object-contain filter select-none rounded-[32px]"
          />
        </div>

        {/* Ambient top glowing aura */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full filter blur-[100px] opacity-[0.14] transition-all duration-700 ${
          theme === 'dark' ? 'bg-amber-400' : 'bg-emerald-500'
        }`} />

        {/* Subtle Moroccan Hanging brass lantern representation (Top Right edge) - scaled smaller for no overlap */}
        <motion.div
          animate={{ rotate: [-1.5, 1.5, -1.5] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          style={{ transformOrigin: 'top center' }}
          className="absolute top-0 right-6 md:right-12 z-0 opacity-40 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        >
          <svg className={`w-8 h-20 ${theme === 'dark' ? 'text-amber-500/80' : 'text-emerald-700/60'}`} viewBox="0 0 100 240" fill="currentColor">
            <line x1="50" y1="0" x2="50" y2="90" stroke="currentColor" strokeWidth="4" />
            <path d="M 30 90 L 70 90 L 60 75 L 40 75 Z" />
            <circle cx="50" cy="100" r="12" />
            <path d="M 20 110 L 80 110 L 90 160 L 50 200 L 10 160 Z" />
            <circle cx="50" cy="150" r="15" fill={theme === 'dark' ? '#FBBF24' : '#10B981'} className="opacity-80" />
          </svg>
        </motion.div>
      </div>

      {/* 2. TOP HEADER COHESIVE SYSTEM BAR */}
      <header className={`w-full max-w-md px-4.5 pt-5 pb-4.5 flex items-center justify-between z-10 shrink-0 relative ${
        theme === 'dark' 
          ? 'border-b border-amber-500/10 bg-[#020b08]/40 backdrop-blur-md' 
          : 'border-b border-emerald-950/5 bg-white/45 backdrop-blur-md'
      }`}>
        
        {/* User Badge / Navigation Block */}
        <div className="flex items-center space-x-1 sm:space-x-2 space-x-reverse">
          {showBackButton ? (
            <button 
              onClick={() => {
                if (soundEnabled) soundEffects.playClick();
                if (backTo) navigate(backTo);
                else navigate(-1);
              }}
              className={`p-2 rounded-xl transition-all duration-300 border flex items-center justify-center hover:scale-105 active:scale-95 cursor-pointer ${
                theme === 'dark' 
                  ? 'bg-slate-900/80 border-amber-500/15 text-amber-400 hover:bg-slate-900' 
                  : 'bg-white border-emerald-900/10 text-emerald-800 hover:bg-slate-50'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : user ? (
            <div 
              onClick={() => {
                if (soundEnabled) soundEffects.playClick();
                navigate('/profile');
              }}
              className={`flex items-center space-x-1.5 space-x-reverse cursor-pointer p-1 sm:p-1.5 pr-2 sm:pr-2.5 rounded-xl transition-all border ${
                theme === 'dark' 
                  ? 'bg-[#101f1b]/60 border-emerald-800/20 hover:bg-[#101f1b]/90 text-amber-200' 
                  : 'bg-white/80 border-emerald-900/10 hover:bg-white text-emerald-950 shadow-sm'
              }`}
            >
              <div className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-sm shadow-sm shrink-0">
                {user.avatar || '🧑‍💻'}
              </div>
              <div className="text-right hidden min-[390px]:block">
                <div className="text-[8px] sm:text-[9px] opacity-70 leading-none">مستوى {user.level}</div>
                <div className="text-[10px] sm:text-[11px] font-bold leading-normal truncate max-w-[55px] sm:max-w-[70px]">{user.username}</div>
              </div>
            </div>
          ) : (
            <div className="font-bold text-amber-500 text-sm flex items-center space-x-1 space-x-reverse">
              <span className="text-emerald-500 font-extrabold">س</span>
              <span className="text-amber-500 font-extrabold">وج</span>
            </div>
          )}
          
          {/* User Streak display */}
          {user && (
            <div className={`p-1 sm:p-1.5 px-2 rounded-lg border flex items-center space-x-1 space-x-reverse max-[340px]:hidden ${
              theme === 'dark' 
                ? 'bg-orange-600/10 border-orange-500/25 text-orange-400' 
                : 'bg-amber-100/40 border-amber-500/15 text-amber-700'
            }`}>
              <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current animate-pulse text-orange-500" />
              <span className="text-[10px] sm:text-xs font-bold leading-none">{user.streakDays || 1}</span>
            </div>
          )}
        </div>

        {/* Center application titles */}
        <div className="text-center absolute left-1/2 -translate-x-1/2 pointer-events-none flex items-center justify-center space-x-1 sm:space-x-2 space-x-reverse">
          <AppLogo size="sm" className="w-6 h-6 sm:w-8 sm:h-8 drop-shadow-sm shrink-0 max-[410px]:hidden" />
          <h1 className={`font-black text-[10px] sm:text-xs tracking-wide transition-colors duration-300 ${
            theme === 'dark' ? 'text-amber-400' : 'text-emerald-900'
          }`}>
            {title || "سين وجيم"}
          </h1>
        </div>

        {/* HUD Toolbar controls */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 space-x-reverse">
          {/* Admin panel */}
          <button 
            onClick={() => {
              if (soundEnabled) soundEffects.playClick();
              setShowAdminPrompt(true);
            }}
            title="لوحة التحكم"
            className={`p-1.5 sm:p-2 rounded-lg border transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer max-[420px]:hidden ${
              theme === 'dark' 
                ? 'bg-slate-900/60 border-amber-500/15 text-yellow-400 hover:bg-slate-900' 
                : 'bg-white border-emerald-950/5 text-amber-900 hover:bg-slate-50 shadow-sm'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
          </button>

          {/* Theme setting toggle */}
          <button 
            onClick={handleThemeToggle}
            title={theme === 'dark' ? 'الوضع المضيء' : 'الوضع المظلم'}
            className={`p-1.5 sm:p-2 rounded-lg border transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
              theme === 'dark' 
                ? 'bg-slate-900/60 border-amber-500/15 text-amber-300 hover:bg-slate-900' 
                : 'bg-white border-emerald-950/5 text-emerald-800 hover:bg-slate-50 shadow-sm'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <MoonIcon className="w-3.5 h-3.5" />}
          </button>

          {/* SFX audio toggler */}
          <button 
            onClick={handleSoundToggle}
            title={soundEnabled ? 'كتم الصوت' : 'تفعيل الصوت'}
            className={`p-1.5 sm:p-2 rounded-lg border transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
              theme === 'dark' 
                ? 'bg-slate-900/60 border-amber-500/15 text-amber-300 hover:bg-slate-900' 
                : 'bg-white border-emerald-950/5 text-emerald-800 hover:bg-slate-50 shadow-sm'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* 3. CORE ROUTE CONTAINER - SPACIOUS AND HIGH-CONTRAST */}
      <main className="w-full max-w-md flex-1 px-4.5 py-5 flex flex-col justify-start overflow-y-auto overflow-x-hidden relative z-10 pb-24">
        {children}
      </main>

      {/* 4. FLOATING GLASS NAVIGATION CONTROL DOCK */}
      <footer className="w-full max-w-md px-4 pb-4.5 absolute bottom-0 inset-x-0 z-20 pointer-events-none">
        <div className={`w-full rounded-2xl border p-2 flex items-center justify-around shadow-xl pointer-events-auto transition-all ${
          theme === 'dark' 
            ? 'bg-[#04110e]/90 border-emerald-800/15 shadow-black/60' 
            : 'bg-white/95 border-emerald-900/10 shadow-emerald-950/10'
        }`}>
          {[
            { path: '/', label: 'الرئيسية', icon: Home },
            { path: '/categories', label: 'الأقسام', icon: Compass },
            { path: '/leaderboard', label: 'المتصدرين', icon: Trophy },
            { path: '/profile', label: 'بلادي', icon: User },
            { path: '/settings', label: 'الإعدادات', icon: Sliders }
          ].map((item, idx) => {
            const IconComponent = item.icon;
            const isSelected = currentPath === item.path;
            return (
              <button
                key={idx}
                onClick={() => {
                  if (soundEnabled) soundEffects.playClick();
                  navigate(item.path);
                }}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300 relative cursor-pointer ${
                  isSelected 
                    ? theme === 'dark' 
                      ? 'text-amber-400 bg-amber-500/10 font-bold' 
                      : 'text-emerald-900 bg-emerald-500/10 font-bold'
                    : theme === 'dark'
                      ? 'text-slate-400 hover:text-white'
                      : 'text-emerald-950/50 hover:text-emerald-950'
                }`}
              >
                <IconComponent className="w-4.5 h-4.5 mb-1" />
                <span className="text-[10px] font-bold leading-none">{item.label}</span>
                
                {/* Visual active slider bar indicator */}
                {isSelected && (
                  <motion.div 
                    layoutId="activeGlow" 
                    className="absolute -bottom-1 w-4.5 h-0.75 rounded-full bg-amber-500"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </footer>

      {/* 5. ADMIN AUTHENTICATION CARD PROMPT */}
      <AnimatePresence>
        {showAdminPrompt && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl border text-center transition-all ${
                theme === 'dark' 
                  ? 'bg-slate-900/95 border-amber-500/15 text-slate-100' 
                  : 'bg-white border-emerald-900/10 text-slate-900'
              }`}
            >
              <h2 className={`text-lg font-black mb-2 ${theme === 'dark' ? 'text-amber-400' : 'text-emerald-900'}`}>
                الدخول كمسؤول التحدي
              </h2>
              <p className="text-xs opacity-75 mb-5 leading-relaxed">
                المرجو إدخال الرمز السري الخاص بالمسؤول لتعديل أو إضافة الأسئلة الثقافية والمراحل.
              </p>

              <form onSubmit={handleAdminAccess} className="space-y-4 text-right">
                <input 
                  type="password"
                  placeholder="رمز المسؤول السري..."
                  value={adminCode}
                  onChange={(e) => {
                    setAdminCode(e.target.value);
                    setAdminError('');
                  }}
                  className={`w-full px-4 py-3 rounded-xl text-center font-mono focus:outline-none focus:ring-2 select-text text-base ${
                    theme === 'dark'
                      ? 'bg-slate-950 border border-amber-500/20 text-amber-300 focus:ring-amber-500'
                      : 'bg-slate-100 border border-slate-200 text-emerald-900 focus:ring-emerald-600'
                  }`}
                  autoFocus
                />

                {adminError && (
                  <p className="text-xs text-rose-500 text-center font-bold">{adminError}</p>
                )}

                <div className="flex space-x-2 space-x-reverse pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-black rounded-xl shadow-md hover:from-amber-500 hover:to-yellow-400 active:scale-95 transition-all text-xs cursor-pointer"
                  >
                    تأكيد الدخول
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (soundEnabled) soundEffects.playClick();
                      setShowAdminPrompt(false);
                      setAdminCode('');
                      setAdminError('');
                    }}
                    className={`px-4 py-3 rounded-xl text-xs font-bold transition-all focus:outline-none cursor-pointer ${
                      theme === 'dark' 
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
