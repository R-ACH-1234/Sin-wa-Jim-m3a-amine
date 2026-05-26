import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/useQuizStore';
import { CATEGORIES } from '../data/initialQuestions';
import { soundEffects } from '../utils/audio';
import { hapticFeedback } from '../utils/vibrator';
import { HelpCircle, Clock, Volume2, ArrowLeft, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TIMER_DURATION = 30; // 30 seconds per question

export default function QuizPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category') || 'morocco';
  const stageNum = parseInt(searchParams.get('stage') || '1', 10);
  
  const { questions, theme, soundEnabled, updateUser, addXP, completeQuestion } = useQuizStore();

  // Load questions for this specific category and stage
  const quizQuestions = questions.filter(
    q => q.category === categoryId && q.stage === stageNum
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [progressCount, setProgressCount] = useState({ correct: 0, wrong: 0 });
  const [answerReview, setAnswerReview] = useState<{ id: string; isCorrect: boolean; selected: string; correct: string }[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const categoryDetails = CATEGORIES.find(c => c.id === categoryId);
  const activeQuestion = quizQuestions[currentIndex];

  // 1. Timer logic
  useEffect(() => {
    if (!activeQuestion || isAnswered) return;

    setTimeLeft(TIMER_DURATION);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        if (soundEnabled && prev <= 4) {
          soundEffects.playTick(); // Tick-tock on warning
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, activeQuestion, isAnswered]);

  const handleTimeOut = () => {
    if (soundEnabled) soundEffects.playWrong();
    hapticFeedback.vibrateWrong();
    setIsAnswered(true);
    setSelectedOption(''); // No option selected means time out
    setProgressCount(prev => ({ ...prev, wrong: prev.wrong + 1 }));
    setAnswerReview(prev => [
      ...prev,
      {
        id: activeQuestion.id,
        isCorrect: false,
        selected: '[انتهى الوقت ⏱️]',
        correct: activeQuestion.correctAnswer
      }
    ]);
  };

  const handleAnswerSelect = (option: string) => {
    if (isAnswered) return; // Prevent double taps

    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === activeQuestion.correctAnswer;

    if (isCorrect) {
      if (soundEnabled) soundEffects.playSuccess();
      hapticFeedback.vibrateCorrect();
      setProgressCount(prev => ({ ...prev, correct: prev.correct + 1 }));
      // Save completed question in database
      completeQuestion(activeQuestion.id);
    } else {
      if (soundEnabled) soundEffects.playWrong();
      hapticFeedback.vibrateWrong();
      setProgressCount(prev => ({ ...prev, wrong: prev.wrong + 1 }));
    }

    setAnswerReview(prev => [
      ...prev,
      {
        id: activeQuestion.id,
        isCorrect,
        selected: option,
        correct: activeQuestion.correctAnswer
      }
    ]);
  };

  const handleNextQuestion = () => {
    if (soundEnabled) soundEffects.playClick();
    hapticFeedback.vibrateLight();
    
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Stage completed! Redirect to results screen with stats
      const correctAnswers = progressCount.correct;
      const totalQuestions = quizQuestions.length;
      
      navigate(`/result?category=${categoryId}&stage=${stageNum}&correct=${correctAnswers}&total=${totalQuestions}`, {
        state: { reviews: answerReview }
      });
    }
  };

  // If no questions in current stage, display fallback warning
  if (quizQuestions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none relative z-10 w-full">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className={`text-lg font-black mb-2 ${theme === 'dark' ? 'text-amber-400' : 'text-emerald-900'}`}>
          عذراً، أسئلة قيد التدقيق!
        </h3>
        <p className="text-xs opacity-75 max-w-xs mb-6">
          المرحلة {stageNum} في تصنيف {categoryDetails?.name || categoryId} خاضعة للمراجعة والتدقيق الإداري حالياً.
        </p>
        <button
          onClick={() => {
            if (soundEnabled) soundEffects.playClick();
            navigate('/categories');
          }}
          className="py-3 px-5 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg cursor-pointer text-xs"
        >
          عودة لتصنيفات الكويز
        </button>
      </div>
    );
  }

  const timerPercentage = (timeLeft / TIMER_DURATION) * 100;

  return (
    <div className="w-full space-y-4 select-none pb-12 text-right">
      
      {/* 1. STAGE & CATEGORY METADATA HUD */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 space-x-reverse">
          <span className={`w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse`} />
          <span className="text-xs font-bold opacity-85">مستمر للتحدي...</span>
        </div>
        
        <div className="text-right">
          <h2 className="text-[10px] uppercase font-bold text-amber-500 leading-none">
            {categoryDetails?.name || 'تصنيف'} | المرحلة {stageNum}
          </h2>
          <span className="text-xs font-bold leading-none mt-1 inline-block">
            سؤال {currentIndex + 1} من {quizQuestions.length}
          </span>
        </div>
      </div>

      {/* 2. TIMER INDICATOR BAR (With warning color transitions) */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[11px] font-mono font-bold">
          <span className={`flex items-center space-x-1 space-x-reverse ${timeLeft <= 4 ? 'text-rose-500 animate-bounce' : 'text-amber-500'}`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft} ثانية</span>
          </span>
          <span className="opacity-80">الوقت المتبقي لـلإجـابـة</span>
        </div>
        
        <div className={`w-full h-2 rounded-full overflow-hidden border ${theme === 'dark' ? 'bg-slate-900 border-white/5' : 'bg-slate-200 border-slate-300/40'}`}>
          <motion.div 
            className={`h-full transition-all ease-linear duration-1000 ${
              timeLeft <= 4
                ? 'bg-gradient-to-r from-rose-600 to-red-500'
                : 'bg-gradient-to-r from-amber-500 to-emerald-400'
            }`}
            style={{ width: `${timerPercentage}%` }}
          />
        </div>
      </div>

      {/* 3. & 4. QUESTION & OPTIONS ANIMATED CONTAINER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -30, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
          className="space-y-4"
        >
          {/* QUESTION HERO PANEL (Glassmorphic Card) */}
          <div 
            className={`w-full rounded-2xl p-5 border shadow-xl relative overflow-hidden ${
              theme === 'dark' 
                ? 'bg-slate-950/70 border-amber-500/10 shadow-black/40' 
                : 'bg-white border-emerald-800/10 shadow-emerald-950/5'
            }`}
          >
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <HelpCircle className="w-16 h-16 text-emerald-500" />
            </div>

            <p className={`text-base font-black leading-relaxed relative z-10 ${
              theme === 'dark' ? 'text-amber-100' : 'text-emerald-950'
            }`}>
              {activeQuestion.question}
            </p>
          </div>

          {/* MCQ OPTIONS LIST */}
          <div className="space-y-2.5 pt-1.5 font-sans">
            {activeQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrectAnswer = option === activeQuestion.correctAnswer;
              
              let optionThemeClasses = '';

              if (isAnswered) {
                if (isCorrectAnswer) {
                  // Highlight correct answer in Green
                  optionThemeClasses = theme === 'dark'
                    ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'bg-emerald-100/70 border-emerald-600 text-emerald-900 font-bold';
                } else if (isSelected) {
                  // Highlight selected incorrect option in Red
                  optionThemeClasses = theme === 'dark'
                    ? 'bg-rose-950/50 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                    : 'bg-rose-100/70 border-rose-600 text-rose-900 font-bold';
                } else {
                  // Dimm unselected incorrect options once answered
                  optionThemeClasses = 'opacity-40 cursor-default border-slate-200/50 text-slate-500';
                }
              } else {
                // Normal clickable state
                optionThemeClasses = theme === 'dark'
                  ? 'bg-slate-900/40 border-slate-800/60 hover:border-amber-500/40 hover:bg-slate-900 hover:text-white'
                  : 'bg-white border-slate-200 hover:border-emerald-600 hover:bg-slate-50 text-emerald-950';
              }

              return (
                <motion.button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleAnswerSelect(option)}
                  whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                  className={`w-full p-4 rounded-xl border-2 text-right transition-all text-xs font-semibold cursor-pointer shadow-sm relative flex items-center justify-between ${optionThemeClasses}`}
                >
                  <div className="flex items-center space-x-2.5 space-x-reverse">
                    <span className={`w-6 h-6 rounded-lg text-center flex items-center justify-center font-bold text-[10px] ${
                      isSelected 
                        ? 'bg-amber-400 text-slate-950' 
                        : theme === 'dark' ? 'bg-slate-800 text-amber-200' : 'bg-slate-100 text-emerald-800'
                    }`}>
                      {String.fromCharCode(1605 + idx)} {/* م ي د ح Arabic letters representation */}
                    </span>
                    <span>{option}</span>
                  </div>
                  
                  {isAnswered && isCorrectAnswer && (
                    <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md">إجابة صحيحة</span>
                  )}
                  {isAnswered && isSelected && !isCorrectAnswer && (
                    <span className="text-[10px] font-black bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-md">خاطئة</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 5. ANSWER EXPLANATION & ACCORDION PREVIEW */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`rounded-xl p-4 border mt-2 border-dashed relative overflow-hidden ${
              theme === 'dark' 
                ? 'bg-slate-900/40 border-amber-500/20 text-amber-100' 
                : 'bg-amber-500/5 border-amber-500/20 text-slate-900'
            }`}
          >
            <div className="flex items-center space-x-2 space-x-reverse mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-black">الشرح والتوضيح من أمين:</h4>
            </div>
            <p className="text-[11px] leading-relaxed opacity-95">
              {activeQuestion.explanation || 'لا يوجد شرح متاح لهذا السؤال الثقافي في الوقت الراهن.'}
            </p>

            {/* Navigation Next button */}
            <div className="flex justify-end pt-3">
              <button
                onClick={handleNextQuestion}
                className="py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-lg shadow-md cursor-pointer text-xs flex items-center space-x-1.5 space-x-reverse"
              >
                <span>{currentIndex < quizQuestions.length - 1 ? 'السؤال التالي' : 'عرض النتيجة الكاملة'}</span>
                {currentIndex < quizQuestions.length - 1 ? <ArrowLeft className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
