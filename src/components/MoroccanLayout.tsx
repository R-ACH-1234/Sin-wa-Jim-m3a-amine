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

  return (
    <div className={`min-h-screen flex flex-col items-center justify-between text-slate-100 font-sans select-none overflow-x-hidden relative ${theme === 'dark' ? 'bg-[#050f1b]' : 'bg-[#f4efe6] text-amber-950'}`}>
      
      {/* BACKGROUND SCENERY (Vectored Moroccan Twilight) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        
        {/* Starry deep twilight sky gradient */}
        <div className={`absolute inset-0 transition-all duration-700 ${
          theme === 'dark' 
            ? 'bg-gradient-to-b from-[#030d1a] via-[#041a30] to-[#012423]' 
            : 'bg-gradient-to-b from-[#fcd9aa] via-[#fce6c5] to-[#ece1cc]'
        }`} />

        {/* Traditional Moroccan Mosaic/Zellige overlay */}
        <div className={`absolute inset-0 opacity-[0.06] ${
          theme === 'dark' ? 'bg-[radial-gradient(#b45309_1px,transparent_1px)]' : 'bg-[radial-gradient(#064e3b_1px,transparent_1px)]'
        } [background-size:16px_16px]`} />

        {/* Shining Crescent Moon & Stars */}
        <div className="absolute top-12 left-10 md:left-24 transition-transform duration-1000">
          <svg className={`w-14 h-14 ${theme === 'dark' ? 'text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]' : 'text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]'}`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.3 22h-.1c-5.5-.2-10-4.7-10.2-10.3C1.8 6 6.5 1 12.3 1c.5 0 1 .1 1.5.2-3.6 1.7-5.8 5.6-5 9.7.7 3.5 3.5 6.3 7 7 4.1.8 8-1.5 9.7-5 .1.5.2 1 .2 1.5-.2 5.8-5.2 10.8-11.1 11.1z"/>
          </svg>
        </div>

        {/* Scattered sparkly stars in dark mode */}
        {theme === 'dark' && (
          <>
            <motion.div 
              animate={{ opacity: [0.2, 1, 0.2] }} 
              transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
              className="absolute top-16 right-1/4 text-white"
            >
              <Star className="w-2 h-2 fill-white" />
            </motion.div>
            <motion.div 
              animate={{ opacity: [0.1, 0.8, 0.1] }} 
              transition={{ repeat: Infinity, duration: 4, delay: 1.2 }}
              className="absolute top-28 right-12 text-white"
            >
              <Star className="w-3 h-3 fill-amber-200 text-amber-200" />
            </motion.div>
            <motion.div 
              animate={{ opacity: [0.2, 0.9, 0.2] }} 
              transition={{ repeat: Infinity, duration: 2.5, delay: 0.2 }}
              className="absolute top-48 left-1/3 text-white"
            >
              <Star className="w-1.5 h-1.5 fill-white" />
            </motion.div>
          </>
        )}

        {/* Traditional Hanging Brass Lantern (Left Side) - Swaying Animation */}
        <motion.div 
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          style={{ transformOrigin: 'top center' }}
          className="absolute top-0 right-4 md:right-16 z-10 drop-shadow-lg"
        >
          <svg className={`w-12 h-28 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`} viewBox="0 0 100 240" fill="currentColor">
            {/* Hanging chain */}
            <line x1="50" y1="0" x2="50" y2="80" stroke="currentColor" strokeWidth="3" />
            {/* Top cap */}
            <path d="M 30 80 L 70 80 L 60 65 L 40 65 Z" />
            <circle cx="50" cy="90" r="10" />
            {/* Lantern body with Islamic latticework */}
            <path d="M 20 100 L 80 100 L 90 150 L 50 190 L 10 150 Z" className="fill-opacity-90" />
            <path d="M 35 110 L 65 110 L 75 145 L 50 178 L 25 145 Z" fill={theme === 'dark' ? '#fffbeb' : '#fef3c7'} className={`opacity-80 ${theme === 'dark' ? 'glow-lantern' : ''}`} />
            <line x1="50" y1="100" x2="50" y2="190" stroke="currentColor" strokeWidth="2" />
            <line x1="20" y1="130" x2="80" y2="130" stroke="currentColor" strokeWidth="2" />
            {/* Hanging tassel */}
            <path d="M 46 190 L 54 190 L 50 220 Z" />
          </svg>
        </motion.div>

        {/* Silhouetted Moroccan Minaret & Palm Trees at bottom */}
        <div className={`absolute bottom-16 inset-x-0 h-40 opacity-20 pointer-events-none flex items-end justify-between px-6 transition-all duration-1000 ${theme === 'dark' ? 'text-[#011a19]' : 'text-[#dccfb4]'}`}>
          {/* Minaret outline left */}
          <div className="flex flex-col items-center">
            <svg className="w-16 h-40" viewBox="0 0 100 250" fill="currentColor">
              <rect x="35" y="80" width="30" height="170" />
              <rect x="30" y="240" width="40" height="10" />
              <rect x="38" y="55" width="24" height="25" />
              <polygon points="50,15 35,55 65,55" />
              <circle cx="50" cy="15" r="4" />
            </svg>
          </div>
          {/* Palm trees outline right */}
          <div className="flex items-end space-x-2">
            <svg className="w-12 h-32 scale-x-[-1]" viewBox="0 0 100 200" fill="currentColor">
              <path d="M45,200 Q40,100 15,40 Q10,70 12,120 M12,120 Q38,110 52,200" />
              <path d="M50,45 Q75,35 85,15 Q60,25 45,52" />
              <path d="M50,45 Q90,70 95,115 Q75,80 45,52" />
              <path d="M40,55 Q5,50 0,25 Q30,35 45,52" />
              <path d="M40,55 Q5,100 15,135 Q30,100 45,52" />
            </svg>
          </div>
        </div>

        {/* Moroccan Horseshoe Arch styling wrapper for center */}
        <div className={`absolute inset-[15px] rounded-3xl border-2 pointer-events-none transition-all duration-500 z-0 ${
          theme === 'dark' ? 'border-[#b45309]/20 shadow-[inset_0_0_50px_rgba(0,0,0,0.6)]' : 'border-[#064e3b]/10 shadow-[inset_0_0_30px_rgba(244,239,230,0.5)]'
        }`} />
      </div>

      {/* TOP HEADER CONTROLLER HUD & CONTROLS */}
      <header className={`w-full max-w-lg px-5 pt-5 pb-3 flex items-center justify-between z-10 shrink-0 relative ${theme === 'dark' ? 'border-b border-amber-500/10' : 'border-b border-[#064e3b]/10'}`}>
        
        {/* User Info / Back navigation */}
        <div className="flex items-center space-x-3 space-x-reverse">
          {showBackButton ? (
            <button 
              onClick={() => {
                if (soundEnabled) soundEffects.playClick();
                if (backTo) navigate(backTo);
                else navigate(-1);
              }}
              className={`p-2.5 rounded-xl transition-all duration-300 border backdrop-blur-md flex items-center justify-center hover:scale-105 active:scale-95 cursor-pointer ${
                theme === 'dark' 
                  ? 'bg-slate-900/60 border-amber-500/20 text-amber-400 hover:bg-slate-900/90' 
                  : 'bg-white/70 border-[#064e3b]/20 text-emerald-800 hover:bg-white/90'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : user ? (
            <div 
              onClick={() => {
                if (soundEnabled) soundEffects.playClick();
                navigate('/profile');
              }}
              className={`flex items-center space-x-2 space-x-reverse cursor-pointer p-1.5 pr-2.5 rounded-2xl transition-all border backdrop-blur-md ${
                theme === 'dark' 
                  ? 'bg-slate-900/50 border-amber-500/15 hover:bg-slate-900/80 text-amber-100' 
                  : 'bg-white/50 border-[#064e3b]/15 hover:bg-white/80 text-emerald-950'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-lg shadow-sm">
                {user.avatar || '🧑‍💻'}
              </div>
              <div className="text-right">
                <div className="text-[10px] opacity-70 leading-none">مستوى {user.level}</div>
                <div className="text-[12px] font-bold tracking-tight leading-normal truncate max-w-[80px]">{user.username}</div>
              </div>
            </div>
          ) : (
            <div className="font-bold text-amber-500 text-lg flex items-center space-x-1 space-x-reverse">
              <span className="text-emerald-500">سين</span>
              <span>وجيم</span>
            </div>
          )}

          {/* Daily streak indicator */}
          {user && (
            <div className={`p-2 rounded-xl backdrop-blur-md border flex items-center space-x-0.5 space-x-reverse ${
              theme === 'dark' 
                ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' 
                : 'bg-amber-100/80 border-amber-500/20 text-amber-700'
            }`}>
              <Flame className="w-4 h-4 fill-current animate-pulse" />
              <span className="text-xs font-bold leading-none">{user.streakDays || 1}</span>
            </div>
          )}
        </div>

        {/* App Title / Logo Representation */}
        <div className="text-center absolute left-1/2 -translate-x-1/2 pointer-events-none flex items-center justify-center space-x-1.5 space-x-reverse">
          <AppLogo size="sm" className="w-8 h-8 drop-shadow-[0_2px_4px_rgba(245,158,11,0.2)] animate-pulse" />
          <h1 className="font-black text-xs tracking-wide text-amber-500 drop-shadow-md hidden min-[400px]:block">
            {title || "سين وجيم مع أمين"}
          </h1>
        </div>

        {/* Global Controls */}
        <div className="flex items-center space-x-2 space-x-reverse">
          {/* Admin panel launcher */}
          <button 
            onClick={() => {
              if (soundEnabled) soundEffects.playClick();
              setShowAdminPrompt(true);
            }}
            title="لوحة التحكم"
            className={`p-2.5 rounded-xl border backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
              theme === 'dark' 
                ? 'bg-slate-900/60 border-amber-500/20 text-yellow-400 hover:bg-slate-900/90' 
                : 'bg-white/70 border-[#064e3b]/20 text-amber-900 hover:bg-white/90'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
          </button>

          {/* Theme switcher */}
          <button 
            onClick={handleThemeToggle}
            title={theme === 'dark' ? 'الوضع المضيء' : 'الوضع المظلم'}
            className={`p-2.5 rounded-xl border backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
              theme === 'dark' 
                ? 'bg-slate-900/60 border-amber-500/20 text-amber-300 hover:bg-slate-900/90' 
                : 'bg-white/70 border-[#064e3b]/20 text-emerald-800 hover:bg-white/90'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
          </button>

          {/* Sound toggle */}
          <button 
            onClick={handleSoundToggle}
            title={soundEnabled ? 'كتم الصوت' : 'تفعيل الصوت'}
            className={`p-2.5 rounded-xl border backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
              theme === 'dark' 
                ? 'bg-slate-900/60 border-amber-500/20 text-amber-300 hover:bg-slate-900/90' 
                : 'bg-white/70 border-[#064e3b]/20 text-emerald-800 hover:bg-white/90'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* BODY WORKSPACE AREA */}
      <main className="w-full max-w-md flex-1 px-4 py-3 flex flex-col justify-start overflow-y-auto overflow-x-hidden relative z-10 pb-24">
        {children}
      </main>

      {/* BOTTOM CONCENTRIC NAVIGATION BAR */}
      <footer className="w-full max-w-md px-4 pb-4 absolute bottom-0 inset-x-0 z-20 pointer-events-none">
        <div className={`w-full rounded-2xl border backdrop-blur-lg p-2 flex items-center justify-around shadow-2xl pointer-events-auto transition-all ${
          theme === 'dark' 
            ? 'bg-slate-950/80 border-amber-500/10 shadow-black/80' 
            : 'bg-white/90 border-[#064e3b]/10 shadow-emerald-950/20'
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
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-300 relative cursor-pointer ${
                  isSelected 
                    ? theme === 'dark' 
                      ? 'text-amber-400 bg-amber-500/10' 
                      : 'text-emerald-800 bg-emerald-500/10 font-bold'
                    : theme === 'dark'
                      ? 'text-slate-400 hover:text-white'
                      : 'text-emerald-950/60 hover:text-emerald-950'
                }`}
              >
                <IconComponent className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-bold leading-none">{item.label}</span>
                
                {/* Visual active bubble indicator */}
                {isSelected && (
                  <motion.div 
                    layoutId="activeGlow" 
                    className="absolute -bottom-1 w-5 h-1 rounded-full bg-amber-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </footer>

      {/* MODAL WINDOW FOR SECRET ADMIN PASSWORD PROMPT */}
      <AnimatePresence>
        {showAdminPrompt && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl border text-center transition-all ${
                theme === 'dark' 
                  ? 'bg-slate-900 border-amber-500/25 text-slate-100' 
                  : 'bg-white border-[#064e3b]/20 text-slate-900'
              }`}
            >
              <h2 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-amber-400' : 'text-emerald-800'}`}>
                الدخول كمسؤول التحدي
              </h2>
              <p className="text-xs opacity-80 mb-5 leading-relaxed">
                المرجو إدخال الرمز السري الخاص بالمسؤول لتعديل أو إضافة الأسئلة الثقافية والمراحل.
              </p>

              <form onSubmit={handleAdminAccess} className="space-y-4">
                <input 
                  type="password"
                  placeholder=""
                  value={adminCode}
                  onChange={(e) => {
                    setAdminCode(e.target.value);
                    setAdminError('');
                  }}
                  className={`w-full px-4 py-3 rounded-xl text-center font-mono focus:outline-none focus:ring-2 select-text ${
                    theme === 'dark'
                      ? 'bg-slate-800 border border-amber-500/20 text-amber-300 focus:ring-amber-500 ring-offset-slate-900'
                      : 'bg-slate-100 border border-[#064e3b]/20 text-emerald-900 focus:ring-emerald-600 ring-offset-white'
                  }`}
                  autoFocus
                />

                {adminError && (
                  <p className="text-xs text-rose-500 font-bold">{adminError}</p>
                )}

                <div className="flex space-x-2 space-x-reverse pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg hover:from-amber-500 hover:to-yellow-400 active:scale-95 transition-all text-sm cursor-pointer"
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
                    className={`px-4 py-3 rounded-xl text-sm transition-all focus:outline-none cursor-pointer ${
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
