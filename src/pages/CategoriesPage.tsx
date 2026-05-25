import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/useQuizStore';
import { CATEGORIES } from '../data/initialQuestions';
import { soundEffects } from '../utils/audio';
import { 
  Lock, 
  Unlock, 
  CheckCircle2, 
  BookOpen, 
  ChevronDown, 
  ChevronUp,
  Award,
  Globe,
  Compass,
  Moon,
  Trophy,
  Map,
  Cpu,
  Atom,
  PenTool,
  Brain,
  Rabbit,
  Sparkles,
  Film,
  Gamepad2,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Dynamic icon resolver from lucide
const iconMap: Record<string, any> = {
  Compass,
  Globe,
  Moon,
  BookOpen,
  Trophy,
  Map,
  Cpu,
  Atom,
  PenTool,
  Brain,
  Rabbit,
  Sparkles,
  Film,
  Gamepad2
};

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { user, questions, theme, soundEnabled } = useQuizStore();
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  const toggleCategory = (id: string) => {
    if (soundEnabled) soundEffects.playClick();
    setExpandedCategoryId(prev => prev === id ? null : id);
  };

  // Helper to calculate total stages available in our database for a category
  const getStagesForCategory = (catId: string) => {
    const catQuestions = questions.filter(q => q.category === catId);
    if (catQuestions.length === 0) return [];
    
    // Find unique stage numbers in database
    const stageNumbers = Array.from(new Set(catQuestions.map(q => q.stage)));
    return stageNumbers.sort((a, b) => a - b);
  };

  return (
    <div className="w-full space-y-4 select-none pb-12 text-right">
      
      <div className="mb-2">
        <h2 className={`text-xl font-black ${theme === 'dark' ? 'text-amber-400' : 'text-emerald-950'}`}>أقسام المعرفة والمراحل</h2>
        <p className="text-xs opacity-75 mt-0.5">كل مرحلة تحتوي على 3 أسئلة فقط. أجب بشكل صحيح لفتح المراحل القادمة!</p>
      </div>

      <div className="space-y-3">
        {CATEGORIES.map((category, idx) => {
          const IconComponent = iconMap[category.icon] || HelpCircle;
          const isExpanded = expandedCategoryId === category.id;
          
          // Stages calculation
          const listStages = getStagesForCategory(category.id);
          const unlockedCount = user?.unlockedStages[category.id] || 1; 

          return (
            <motion.div
              layout="position"
              key={category.id}
              className={`rounded-2xl border-2 transition-all shadow-md overflow-hidden ${
                isExpanded 
                  ? theme === 'dark' 
                    ? 'bg-slate-900 border-amber-500/30' 
                    : 'bg-white border-emerald-800/20'
                  : theme === 'dark'
                    ? 'bg-slate-950/50 border-slate-900'
                    : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
            >
              {/* Category Main Header Card Row */}
              <div 
                onClick={() => toggleCategory(category.id)}
                className="p-4 flex items-center justify-between cursor-pointer w-full select-none"
              >
                <div className="flex items-center space-x-3.5 space-x-reverse">
                  {/* Visual Left Colored Icon badge */}
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${category.color} text-white flex items-center justify-center shadow-md shadow-slate-900/10`}>
                    <IconComponent className="w-5.5 h-5.5" />
                  </div>
                  <div className="text-right">
                    <h3 className="text-sm font-black">{category.name}</h3>
                    <p className="text-[10px] opacity-75 mt-0.5 line-clamp-1 max-w-[190px]">{category.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className={`text-[10px] font-bold py-1 px-2.5 rounded-full ${
                    theme === 'dark' ? 'bg-slate-800 text-amber-300' : 'bg-emerald-50 text-emerald-800'
                  }`}>
                    مستويات: {listStages.length > 0 ? listStages.length : 0}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 opacity-75" /> : <ChevronDown className="w-4 h-4 opacity-75" />}
                </div>
              </div>

              {/* Opened stages roadmap list */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={`border-t border-dashed px-4 py-3.5 space-y-2.5 ${
                      theme === 'dark' ? 'bg-black/25 border-slate-800' : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    {listStages.length === 0 ? (
                      <div className="text-center py-4 text-xs opacity-60">
                        {`قريباً: أسئلة ممتعة في تصنيف ${category.name}!`}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        {listStages.map((stageNum) => {
                          const isUnlocked = stageNum <= unlockedCount;
                          const isCompleted = stageNum < unlockedCount;

                          return (
                            <button
                              key={stageNum}
                              disabled={!isUnlocked}
                              onClick={() => {
                                if (soundEnabled) soundEffects.playClick();
                                navigate(`/quiz?category=${category.id}&stage=${stageNum}`);
                              }}
                              className={`w-full p-3 rounded-xl border flex items-center justify-between text-right transition-all select-none ${
                                isCompleted
                                  ? theme === 'dark'
                                    ? 'bg-emerald-950/15 border-emerald-500/20 text-emerald-300'
                                    : 'bg-emerald-50/70 border-emerald-500/20 text-emerald-800 font-bold'
                                  : isUnlocked
                                    ? theme === 'dark'
                                      ? 'bg-amber-950/10 border-amber-500/30 text-amber-300 hover:bg-amber-950/20'
                                      : 'bg-amber-500/10 border-amber-500/30 text-amber-900 font-bold hover:bg-amber-500/20'
                                    : theme === 'dark'
                                      ? 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
                                      : 'bg-slate-100/60 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                              }`}
                            >
                              <div className="flex items-center space-x-3.5 space-x-reverse">
                                <div className="text-xs font-bold font-sans">
                                  {`الـمـرحـلـة ${stageNum}`}
                                </div>
                                <div className="text-[10px] opacity-75 leading-none">
                                  {isCompleted ? 'مكتملة بنجاح (3/3)' : isUnlocked ? 'مفتوحة ومتاحة للعب' : 'تحتاج إكمال المراحل السابقة'}
                                </div>
                              </div>

                              <div>
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                                ) : isUnlocked ? (
                                  <Unlock className="w-5 h-5 text-amber-500" />
                                ) : (
                                  <Lock className="w-4 h-4 text-slate-400" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
