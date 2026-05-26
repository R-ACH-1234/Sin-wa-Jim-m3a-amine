import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuizStore } from '../store/useQuizStore';
import { CATEGORIES } from '../data/initialQuestions';
import { soundEffects } from '../utils/audio';
import { 
  Trophy, 
  RotateCcw, 
  Map, 
  Home, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Flame, 
  Award,
  BookOpen,
  ArrowLeft,
  Share2,
  Copy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const categoryId = searchParams.get('category') || 'morocco';
  const stageNum = parseInt(searchParams.get('stage') || '1', 10);
  const correctCount = parseInt(searchParams.get('correct') || '0', 10);
  const totalCount = parseInt(searchParams.get('total') || '3', 10);

  const reviews = location.state?.reviews || [];

  const { user, theme, soundEnabled, unlockNextStage, addXP, checkAchievements, questions } = useQuizStore();
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [xpReport, setXpReport] = useState({ gained: 0, total: 0, levelUp: false });
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (navigator.share) {
      setCanNativeShare(true);
    }
  }, []);

  const categoryDetails = CATEGORIES.find(c => c.id === categoryId);
  const passed = correctCount >= 2; // Needs at least 2 correct out of 3
  const hasNextStage = questions.some(q => q.category === categoryId && q.stage === stageNum + 1);

  // Perfect: 100 XP, Pass (2/3): 60 XP, Fail (0 or 1/3): 15 XP
  let calculatedXP = 15;
  if (correctCount === 3) {
    calculatedXP = 100;
  } else if (correctCount === 2) {
    calculatedXP = 60;
  }

  const shareText = `🏆 لقد حققت إنجازاً متميزاً في كويز المعرفة المغربية وبطولات شواهد الوطن! 🇲🇦✨

📚 القسم: ${categoryDetails?.name || 'عامة'}
🕹️ المرحلة: ${stageNum}
🎯 النتيجة: ${correctCount}/${totalCount} إجابات صحيحة
📈 نقاط الخبرة المكتسبة: +${calculatedXP} XP
👑 مستواي الحالي: ${user?.level || 1}

💡 هل يمكنك تحدي مستواي والإجابة عن الأسئلة الصعبة؟ جرب اللعبة الآن!
🔗 ${window.location.origin}`;

  const handleCopy = () => {
    if (soundEnabled) soundEffects.playClick();
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (soundEnabled) soundEffects.playClick();
    try {
      await navigator.share({
        title: 'كويز المعرفة المغربية',
        text: shareText,
        url: window.location.origin
      });
    } catch (e) {
      console.warn("Native share cancelled or failed:", e);
    }
  };

  useEffect(() => {
    if (!user) return;

    // Calculate XP reward
    // Perfect: 100 XP, Pass (2/3): 60 XP, Fail (0 or 1/3): 15 XP
    let rewardXP = 15;
    if (correctCount === 3) {
      rewardXP = 100;
    } else if (correctCount === 2) {
      rewardXP = 60;
    }

    // Apply XP
    const { levelUp } = addXP(rewardXP);

    // If passed, unlock the next stage
    if (passed) {
      const currentUnlocked = user.unlockedStages[categoryId] || 1;
      // Unlock next stage ONLY if they completed their highest reached stage
      if (stageNum === currentUnlocked) {
        unlockNextStage(categoryId);
      }
    }

    // Check newly obtained badges
    setTimeout(() => {
      const newlyUnlocked = checkAchievements();
      setNewAchievements(newlyUnlocked);
    }, 500);

    setXpReport({
      gained: rewardXP,
      total: user.totalXP + rewardXP,
      levelUp
    });

    if (soundEnabled) {
      if (passed) {
        soundEffects.playFanfare();
      } else {
        soundEffects.playWrong();
      }
    }
  }, []);

  return (
    <div className="w-full space-y-5 select-none pb-12 text-center relative">
      
      {/* 1. SCORE GREETING CELEBRATION CARD */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`w-full rounded-2xl p-6 border shadow-2xl relative overflow-hidden text-center ${
          theme === 'dark' 
            ? 'bg-slate-950/70 border-amber-500/10 shadow-black/50' 
            : 'bg-white border-emerald-800/10 shadow-emerald-950/5'
        }`}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 text-9xl">🎁</div>

        {/* Dynamic visual badges */}
        <div className="inline-flex justify-center mb-3">
          {passed ? (
            <motion.div 
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/20"
            >
              <Trophy className="w-10 h-10" />
            </motion.div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-500/10 text-slate-400 flex items-center justify-center border-2 border-slate-500/15">
              <RotateCcw className="w-10 h-10 animate-spin-slow" />
            </div>
          )}
        </div>

        <h2 className={`text-xl font-black ${passed ? 'text-amber-400' : 'text-rose-500'}`}>
          {passed ? 'مبارك! لقد مررت المرحلة بنجاح' : 'حاول مجدداً! لم يحالفك الحظ'}
        </h2>
        
        <p className="text-xs opacity-80 mt-1 max-w-xs mx-auto leading-relaxed">
          {categoryDetails?.name} | المرحلة {stageNum}
        </p>

        {/* Large correct fraction view */}
        <div className="my-5 flex items-center justify-center space-x-1.5 space-x-reverse">
          <span className={`text-5xl font-black ${passed ? 'text-emerald-500' : 'text-slate-400'}`}>{correctCount}</span>
          <span className="text-2xl font-bold opacity-50">/</span>
          <span className="text-2xl font-bold opacity-90">{totalCount}</span>
          <span className="text-xs font-bold opacity-80 pl-2">إجابات صحيحة</span>
        </div>

        {/* XP reward summary bubble */}
        <div className={`inline-flex py-2 px-4 rounded-xl items-center space-x-2 space-x-reverse border ${
          passed 
            ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' 
            : 'bg-slate-500/10 border-white/5 text-slate-300'
        }`}>
          <Award className="w-4 h-4 fill-current" />
          <span className="text-xs font-bold leading-none">جائزتك المكسبة: +{xpReport.gained} XP</span>
        </div>

        {passed && hasNextStage && (
          <div className="mt-4 flex items-center justify-center space-x-1.5 space-x-reverse text-amber-500 bg-amber-500/10 border border-amber-500/15 py-1.5 px-3 rounded-xl max-w-xs mx-auto">
            <span className="text-xs">🔓</span>
            <span className="text-[10px] font-black leading-none">انقر بالأسفل لولوج المرحلة الموالية {stageNum + 1}!</span>
          </div>
        )}
      </motion.div>

      {/* 2. DYNAMIC LEVEL UP FLASH WARNING */}
      {xpReport.levelUp && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full rounded-2xl p-4 bg-gradient-to-r from-teal-500 to-emerald-600 border border-emerald-400 text-white shadow-xl flex items-center justify-between text-right"
        >
          <div>
            <h4 className="text-sm font-black">مستوى جديد مكتسب! 🎉</h4>
            <p className="text-[10px] opacity-90 mt-0.5">تهانينا! رقيت مهاراتك لتصل للمستوى {user?.level} بنجاح.</p>
          </div>
          <span className="text-2xl">👑</span>
        </motion.div>
      )}

      {/* 3. DYNAMIC HISTORICAL REVIEW ACCORDION */}
      {reviews.length > 0 && (
        <div className={`p-4 rounded-2xl border text-right ${
          theme === 'dark' ? 'bg-slate-950/50 border-slate-500/10' : 'bg-white border-[#064e3b]/10'
        }`}>
          <h3 className={`text-xs font-black mb-3 ${theme === 'dark' ? 'text-amber-400' : 'text-emerald-950'}`}>تدقيق جولات كويز</h3>
          
          <div className="space-y-2">
            {reviews.map((rev: any, i: number) => (
              <div 
                key={i} 
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                  rev.isCorrect 
                    ? theme === 'dark' ? 'bg-emerald-950/10 border-emerald-500/10 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : theme === 'dark' ? 'bg-rose-950/10 border-rose-500/10 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                <div className="flex items-center space-x-2 space-x-reverse pr-1">
                  {rev.isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  <span className="truncate max-w-[190px]">السؤال {i + 1}</span>
                </div>
                <div className="text-[10px] opacity-80 pl-1 text-left">
                  {rev.isCorrect ? 'صحيحة' : 'غير صحيحة'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Share Achievement Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`w-full rounded-2xl p-5 border text-right relative overflow-hidden transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-slate-950/50 border-slate-500/10 shadow-black/30' 
            : 'bg-white border-emerald-800/10 shadow-emerald-950/5'
        }`}
      >
        <div className="flex items-center justify-between mb-3 border-b pb-2.5 border-dashed border-slate-500/10">
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-xl">📢</span>
            <h3 className={`text-xs font-black ${theme === 'dark' ? 'text-amber-400' : 'text-emerald-950'}`}>
              شارك إنجازك الثقافي مع أصدقائك
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded-full">
            تحدَّ الجميع!
          </span>
        </div>

        <p className="text-[11px] opacity-80 mb-3.5 leading-relaxed">
          انشر نتيجتك المشرّفة وأخبر رفقاءك بمستواك وعلمك الثقافي في سيرة وتاريخ المغرب الحبيب ومختلف العلوم!
        </p>

        {/* Text Preview Box */}
        <div className={`p-3 rounded-xl border text-[11px] text-right font-semibold leading-relaxed mb-4 max-h-24 overflow-y-auto select-all cursor-text whitespace-pre-wrap ${
          theme === 'dark' ? 'bg-slate-900/60 border-slate-500/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          {shareText}
        </div>

        {/* Buttons Flex list */}
        <div className="flex flex-wrap gap-2 justify-center">
          
          {/* Clipboard Copy Button */}
          <button
            onClick={handleCopy}
            className={`flex-1 min-w-[110px] p-2.5 rounded-xl border font-bold flex items-center justify-center space-x-1.5 space-x-reverse text-[11px] transition-all cursor-pointer ${
              copied 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : theme === 'dark' 
                  ? 'bg-slate-900 border-slate-500/10 hover:bg-slate-800 text-slate-300' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'تم النسخ!' : 'نسخ النص'}</span>
          </button>

          {/* Web Share (Mobile Native) - only visible if supported */}
          {canNativeShare && (
            <button
              onClick={handleNativeShare}
              className={`flex-1 min-w-[110px] p-2.5 rounded-xl border font-bold flex items-center justify-center space-x-1.5 space-x-reverse text-[11px] transition-all cursor-pointer ${
                theme === 'dark' 
                  ? 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/15 text-amber-300' 
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-100'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>مشاركة سريعة</span>
            </button>
          )}

          {/* WhatsApp share */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundEnabled && soundEffects.playClick()}
            className="flex-1 min-w-[110px] p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center space-x-1.5 space-x-reverse text-[11px] hover:scale-[1.02] active:scale-[0.98] transition-all text-center"
          >
            <span className="text-sm">💬</span>
            <span>واتساب</span>
          </a>

          {/* Twitter / X share */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundEnabled && soundEffects.playClick()}
            className={`flex-1 min-w-[110px] p-2.5 font-bold rounded-xl flex items-center justify-center space-x-1.5 space-x-reverse text-[11px] hover:scale-[1.02] active:scale-[0.98] transition-all text-center ${
              theme === 'dark'
                ? 'bg-slate-900 text-white border border-slate-800 hover:bg-slate-800'
                : 'bg-slate-950 text-white hover:bg-slate-900'
            }`}
          >
            <span className="font-sans font-bold">𝕏</span>
            <span>إكس / تويتر</span>
          </a>

          {/* Facebook share */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundEnabled && soundEffects.playClick()}
            className="flex-1 min-w-[110px] p-2.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center space-x-1.5 space-x-reverse text-[11px] hover:scale-[1.02] active:scale-[0.98] transition-all text-center"
          >
            <span className="text-sm">👥</span>
            <span>فيسبوك</span>
          </a>

        </div>
      </motion.div>

      {/* 4. ACTIONS REDIRECT HUB */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        
        {/* NEXT STAGE DIRECT ACCESS BUTTON */}
        {passed && hasNextStage && (
          <motion.button
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: [1, 1.02, 1], opacity: 1 }}
            transition={{ 
              scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
              opacity: { duration: 0.3 }
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (soundEnabled) soundEffects.playClick();
              navigate(`/quiz?category=${categoryId}&stage=${stageNum + 1}`);
            }}
            className="col-span-2 p-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black rounded-2xl shadow-[0_4px_20px_rgba(245,158,11,0.25)] flex items-center justify-center space-x-2 space-x-reverse text-xs cursor-pointer border border-amber-300/30 transition-all select-none"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>الانتقال إلى المرحلة الموالية (مرحلة {stageNum + 1})</span>
            <ArrowLeft className="w-4 h-4 text-slate-950" />
          </motion.button>
        )}

        {passed && !hasNextStage && (
          <div className={`col-span-2 p-4 rounded-2xl border text-center ${
            theme === 'dark' ? 'bg-[#122e1b]/40 border-emerald-500/20 text-emerald-300' : 'bg-emerald-50 border-emerald-500/30 text-emerald-950'
          }`}>
            <span className="text-xl block mb-1">🎉 🇲🇦 👑</span>
            <p className="text-xs font-black">تهانينا الحارة! لقد أتممت جميع مراحل هذا القسم بجدارة كحكيم سين وجيم!</p>
          </div>
        )}

        {/* REPLAY STAGE */}
        <button
          onClick={() => {
            if (soundEnabled) soundEffects.playClick();
            navigate(`/quiz?category=${categoryId}&stage=${stageNum}`);
          }}
          className={`p-3.5 rounded-2xl border font-bold flex items-center justify-center space-x-1.5 space-x-reverse text-xs cursor-pointer ${
            theme === 'dark' 
              ? 'bg-slate-900 border-amber-500/15 hover:bg-slate-800 text-amber-300' 
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>أعد المحاولة</span>
        </button>

        {/* GO TO ALL CATEGORIES */}
        <button
          onClick={() => {
            if (soundEnabled) soundEffects.playClick();
            navigate('/categories');
          }}
          className="p-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center space-x-1.5 space-x-reverse text-xs cursor-pointer"
        >
          <Map className="w-4 h-4" />
          <span>تصفح الأقسام</span>
        </button>

        {/* HOME COMPONENT */}
        <button
          onClick={() => {
            if (soundEnabled) soundEffects.playClick();
            navigate('/');
          }}
          className={`col-span-2 p-3.5 rounded-2xl border font-bold flex items-center justify-center space-x-1.5 space-x-reverse text-xs cursor-pointer ${
            theme === 'dark' 
              ? 'bg-slate-950/60 border-slate-500/10 hover:bg-slate-900 text-slate-300' 
              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>الولوج للرئيسية</span>
        </button>

      </div>

      {/* FLOATING DIALOG UNLOCKED ACHIEVEMENTS CARDS */}
      <AnimatePresence>
        {newAchievements.length > 0 && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-5">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl p-6 bg-slate-900 border-2 border-amber-500 text-center shadow-2xl space-y-4"
            >
              <div className="text-5xl animate-bounce">🏆</div>
              <h3 className="text-xl font-black text-amber-400">إنجاز جديد في سيرة المعرفة!</h3>
              <p className="text-xs text-white opacity-80 leading-relaxed max-w-xs mx-auto">
                لقد طوقت مجهوداتك الثقافية بحصد أوسمة أبطال أمين المغربيين التالية:
              </p>

              <div className="space-y-2">
                {newAchievements.map((title, i) => (
                  <div key={i} className="py-2.5 px-4 bg-amber-500/10 rounded-xl text-amber-300 text-xs font-bold border border-amber-500/15">
                     🎗️ {title}
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  if (soundEnabled) soundEffects.playClick();
                  setNewAchievements([]);
                }}
                className="w-full mt-2 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black rounded-xl text-xs hover:scale-105 transition-all cursor-pointer"
              >
                متابعة تجميع المسابقات
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
