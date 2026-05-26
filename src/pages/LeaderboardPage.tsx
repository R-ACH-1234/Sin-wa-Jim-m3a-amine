import React, { useEffect, useState } from 'react';
import { useQuizStore } from '../store/useQuizStore';
import { soundEffects } from '../utils/audio';
import { Trophy, Award, Sparkles, User, Medal, RefreshCw } from 'lucide-react';

export default function LeaderboardPage() {
  const { leaderboard, theme, user, fetchRealLeaderboard, soundEnabled } = useQuizStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchRealLeaderboard().finally(() => setLoading(false));
  }, []);

  const handleManualRefresh = () => {
    if (soundEnabled) soundEffects.playClick();
    setLoading(true);
    fetchRealLeaderboard().finally(() => setLoading(false));
  };

  const currentUserEntryIndex = leaderboard.findIndex(entry => entry.isCurrentUser);
  const displayRank = currentUserEntryIndex !== -1 ? currentUserEntryIndex + 1 : leaderboard.length;

  return (
    <div className="w-full space-y-4 select-none pb-12 text-right">
      
      {/* 1. HUD HEADER */}
      <div className="flex items-center justify-between">
        <button 
          onClick={handleManualRefresh}
          disabled={loading}
          className={`p-2 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
            theme === 'dark' 
              ? 'bg-slate-900 border-slate-700/30 text-amber-400' 
              : 'bg-white border-slate-200 text-emerald-950 shadow-sm'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-500' : ''}`} />
        </button>

        <div>
          <h2 className={`text-xl font-black ${theme === 'dark' ? 'text-amber-400' : 'text-emerald-950'}`}>مجلس حكماء سين وجيم</h2>
          <p className="text-xs opacity-75 mt-0.5">ترتيب عباقرة وأذكياء التطبيق بنقاط الـ XP. هل يمكنك اللحاق بالصدارة؟</p>
        </div>
      </div>

      {/* 2. PODIUM HUD */}
      <div className="grid grid-cols-3 gap-2.5 pt-2">
        
        {/* 2nd Place */}
        {leaderboard[1] && (
          <div className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-end relative h-36 ${
            theme === 'dark' ? 'bg-slate-900/30 border-slate-700/30' : 'bg-slate-100/50 border-slate-200'
          }`}>
            <span className="text-2xl mb-1">{leaderboard[1].avatar}</span>
            <span className="text-[10px] font-bold truncate max-w-[80px]">{leaderboard[1].username}</span>
            <span className="text-[9px] opacity-75 mt-0.5">{leaderboard[1].xp} XP</span>
            <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 text-xs font-black flex items-center justify-center mt-2.5 shadow-md">2</div>
          </div>
        )}

        {/* 1st Place (Winner) */}
        {leaderboard[0] && (
          <div className={`p-4.5 rounded-2xl border-2 text-center flex flex-col items-center justify-end relative h-40 ${
            theme === 'dark' ? 'bg-amber-950/20 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'bg-amber-50 border-amber-500/20 shadow-md'
          }`}>
            {/* Crown decoration element */}
            <div className="absolute top-1 right-1/2 translate-x-1/2 text-lg animate-bounce">👑</div>
            <span className="text-3xl mb-1.5">{leaderboard[0].avatar}</span>
            <span className="text-[11px] font-black truncate max-w-[90px] text-amber-500">{leaderboard[0].username}</span>
            <span className="text-[10px] font-bold mt-0.5">{leaderboard[0].xp} XP</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 text-xs font-black flex items-center justify-center mt-2.5 shadow-lg shadow-amber-500/20">1</div>
          </div>
        )}

        {/* 3rd Place */}
        {leaderboard[2] && (
          <div className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-end relative h-36 ${
            theme === 'dark' ? 'bg-slate-900/30 border-slate-700/30' : 'bg-slate-100/50 border-slate-200'
          }`}>
            <span className="text-2xl mb-1">{leaderboard[2].avatar}</span>
            <span className="text-[10px] font-bold truncate max-w-[80px]">{leaderboard[2].username}</span>
            <span className="text-[9px] opacity-75 mt-0.5">{leaderboard[2].xp} XP</span>
            <div className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-black flex items-center justify-center mt-2.5 shadow-md">3</div>
          </div>
        )}

      </div>

      {/* 3. SCROLLABLE LEADERBOARD TABLE */}
      <div className={`rounded-2xl border overflow-hidden ${
        theme === 'dark' ? 'bg-slate-950/50 border-slate-500/10' : 'bg-white border-[#064e3b]/10'
      }`}>
        <div className="divide-y divide-slate-500/10">
          {leaderboard.map((entry, index) => {
            const isSelf = entry.isCurrentUser;
            
            return (
              <div 
                key={entry.id} 
                className={`p-3.5 flex items-center justify-between transition-all ${
                  isSelf 
                    ? theme === 'dark' 
                      ? 'bg-amber-500/10' 
                      : 'bg-emerald-50 text-emerald-950 font-bold'
                    : 'hover:bg-slate-500/5'
                }`}
              >
                {/* Right cell: Rank number & Avatar & Username */}
                <div className="flex items-center space-x-3.5 space-x-reverse text-right">
                  <span className={`w-5 text-xs font-black text-center ${
                    index === 0 ? 'text-amber-500' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-amber-700' : 'opacity-65'
                  }`}>
                    #{index + 1}
                  </span>
                  
                  <div className="w-9 h-9 rounded-xl bg-slate-500/5 border border-slate-500/10 flex items-center justify-center text-lg">
                    {entry.avatar}
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold block">{entry.username}</span>
                    <span className="text-[9px] opacity-65 leading-none">مستوى {entry.level}</span>
                  </div>
                </div>

                {/* Left cell: XP points & self indicator badge */}
                <div className="flex items-center space-x-3 space-x-reverse">
                  <span className="text-xs font-mono font-black">{entry.xp} XP</span>
                  {isSelf && (
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                      theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-600 text-white'
                    }`}>أنت</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. CURRENT USER SUMMARY STICKER */}
      {user && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between text-right shadow-md ${
          theme === 'dark' ? 'bg-slate-900 border-amber-500/15' : 'bg-amber-50 border-amber-500/20 text-slate-900'
        }`}>
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center text-xl shadow-md">
              🏅
            </div>
            <div>
              <p className="text-[10px] opacity-75 leading-none">مركزك الإجمالي الحالي</p>
              <h4 className="text-xs font-black mt-1">الرتبة رقم #{displayRank} بالمسابقة</h4>
            </div>
          </div>

          <span className="text-xs font-bold opacity-80">تحتاج +{(leaderboard[0]?.xp - user.totalXP) > 0 ? (leaderboard[0]?.xp - user.totalXP) : 0} XP للحاق بالمركز الأول!</span>
        </div>
      )}

    </div>
  );
}
