import React from 'react';
import { useQuizStore } from '../store/useQuizStore';
import { soundEffects } from '../utils/audio';
import { 
  Award, 
  Flame, 
  HelpCircle, 
  Unlock, 
  Lock, 
  CheckCircle,
  Calendar,
  Sparkles,
  Heart,
  Trophy,
  Crown
} from 'lucide-react';
import { motion } from 'motion/react';

const achievementIconMap: Record<string, any> = {
  Trophy: Trophy,
  CheckCircle: CheckCircle,
  Heart: Heart,
  Crown: Crown,
  Award: Award
};

export default function ProfilePage() {
  const { user, theme, achievements, questions } = useQuizStore();

  const userAchievements = user?.achievements || [];
  const answeredCount = user?.completedQuestions.length || 0;

  // Total stages counts unlocked
  const stageUnlockedCount = user ? Object.values(user.unlockedStages).reduce((a, b) => a + (b - 1), 0) : 0;

  return (
    <div className="w-full space-y-4 select-none pb-12 text-right">
      
      {/* 1. PORTFOLIO CARD HEADER */}
      <div className={`w-full rounded-2xl p-5 border text-center relative overflow-hidden shadow-lg ${
        theme === 'dark' 
          ? 'bg-gradient-to-tr from-slate-950 via-[#011425] to-slate-950 border-amber-500/10 shadow-black/80' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="absolute top-0 right-0 p-3 opacity-[0.05] text-9xl">🦁</div>
        
        {/* Avatar badge */}
        <div className="inline-flex relative mb-3">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-5xl shadow-xl shadow-amber-500/15">
            {user?.avatar || '🧑‍💻'}
          </div>
          <div className="absolute -bottom-2 -left-2 bg-emerald-600 border border-white text-white text-[9px] font-black py-0.5 px-2 rounded-full shadow">
            مستوى {user?.level || 1}
          </div>
        </div>

        <h2 className="text-lg font-black">{user?.username}</h2>
        <p className="text-[10px] opacity-75 mt-0.5">مسجل منذ {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-dashed border-slate-500/20">
          <div className="text-center">
            <span className="text-base font-black text-amber-500 block">{user?.totalXP || 0}</span>
            <span className="text-[9px] opacity-65">الـ XP الإجمالي</span>
          </div>
          <div className="text-center border-x border-slate-500/15">
            <span className="text-base font-black text-emerald-500 block">{answeredCount}</span>
            <span className="text-[9px] opacity-65">سؤال مـحـلـول</span>
          </div>
          <div className="text-center">
            <span className="text-base font-black text-orange-400 block">{user?.streakDays || 1} أيام</span>
            <span className="text-[9px] opacity-65">سلسلة الأيام</span>
          </div>
        </div>
      </div>

      {/* 2. SPECIFIC SCORE CARD MAPS */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`p-4 rounded-xl border text-right ${theme === 'dark' ? 'bg-slate-950/40 border-slate-500/10' : 'bg-white border-slate-100'}`}>
          <Calendar className="w-5 h-5 text-emerald-500 mb-2" />
          <h4 className="text-[10px] opacity-70 leading-none">مراحل تم فتحها</h4>
          <span className="text-sm font-black mt-1 inline-block">{stageUnlockedCount} مستوى</span>
        </div>

        <div className={`p-4 rounded-xl border text-right ${theme === 'dark' ? 'bg-slate-950/40 border-slate-500/10' : 'bg-white border-slate-100'}`}>
          <Sparkles className="w-5 h-5 text-amber-400 mb-2 animate-pulse" />
          <h4 className="text-[10px] opacity-70 leading-none">أوسمة تذكارية</h4>
          <span className="text-sm font-black mt-1 inline-block">{userAchievements.length} من {achievements.length}</span>
        </div>
      </div>

      {/* 3. LIST OF ACHIEVEMENTS */}
      <div className={`p-4 rounded-2xl border ${
        theme === 'dark' ? 'bg-slate-950/50 border-slate-500/10' : 'bg-white border-[#064e3b]/10'
      }`}>
        <h3 className={`text-xs font-black mb-3 ${theme === 'dark' ? 'text-amber-400' : 'text-emerald-950'}`}>معرض الأوسمة والإنجازات</h3>
        
        <div className="space-y-2.5">
          {achievements.map((ach) => {
            const isUnlocked = userAchievements.includes(ach.id);
            const AchIcon = achievementIconMap[ach.icon] || Trophy;

            return (
              <div 
                key={ach.id}
                className={`p-3 rounded-xl border flex items-center justify-between text-right transition-all duration-300 relative overflow-hidden ${
                  isUnlocked
                    ? theme === 'dark'
                      ? 'bg-amber-500/5 border-amber-500/20 text-amber-200 shadow-[inset_0_0_10px_rgba(245,158,11,0.05)]'
                      : 'bg-amber-50 border-amber-500/30 text-amber-950 font-bold'
                    : theme === 'dark' ? 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60' : 'bg-slate-50 border-slate-200 text-slate-400 opacity-70'
                }`}
              >
                <div className="flex items-center space-x-3 space-x-reverse text-right">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isUnlocked ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-500/10 text-slate-400'
                  }`}>
                    <AchIcon className="w-5 h-5 fill-current fill-opacity-10" />
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold block">{ach.title}</span>
                    <span className="text-[9px] opacity-75 block leading-normal">{ach.description}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-mono leading-none font-bold opacity-80">جائزة</span>
                  <span className="text-[11px] font-bold mt-1">+{ach.xpReward} XP</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
