import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/useQuizStore';
import { soundEffects } from '../utils/audio';
import { 
  Trophy, 
  Map, 
  Flame, 
  Users, 
  Settings, 
  ShieldAlert, 
  Sparkles, 
  Play, 
  CalendarClock,
  Gift,
  HelpCircle,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AppLogo from '../components/AppLogo';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, soundEnabled, theme, claimDailyReward, questions } = useQuizStore();
  const [claimedBonus, setClaimedBonus] = useState<number | null>(null);
  const [showClaimAnimation, setShowClaimAnimation] = useState(false);

  const handleClaimReward = () => {
    if (!user) return;
    const bonus = claimDailyReward();
    if (bonus) {
      if (soundEnabled) soundEffects.playFanfare();
      setClaimedBonus(bonus);
      setShowClaimAnimation(true);
      setTimeout(() => {
        setShowClaimAnimation(false);
      }, 3000);
    } else {
      if (soundEnabled) soundEffects.playWrong();
    }
  };

  // Determine if already claimed today
  const todayStr = new Date().toISOString().split('T')[0];
  const isClaimedToday = user?.dailyRewardLastClaimed === todayStr;

  // Total questions answered count
  const answeredCount = user?.completedQuestions.length || 0;

  // Simple quick start generator (launch Moroccan category, Stage 1 or current unlocked stage)
  const handleQuickPlay = () => {
    if (soundEnabled) soundEffects.playClick();
    // Default to 'morocco' or any category
    const categoriesList = ['morocco', 'general', 'islamic', 'history', 'sports', 'geography'];
    const randomCategory = categoriesList[Math.floor(Math.random() * categoriesList.length)];
    const unlockedStage = user?.unlockedStages[randomCategory] || 1;
    navigate(`/quiz?category=${randomCategory}&stage=${unlockedStage}`);
  };

  return (
    <div className="w-full space-y-5 select-none relative pb-12">
      
      {/* 1. HERO HERO WELCOME BANNER (Moroccan Mosaic styled showcase greeting) */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`w-full rounded-2xl p-5 border text-right overflow-hidden relative shadow-lg ${
          theme === 'dark' 
            ? 'bg-gradient-to-tr from-emerald-950/90 to-[#043329]/90 border-amber-500/20 shadow-black/40' 
            : 'bg-gradient-to-tr from-[#ece4d6] to-[#fcfaf5] border-emerald-800/20 shadow-emerald-950/5'
        }`}
      >
        {/* Decorative corner mosaic elements */}
        <div className="absolute top-0 left-0 w-24 h-24 opacity-[0.14] rotate-45 border-4 border-amber-500 rounded-3xl -translate-x-12 -translate-y-12" />
        
        <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full text-center sm:text-right">
          {/* Single large elegant logo */}
          <AppLogo size="md" className="shrink-0 drop-shadow-xl rounded-2xl border-2 border-amber-500/15" />
          
          <div className="flex-1 space-y-1">
            <div className="text-[10px] uppercase tracking-widest font-black opacity-75 text-emerald-600 dark:text-amber-500">
              لوحة البطل الثقافي
            </div>
            <h1 className={`text-xl sm:text-2xl font-black ${theme === 'dark' ? 'text-amber-400' : 'text-emerald-950'}`}>
              مرحباً {user?.username} {user?.avatar}
            </h1>
            <p className="text-xs opacity-90 leading-relaxed max-w-sm mx-auto sm:mx-0">
              أهلاً بك في عالم التحدي والمعرفة. مستعد لمنافسة العباقرة اليوم؟ اختبر معلوماتك واصعد سلم الترتيب!
            </p>
          </div>

          <div className="relative shrink-0 mt-2 sm:mt-0">
            {/* Level bubble with golden orbit */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              className="w-14 h-14 rounded-full border border-dashed border-amber-400 flex items-center justify-center opacity-70"
            />
            <div className={`absolute inset-0 w-11 h-11 m-auto rounded-full font-black text-center flex flex-col justify-center items-center text-slate-950 shadow-md ${
              theme === 'dark' ? 'bg-gradient-to-r from-amber-500 to-yellow-300' : 'bg-gradient-to-r from-emerald-600 to-teal-400 text-white'
            }`}>
              <span className="text-[8px] font-bold leading-none uppercase">مستوى</span>
              <span className="text-xs leading-none mt-0.5">{user?.level || 1}</span>
            </div>
          </div>
        </div>

        {/* Short XP Progression HUD */}
        <div className="mt-4 pt-4 border-t border-dashed border-slate-500/20">
          <div className="flex justify-between text-[11px] font-bold opacity-80 mb-1">
            <span>{((user?.totalXP || 0) % 300)} / 300 XP</span>
            <span>التقدم للمستوى القادم</span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border border-white/5' : 'bg-slate-200'}`}>
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${(((user?.totalXP || 0) % 300) / 300) * 100}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* 2. DAILY REWARDS & CHALLENGE INTERACTIVE MODULE */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`w-full rounded-2xl p-4 border flex items-center justify-between text-right shadow-lg relative ${
          isClaimedToday
            ? theme === 'dark'
              ? 'bg-slate-950/40 border-slate-500/10'
              : 'bg-emerald-50/70 border-emerald-800/10'
            : theme === 'dark'
              ? 'bg-gradient-to-r from-amber-950/20 via-slate-900/40 to-slate-900/40 border-amber-500/30 ring-1 ring-amber-500/25'
              : 'bg-amber-100/50 border-amber-500/30'
        }`}
      >
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className={`p-3 rounded-xl ${isClaimedToday ? 'bg-slate-500/10 text-slate-500' : 'bg-amber-500/10 text-amber-500 animate-pulse'}`}>
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black tracking-wide">الهدية اليومية للعباقرة</h3>
            <p className="text-[10px] opacity-75 mt-0.5 max-w-[190px]">
              {isClaimedToday ? 'لقد حصلت على هديتك اليوم، عد غداً لحصد المزيد!' : 'باقة الـ XP اليومية جاهزة! اضغط للمطالبة بالجائزة.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleClaimReward}
          disabled={isClaimedToday}
          className={`py-2 px-4 rounded-xl text-xs font-black select-none transition-all duration-300 transform active:scale-95 cursor-pointer ${
            isClaimedToday
              ? theme === 'dark' ? 'bg-slate-800/45 text-slate-500' : 'bg-slate-200 text-slate-400'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md font-bold'
          }`}
        >
          {isClaimedToday ? 'تم الاستلام' : 'استلم الآن'}
        </button>
      </motion.div>

      {/* 3. CORE ACTION HUB (Large Play Button, Launch Admin, etc) */}
      <div className="grid grid-cols-2 gap-3.5">
        
        {/* HUGE START CHALLENGE INTERACTIVE BUTTON */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleQuickPlay}
          className="col-span-2 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 p-4 shadow-xl text-center cursor-pointer flex items-center justify-between font-black text-slate-950 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 h-24 w-24 opacity-10 bg-white rotate-45 rounded-xl translate-x-4 -translate-y-4" />
          <div className="flex items-center space-x-3.5 space-x-reverse pr-2">
            <div className="p-3.5 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shadow-lg">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div className="text-right">
              <p className="text-sm font-black leading-none">تحدي سين وجيم السريع!</p>
              <p className="text-[10px] opacity-80 leading-normal mt-0.5">ابدأ مرحلة كويز عشوائية من 3 أسئلة مغربية</p>
            </div>
          </div>
          <span className="text-xl pl-2">🎮</span>
        </motion.div>

        {/* LEADERBOARD VIEW CARD */}
        <div 
          onClick={() => {
            if (soundEnabled) soundEffects.playClick();
            navigate('/leaderboard');
          }}
          className={`p-4 rounded-2xl border text-right cursor-pointer shadow-md transition-all ${
            theme === 'dark' ? 'bg-slate-900/50 border-slate-500/10 hover:bg-slate-900/80' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-500 text-white flex items-center justify-center mb-3">
            <Trophy className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold font-sans">جدول الأذكياء</h4>
          <p className="text-[9px] opacity-75 mt-0.5">ترتيب الصدارة والأصدقاء المغربيين</p>
        </div>

        {/* EXPLORE CATEGORIES VIEW CARD */}
        <div 
          onClick={() => {
            if (soundEnabled) soundEffects.playClick();
            navigate('/categories');
          }}
          className={`p-4 rounded-2xl border text-right cursor-pointer shadow-md transition-all ${
            theme === 'dark' ? 'bg-slate-900/50 border-slate-500/10 hover:bg-slate-900/80' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mb-3">
            <Map className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold">الأقسام والـمـراحـل</h4>
          <p className="text-[9px] opacity-75 mt-0.5">افتح 14 كنزاً معرفياً مرحلة بمرحلة</p>
        </div>

      </div>

      {/* 4. PERFORMANCE SCORECARD (Simple Grid Stats) */}
      <div className={`p-4 rounded-2xl border ${
        theme === 'dark' ? 'bg-slate-950/50 border-slate-500/10' : 'bg-white border-[#064e3b]/10'
      }`}>
        <h3 className={`text-xs font-black text-right mb-3 ${theme === 'dark' ? 'text-amber-400' : 'text-emerald-950'}`}>إحصائيات الإنجاز الشخصية</h3>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-500/5 border border-slate-500/5">
            <Award className="w-4 h-4 text-amber-500 mb-1" />
            <span className="text-xs font-semibold leading-none">{user?.totalXP || 0}</span>
            <span className="text-[9px] opacity-70 mt-1">مجموع الـ XP</span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-500/5 border border-slate-500/5">
            <HelpCircle className="w-4 h-4 text-emerald-500 mb-1" />
            <span className="text-xs font-semibold leading-none">{answeredCount}</span>
            <span className="text-[9px] opacity-70 mt-1">أسئلة محلولة</span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-500/5 border border-slate-500/5">
            <Flame className="w-4 h-4 text-orange-500 mb-1" />
            <span className="text-xs font-semibold leading-none">{user?.streakDays || 1} أيام</span>
            <span className="text-[9px] opacity-70 mt-1">سلسلة الأيام</span>
          </div>
        </div>
      </div>

      {/* DAILY CLAIM POPUP FLOATING ANIMATION */}
      <AnimatePresence>
        {showClaimAnimation && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="fixed inset-0 m-auto w-72 h-44 bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl z-50 flex flex-col items-center justify-center text-center backdrop-blur-md"
          >
            <div className="text-4xl animate-bounce mb-2">🎁</div>
            <h3 className="text-lg font-black text-amber-400">مبارك الحصول على الجائزة!</h3>
            <p className="text-xs text-white opacity-90 mt-1 font-bold">حصلت مـحـفـظـتـك على: +{claimedBonus} XP</p>
            <div className="absolute top-1 left-1 opacity-10 text-9xl">🌟</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
