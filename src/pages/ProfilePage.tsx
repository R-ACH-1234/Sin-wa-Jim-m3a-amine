import React, { useState } from 'react';
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
import { motion, AnimatePresence } from 'motion/react';

const achievementIconMap: Record<string, any> = {
  Trophy: Trophy,
  CheckCircle: CheckCircle,
  Heart: Heart,
  Crown: Crown,
  Award: Award
};

const AVATAR_OPTIONS = [
  { emoji: '👳‍♂️', name: 'مول الشاش' },
  { emoji: '🧕', name: 'للا فاطومة' },
  { emoji: '🦁', name: 'سبع الأطلس' },
  { emoji: '🐪', name: 'جمل الصحراء' },
  { emoji: '🧑‍🍳', name: 'الشاف المغربي' },
  { emoji: '🏃‍♂️', name: 'البطل السريع' },
  { emoji: '🎨', name: 'الفنان المبدع' },
  { emoji: '👸', name: 'أميرة مغربية' },
  { emoji: '🦅', name: 'صقر الأطلس' },
  { emoji: '🎓', name: 'العَالم الذكي' }
];

export default function ProfilePage() {
  const { user, theme, achievements, questions, updateUser, soundEnabled } = useQuizStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(user?.username || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '👳‍♂️');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (user) {
      setEditUsername(user.username);
      setEditAvatar(user.avatar);
    }
  }, [user]);

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
          : 'bg-white border-slate-200 shadow-slate-200'
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
        
        {/* Edit profile button */}
        <button
          onClick={() => {
            if (soundEnabled) soundEffects.playClick();
            setIsEditing(true);
          }}
          className="mt-2.5 inline-flex items-center space-x-1.5 space-x-reverse bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 dark:text-amber-400 font-bold px-3 py-1.5 rounded-lg border border-amber-500/20 active:scale-95 transition-all text-xs cursor-pointer"
        >
          <span>تعديل الاسم والصورة</span>
          <span>✎</span>
        </button>

        <p className="text-[10px] opacity-75 mt-3">مسجل كبطل في اللعبة الثقافية</p>

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

      {/* EDIT PROFILE MODAL */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl border text-center transition-all ${
                theme === 'dark' 
                  ? 'bg-slate-900/95 border-amber-500/15 text-slate-100' 
                  : 'bg-white border-slate-200 text-slate-900 shadow-xl'
              }`}
            >
              <h2 className={`text-base font-black mb-1 ${theme === 'dark' ? 'text-amber-400' : 'text-emerald-900'}`}>
                تعديل الملف الشخصي
              </h2>
              <p className="text-[10px] opacity-75 mb-4 leading-relaxed text-center">
                قم بتغيير اسم الشهرة الخاص بك واختيار صورتك الرمزية المفضلة للتنافس في الصدارة.
              </p>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (!editUsername.trim()) {
                  setErrorMsg('الاسم لا يمكن أن يكون فارغاً!');
                  return;
                }
                setSaving(true);
                updateUser({ username: editUsername.trim(), avatar: editAvatar });
                if (soundEnabled) soundEffects.playFanfare();
                setIsEditing(false);
                setSaving(false);
              }} className="space-y-4 text-right">
                
                {/* Avatar Slider */}
                <div>
                  <label className="block text-xs font-bold mb-2 opacity-80 text-right">اختر صورتك الرمزية الجديدة:</label>
                  <div className="flex gap-2 overflow-x-auto py-1.5 px-0.5 scrollbar-thin">
                    {AVATAR_OPTIONS.map((item, idx) => {
                      const isSelected = editAvatar === item.emoji;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (soundEnabled) soundEffects.playClick();
                            setEditAvatar(item.emoji);
                          }}
                          className={`flex-shrink-0 flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
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

                {/* Username input */}
                <div className="text-right">
                  <label className="block text-xs font-bold mb-1.5 opacity-80">اسم الشهرة أو اللقب الأول:</label>
                  <input 
                    type="text"
                    required
                    maxLength={15}
                    placeholder="مثال: بطل فاس"
                    value={editUsername}
                    onChange={(e) => {
                      setEditUsername(e.target.value);
                      setErrorMsg('');
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl text-center font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 select-text text-base ${
                      theme === 'dark'
                        ? 'bg-slate-950 border border-amber-500/20 text-amber-300'
                        : 'bg-slate-100 border border-slate-200 text-emerald-950'
                    }`}
                  />
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-500 text-center font-bold">{errorMsg}</p>
                )}

                <div className="flex space-x-2 space-x-reverse pt-2">
                  <button
                    type="submit"
                    disabled={saving || !editUsername.trim()}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black rounded-xl shadow-md active:scale-95 transition-all text-xs cursor-pointer"
                  >
                    حفظ التغييرات
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (soundEnabled) soundEffects.playClick();
                      setIsEditing(false);
                      setEditUsername(user?.username || '');
                      setEditAvatar(user?.avatar || '👳‍♂️');
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all focus:outline-none cursor-pointer ${
                      theme === 'dark' 
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700' 
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
