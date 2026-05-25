import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/useQuizStore';
import { soundEffects } from '../utils/audio';
import { 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Trash2, 
  RotateCcw, 
  HelpCircle, 
  ShieldAlert,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { 
    soundEnabled, 
    theme, 
    setSoundEnabled, 
    toggleTheme, 
    resetAllProgress, 
    resetQuestionsToDefault,
    user,
    questions
  } = useQuizStore();

  const [showProgressResetConfirm, setShowProgressResetConfirm] = useState(false);
  const [showDbResetConfirm, setShowDbResetConfirm] = useState(false);

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    if (enabled) {
      soundEffects.playClick();
    }
  };

  const handleResetProgress = () => {
    if (soundEnabled) soundEffects.playClick();
    resetAllProgress();
    setShowProgressResetConfirm(false);
    // Reload page to prompt sign-up screen
    window.location.href = '/';
  };

  const handleResetDb = () => {
    if (soundEnabled) soundEffects.playClick();
    resetQuestionsToDefault();
    setShowDbResetConfirm(false);
    if (soundEnabled) soundEffects.playFanfare();
  };

  return (
    <div className="w-full space-y-4 select-none pb-12 text-right">
      
      {/* HUD HEADER */}
      <div>
        <h2 className={`text-xl font-black ${theme === 'dark' ? 'text-amber-400' : 'text-emerald-950'}`}>الإعدادات العامة</h2>
        <p className="text-xs opacity-75 mt-0.5">تحكم في خيارات الصوت، الوضع المظلم، وحذف أو تصفير بيانات المسابقة.</p>
      </div>

      {/* 1. AUDIO TOGGLE SETTINGS CARD */}
      <div className={`p-4 rounded-2xl border ${
        theme === 'dark' ? 'bg-slate-950/50 border-slate-500/10' : 'bg-white border-[#064e3b]/10 shadow'
      }`}>
        <h3 className="text-xs font-black mb-3">الصوت والمؤثرات</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 space-x-reverse pr-1">
            {soundEnabled ? <Volume2 className="w-5 h-5 text-amber-500" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
            <div>
              <span className="text-xs font-bold block">مؤثرات الصوت الاصطناعية</span>
              <span className="text-[10px] opacity-70">أصوات التاكتكة، النجاح، والفانفار اللطيفة</span>
            </div>
          </div>

          <div className="flex space-x-1 space-x-reverse">
            <button
              onClick={() => handleSoundToggle(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                soundEnabled 
                  ? 'bg-amber-500 text-slate-950 shadow' 
                  : theme === 'dark' ? 'bg-slate-900 text-slate-400' : 'bg-slate-150 text-slate-600'
              }`}
            >
              تشغيل
            </button>
            <button
              onClick={() => handleSoundToggle(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !soundEnabled 
                  ? 'bg-amber-500 text-slate-950 shadow' 
                  : theme === 'dark' ? 'bg-slate-900 text-slate-400' : 'bg-slate-150 text-slate-600'
              }`}
            >
              كتم
            </button>
          </div>
        </div>
      </div>

      {/* 2. THEME OPTION SETTINGS CARD */}
      <div className={`p-4 rounded-2xl border ${
        theme === 'dark' ? 'bg-slate-950/50 border-slate-500/10' : 'bg-white border-[#064e3b]/10 shadow'
      }`}>
        <h3 className="text-xs font-black mb-3">مظهر التطبيق</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 space-x-reverse pr-1">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-amber-600" />}
            <div>
              <span className="text-xs font-bold block">موضوع الألوان (Theme)</span>
              <span className="text-[10px] opacity-70">التبديل بين الوضع المظلم والكامل الإضاءة</span>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all border shadow ${
              theme === 'dark' 
                ? 'bg-slate-900 border-amber-500/25 text-amber-300' 
                : 'bg-emerald-50 border-emerald-800/20 text-emerald-900'
            }`}
          >
            {theme === 'dark' ? 'تبديل للوضع المضيء' : 'تبديل للوضع المظلم'}
          </button>
        </div>
      </div>

      {/* 3. HARD DANGER RESETS SETTINGS CARDS */}
      <div className={`p-4 rounded-2xl border ${
        theme === 'dark' ? 'bg-slate-950/50 border-slate-500/10' : 'bg-white border-[#064e3b]/10 shadow'
      }`}>
        <h3 className="text-xs font-black mb-3 text-rose-500">منطقة الأمان والبيانات الدقيقة</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="text-right">
              <span className="font-bold block text-slate-300">مسح كامل تقدم اللاعب</span>
              <span className="text-[9px] opacity-70">تصفير الـ XP، وحذف اللقب، والمراحل المفتوحة بالكامل</span>
            </div>
            
            <button
              onClick={() => {
                if (soundEnabled) soundEffects.playClick();
                setShowProgressResetConfirm(true);
              }}
              className="py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all text-[11px] cursor-pointer"
            >
              حذف اللقب
            </button>
          </div>

          <div className="border-t border-dashed border-slate-500/10 pt-4 flex items-center justify-between text-xs font-semibold">
            <div className="text-right">
              <span className="font-bold block text-slate-300">تصفير قاعدة الأسئلة (المعدل: {questions.length})</span>
              <span className="text-[9px] opacity-70">إرجاع قاعدة الأسئلة لمرحلتها الأولى والمغربية الافتراضية</span>
            </div>

            <button
              onClick={() => {
                if (soundEnabled) soundEffects.playClick();
                setShowDbResetConfirm(true);
              }}
              className="py-1.5 px-3 rounded-xl border border-rose-600/50 hover:bg-rose-600/15 text-rose-500 font-bold transition-all text-[11px] cursor-pointer"
            >
              تحديث الداتابيز
            </button>
          </div>
        </div>
      </div>

      {/* 4. APP INFOMATION BRANDING CARD */}
      <div className={`p-4 rounded-2xl border text-center ${
        theme === 'dark' ? 'bg-slate-950/20 border-slate-500/10' : 'bg-amber-500/5 border-amber-500/10'
      }`}>
        <div className="inline-flex p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 mb-2">
          <Info className="w-4 h-4" />
        </div>
        <p className="text-[10px] leading-relaxed opacity-75">
          <strong>سين وجيم مع أمين</strong> - تطبيق كويز ومسابقات تفاعلية مصممة ومبنية بعشق في المغرب. جميع الحقوق المدنية والثقافية محفوظة للمملكة المغربية 🇲🇦 © 2026.
        </p>
      </div>

      {/* CONFIRMATION POPUPS */}
      <AnimatePresence>
        {showProgressResetConfirm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-rose-500/20 text-white rounded-3xl p-6 shadow-2xl w-full max-w-sm text-center">
              <div className="text-4xl mb-2">⚠️</div>
              <h3 className="text-lg font-black text-rose-500">هل أنت متأكد تماماً؟</h3>
              <p className="text-xs text-slate-300 mt-1 mb-5 leading-relaxed">
                لا يمكن استرجاع اللقب، نقاط الـ XP، الأيام، والمراحل المحلولة بمجرد التأكيد! سيكون عليك التسجيل من جديد كلاعب.
              </p>
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={handleResetProgress}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  نعم، احذف الكل
                </button>
                <button
                  onClick={() => setShowProgressResetConfirm(false)}
                  className="px-4 py-3 bg-slate-800 text-slate-300 rounded-xl text-xs hover:bg-slate-700 transition-all cursor-pointer"
                >
                  تراجع
                </button>
              </div>
            </div>
          </div>
        )}

        {showDbResetConfirm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-rose-500/20 text-white rounded-3xl p-6 shadow-2xl w-full max-w-sm text-center">
              <div className="text-4xl mb-2">💾</div>
              <h3 className="text-lg font-black text-rose-400">تصفير داتابيز الأسئلة؟</h3>
              <p className="text-xs text-slate-300 mt-1 mb-5 leading-relaxed">
                سيقوم هذا الإجراء بإعادة تعيين قاعدة الأسئلة للنسخة المغربية الأصلية الافتراضية وحذف أي أسئلة قمت بإضافتها كمسؤول عن طريق لوحة التحكم.
              </p>
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={handleResetDb}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  نعم، تصفير الداتابيز
                </button>
                <button
                  onClick={() => setShowDbResetConfirm(false)}
                  className="px-4 py-3 bg-slate-800 text-slate-300 rounded-xl text-xs hover:bg-slate-700 transition-all cursor-pointer"
                >
                  تراجع
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
