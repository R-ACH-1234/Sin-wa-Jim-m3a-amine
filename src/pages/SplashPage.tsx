import React, { useState, useEffect } from 'react';
import { useQuizStore } from '../store/useQuizStore';
import { soundEffects } from '../utils/audio';
import { HelpCircle, Sparkles, Trophy, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import AppLogo from '../components/AppLogo';

interface SplashPageProps {
  onComplete: () => void;
}

const AVATAR_OPTIONS = [
  { emoji: '👳‍♂️', name: 'مول الشاش' },
  { emoji: '🧕', name: 'للا فاطومة' },
  { emoji: '🦁', name: 'سبع الأطلس' },
  { emoji: '🐪', name: 'جمل الصحراء' },
  { emoji: '🧑‍🍳', name: 'الشاف المغربي' },
  { emoji: '🏃‍♂️', name: 'البطل السريع' },
  { emoji: '🎨', name: 'الفنان المبدع' }
];

export default function SplashPage({ onComplete }: SplashPageProps) {
  const { user, registerUser, soundEnabled, theme } = useQuizStore();
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].emoji);
  const [isInitializing, setIsInitializing] = useState(true);
  const [progress, setProgress] = useState(0);

  // Initializing loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInitializing) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsInitializing(false);
              // If already registered, skip form and proceed to homepage!
              if (user) {
                onComplete();
              }
            }, 300);
            return 100;
          }
          return prev + 8;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isInitializing, user, onComplete]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    if (soundEnabled) soundEffects.playFanfare();
    registerUser(username, selectedAvatar);
    onComplete();
  };

  if (isInitializing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 select-none relative z-10 w-full">
        {/* Animated App Logo (Real custom-designed vector) */}
        <motion.div 
          initial={{ scale: 0.7, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="mb-6 relative"
        >
          <AppLogo size="xl" />
        </motion.div>

        {/* Animated Greeting Slogan */}
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`text-2xl font-black mb-2 tracking-tight ${theme === 'dark' ? 'text-amber-400' : 'text-emerald-900'}`}
        >
          مرحباً بكم في سين وجيم!
        </motion.h2>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 0.7 }}
          transition={{ delay: 0.4 }}
          className="text-sm max-w-xs mb-8"
        >
          تطبيق المسابقات الثقافي والترفيهي المستوحى من ثقافة المملكة المغربية مع بطلنا أمين.
        </motion.p>

        {/* Dynamic loading slider bar */}
        <div className={`w-64 h-2.5 rounded-full overflow-hidden border relative ${theme === 'dark' ? 'bg-slate-900 border-amber-500/20' : 'bg-slate-200 border-[#064e3b]/25'}`}>
          <motion.div 
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-400"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[10px] mt-2 opacity-60 font-mono tracking-widest font-bold">جاري تحميل المراحل والأسئلة... {progress}%</p>
      </div>
    );
  }

  // Not logged in: Show elegant customized welcome card with avatar options
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-4 w-full relative z-10 select-none">
      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`w-full max-w-sm rounded-3xl p-6 border-2 backdrop-blur-md shadow-2xl relative ${
          theme === 'dark'
            ? 'bg-slate-950/70 border-amber-500/20 text-slate-100'
            : 'bg-white/95 border-[#064e3b]/20 text-slate-950'
        }`}
      >
        <div className="text-center mb-6 flex flex-col items-center">
          <AppLogo size="lg" className="mb-3 shrink-0" />
          <h1 className={`text-3xl font-black transition-colors duration-300 ${theme === 'dark' ? 'text-amber-400' : 'text-emerald-950'}`}>
            سين وجيم
          </h1>
          <p className="text-[10px] font-black tracking-widest text-[#047857] dark:text-amber-500/80 mb-4">تحدي الذكاء والثقافة المغربية</p>
          
          <div className="w-full border-t border-dashed border-slate-500/20 pt-4">
            <h2 className={`text-sm font-bold ${theme === 'dark' ? 'text-amber-200' : 'text-emerald-900'}`}>سجل اسمك وانطلق للتحدي 🌟</h2>
            <p className="text-[11px] opacity-75 mt-1 leading-relaxed">اختر لـقـبـك الـتـنـافـسـي وصورتك الرمزية لبدء تجميع نقاط الـ XP.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar selector slider */}
          <div>
            <label className="block text-xs font-bold mb-2 opacity-80 text-right">اختر صورتك الرمزية:</label>
            <div className="flex gap-2.5 overflow-x-auto py-2 px-1 scrollbar-thin">
              {AVATAR_OPTIONS.map((item, idx) => {
                const isSelected = selectedAvatar === item.emoji;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (soundEnabled) soundEffects.playClick();
                      setSelectedAvatar(item.emoji);
                    }}
                    className={`flex-shrink-0 flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-amber-400 bg-amber-500/10 scale-105' 
                        : 'border-transparent bg-slate-500/5 hover:bg-slate-500/10'
                    }`}
                  >
                    <span className="text-2xl mb-1">{item.emoji}</span>
                    <span className="text-[9px] font-bold opacity-80 whitespace-nowrap">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Username textbox */}
          <div className="text-right">
            <label className="block text-xs font-bold mb-2 opacity-80">اسم الشهرة أو اللقب الأول:</label>
            <input 
              type="text"
              required
              maxLength={15}
              placeholder="مثال: البطل توبقال"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-4 py-3.5 rounded-xl text-center font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 select-text text-base ${
                theme === 'dark'
                  ? 'bg-slate-900 border border-amber-500/20 text-amber-300'
                  : 'bg-slate-100 border border-[#064e3b]/20 text-emerald-950'
              }`}
            />
          </div>

          {/* Core features preview panel */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-dashed border-slate-500/20">
            {[
              { label: '3 أسئلة لكل كويز', icon: HelpCircle },
              { label: 'نقاط XP ومستويات', icon: Trophy },
              { label: 'تنافس الأصدقاء', icon: BookOpen }
            ].map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center p-1.5 rounded-xl bg-slate-500/5">
                <f.icon className="w-3.5 h-3.5 text-amber-400 mb-1" />
                <span className="text-[9px] leading-tight font-bold opacity-80">{f.label}</span>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={!username.trim()}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-2xl shadow-xl active:scale-95 transition-all text-sm flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-50 cursor-pointer"
          >
            <span>انطلق الآن للمنافسة!</span>
            <span>🚀</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
