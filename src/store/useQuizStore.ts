import { create } from 'zustand';
import { UserProfile, Question, LeaderboardEntry, Achievement } from '../types';
import { INITIAL_QUESTIONS, ACHIEVEMENTS } from '../data/initialQuestions';
import { collection, doc, setDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../utils/firebase';

interface QuizState {
  user: UserProfile | null;
  questions: Question[];
  soundEnabled: boolean;
  theme: 'light' | 'dark';
  leaderboard: LeaderboardEntry[];
  leaderboardError: string | null;
  achievements: Achievement[];
  
  // App initialization
  initApp: () => void;
  buildLeaderboard: (currentUser: UserProfile | null) => LeaderboardEntry[];
  fetchRealLeaderboard: () => Promise<void>;
  
  // User profile actions
  registerUser: (username: string, avatar: string) => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => void;
  addXP: (amount: number) => { levelUp: boolean; xpEarned: number };
  claimDailyReward: () => number | null; // returns XP claimed or null
  
  // Game state actions
  unlockNextStage: (categoryId: string) => void;
  completeQuestion: (questionId: string) => void;
  checkAchievements: () => string[]; // returns newly unlocked achievement titles
  
  // Settings
  setSoundEnabled: (enabled: boolean) => void;
  toggleTheme: () => void;
  
  // Admin actions
  addQuestion: (q: Omit<Question, 'id'>) => void;
  updateQuestion: (q: Question) => void;
  deleteQuestion: (id: string) => void;
  bulkUploadQuestions: (jsonStr: string) => { success: boolean; count: number; error?: string };
  resetAllProgress: () => void;
  resetQuestionsToDefault: () => void;
}

const DEFAULT_LEADERBOARD: Omit<LeaderboardEntry, 'isCurrentUser'>[] = [];

export const useQuizStore = create<QuizState>((set, get) => ({
  user: null,
  questions: [],
  soundEnabled: true,
  theme: 'dark',
  leaderboard: [],
  leaderboardError: null,
  achievements: ACHIEVEMENTS,

  initApp: () => {
    // 1. Load sound option
    const savedSound = localStorage.getItem('s_g_sound');
    const soundEnabled = savedSound !== null ? savedSound === 'true' : true;

    // 2. Load theme
    const savedTheme = localStorage.getItem('s_g_theme') as 'light' | 'dark' | null;
    const theme = savedTheme || 'dark';
    
    // Apply HTML class
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // 3. Load user
    const savedUserStr = localStorage.getItem('s_g_user');
    let user: UserProfile | null = null;
    if (savedUserStr) {
      try {
        user = JSON.parse(savedUserStr);
      } catch (e) {
        user = null;
      }
    }

    // 4. Load questions (editable database)
    const savedQuestionsStr = localStorage.getItem('s_g_questions');
    let questionsList = INITIAL_QUESTIONS;
    if (savedQuestionsStr) {
      try {
        const parsed = JSON.parse(savedQuestionsStr);
        if (Array.isArray(parsed) && parsed.length === INITIAL_QUESTIONS.length) {
          questionsList = parsed;
        } else {
          questionsList = INITIAL_QUESTIONS;
          localStorage.setItem('s_g_questions', JSON.stringify(INITIAL_QUESTIONS));
        }
      } catch (e) {
        questionsList = INITIAL_QUESTIONS;
      }
    } else {
      localStorage.setItem('s_g_questions', JSON.stringify(INITIAL_QUESTIONS));
    }

    // Update leaderboard with user if exists
    const fullLeaderboard = get().buildLeaderboard(user);

    set({
      user,
      questions: questionsList,
      soundEnabled,
      theme,
      leaderboard: fullLeaderboard
    });

    // Make sure we have a registered user ID assigned if the user exists but has no ID, and always sync their latest data to Firestore
    let userId = localStorage.getItem('s_g_userid');
    if (user) {
      if (!userId) {
        userId = 'user_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
        localStorage.setItem('s_g_userid', userId);
      }
      setDoc(doc(db, 'users', userId), user, { merge: true })
        .then(() => {
          // Re-fetch the leaderboard after we know our user is synced
          get().fetchRealLeaderboard();
        })
        .catch(err => {
          console.warn("Firestore sync on init failing:", err);
          handleFirestoreError(err, OperationType.WRITE, `users/${userId}`);
        });
    }

    // Fetch the real users list async from Firestore
    get().fetchRealLeaderboard();
  },

  fetchRealLeaderboard: async () => {
    try {
      // Query without order-by to completely bypass composite-index or field-index errors
      const q = query(collection(db, 'users'), limit(100));
      let snapshot;
      try {
        snapshot = await getDocs(q);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'users');
        return; // Halt if error is thrown
      }
      const list: LeaderboardEntry[] = [];
      const currentUserId = localStorage.getItem('s_g_userid');
      
      snapshot.forEach(doc => {
        const data = doc.data();
        list.push({
          id: doc.id,
          username: data.username || 'بطل',
          avatar: data.avatar || '🧑‍💻',
          xp: data.totalXP ?? 0,
          level: data.level ?? 1,
          isCurrentUser: doc.id === currentUserId
        });
      });

      // Ensure the current user is showing in the list if the user has registered
      const hasCurrentUser = list.some(item => item.isCurrentUser || item.id === currentUserId);
      if (!hasCurrentUser) {
        const currentUser = get().user;
        if (currentUser && currentUserId) {
          list.push({
            id: currentUserId,
            username: currentUser.username,
            avatar: currentUser.avatar,
            xp: currentUser.totalXP,
            level: currentUser.level,
            isCurrentUser: true
          });
        }
      }

      // Sort in memory securely
      list.sort((a, b) => b.xp - a.xp);

      // Keep top 50 in our displayed state
      const topList = list.slice(0, 50);

      set({ leaderboard: topList, leaderboardError: null });
    } catch (e) {
      console.warn("Could not load real leaderboard, falling back to local list:", e);
      const errMsg = e instanceof Error ? e.message : String(e);
      set({ leaderboardError: errMsg });
      // Fallback to only displaying current user
      const currentUser = get().user;
      if (currentUser) {
        set({ leaderboard: get().buildLeaderboard(currentUser) });
      } else {
        set({ leaderboard: [] });
      }
    }
  },

  buildLeaderboard: (currentUser: UserProfile | null): LeaderboardEntry[] => {
    const list = [...DEFAULT_LEADERBOARD] as LeaderboardEntry[];
    if (currentUser) {
      const currentUserId = localStorage.getItem('s_g_userid') || 'user_current';
      list.push({
        id: currentUserId,
        username: currentUser.username,
        avatar: currentUser.avatar,
        xp: currentUser.totalXP,
        level: currentUser.level,
        isCurrentUser: true
      });
    }
    // Sort descending by XP
    return list.sort((a, b) => b.xp - a.xp);
  },

  registerUser: async (username: string, avatar: string) => {
    const userId = 'user_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem('s_g_userid', userId);

    const newUser: UserProfile = {
      username: username.trim() || 'بطل مجهول',
      avatar: avatar || '🧑‍💻',
      totalXP: 0,
      level: 1,
      unlockedStages: {}, // Empty means Stage 1 is the fallback (unlocked)
      completedQuestions: [],
      achievements: [],
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0]
    };

    localStorage.setItem('s_g_user', JSON.stringify(newUser));
    const fullLeaderboard = get().buildLeaderboard(newUser);

    set({ user: newUser, leaderboard: fullLeaderboard });

    // Sync to Firestore and wait for it to be safely persisted before page reloads/transitions
    try {
      try {
        await setDoc(doc(db, 'users', userId), newUser);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${userId}`);
      }
      await get().fetchRealLeaderboard();
    } catch (err) {
      console.warn("Firestore sync during registration failed:", err);
      // Even if firestore offline, the app state has already been initialized locally
    }
  },

  updateUser: (updates: Partial<UserProfile>) => {
    const { user } = get();
    if (!user) return;

    const updated = { ...user, ...updates };
    localStorage.setItem('s_g_user', JSON.stringify(updated));
    const fullLeaderboard = get().buildLeaderboard(updated);

    set({ user: updated, leaderboard: fullLeaderboard });

    const userId = localStorage.getItem('s_g_userid');
    if (userId) {
      setDoc(doc(db, 'users', userId), updated, { merge: true })
        .then(() => {
          get().fetchRealLeaderboard();
        })
        .catch(err => {
          console.warn("Cloud sync error in updateUser:", err);
          handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
        });
    }
  },

  addXP: (amount: number) => {
    const { user } = get();
    if (!user) return { levelUp: false, xpEarned: 0 };

    const oldXP = user.totalXP;
    const newXP = oldXP + amount;
    
    // Level boundary: 300 XP per level
    const oldLevel = user.level;
    const newLevel = Math.floor(newXP / 300) + 1;
    const levelUp = newLevel > oldLevel;

    const updated: UserProfile = {
      ...user,
      totalXP: newXP,
      level: newLevel
    };

    localStorage.setItem('s_g_user', JSON.stringify(updated));
    const fullLeaderboard = get().buildLeaderboard(updated);

    set({ user: updated, leaderboard: fullLeaderboard });

    const userId = localStorage.getItem('s_g_userid');
    if (userId) {
      setDoc(doc(db, 'users', userId), updated, { merge: true })
        .then(() => {
          get().fetchRealLeaderboard();
        })
        .catch(err => {
          console.warn("Cloud sync error in addXP:", err);
          handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
        });
    }

    return { levelUp, xpEarned: amount };
  },

  claimDailyReward: () => {
    const { user } = get();
    if (!user) return null;

    const todayDate = new Date().toISOString().split('T')[0];
    const lastClaim = user.dailyRewardLastClaimed;

    // Ready to claim if never claimed or claimed before today
    if (!lastClaim || lastClaim < todayDate) {
      let runStreak = user.streakDays;
      if (lastClaim) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastClaim === yesterdayStr) {
          runStreak += 1;
        } else {
          runStreak = 1; // broken streak
        }
      }

      // Calculate streak reward: 50 XP base + 10 XP per streak day (up to 150)
      const bonusXP = Math.min(50 + runStreak * 10, 150);
      
      const updated: UserProfile = {
        ...user,
        dailyRewardLastClaimed: todayDate,
        streakDays: runStreak,
        lastActiveDate: todayDate
      };
      
      localStorage.setItem('s_g_user', JSON.stringify(updated));
      set({ user: updated });
      get().addXP(bonusXP);
      
      return bonusXP;
    }

    return null;
  },

  unlockNextStage: (categoryId: string) => {
    const { user } = get();
    if (!user) return;

    const currentUnlocked = user.unlockedStages[categoryId] || 1;
    const updatedUnlocked = {
      ...user.unlockedStages,
      [categoryId]: currentUnlocked + 1
    };

    get().updateUser({ unlockedStages: updatedUnlocked });
  },

  completeQuestion: (questionId: string) => {
    const { user } = get();
    if (!user) return;

    if (!user.completedQuestions.includes(questionId)) {
      const updatedList = [...user.completedQuestions, questionId];
      get().updateUser({ completedQuestions: updatedList });
    }
  },

  checkAchievements: () => {
    const { user, questions } = get();
    if (!user) return [];

    const unlockedTitles: string[] = [];
    const currentUnlockedSet = new Set(user.achievements);
    const newUnlockedList = [...user.achievements];

    // Helper to gain achievement
    const triggerUnlock = (id: string, title: string, xp: number) => {
      if (!currentUnlockedSet.has(id)) {
        currentUnlockedSet.add(id);
        newUnlockedList.push(id);
        unlockedTitles.push(title);
        // Add XP inside a microtask or update it
        get().addXP(xp);
      }
    };

    // 1. First game completed
    if (user.completedQuestions.length >= 1) {
      const ach = ACHIEVEMENTS.find(a => a.id === 'first-game');
      if (ach) triggerUnlock(ach.id, ach.title, ach.xpReward);
    }

    // 2. Unlocked stage 3 in Morocco category
    const morUnlocked = user.unlockedStages['morocco'] || 1;
    if (morUnlocked >= 3) {
      const ach = ACHIEVEMENTS.find(a => a.id === 'mor-unlock');
      if (ach) triggerUnlock(ach.id, ach.title, ach.xpReward);
    }

    // 3. Completed 10 stages (means completed at least 10 stages total, let's say unlock sum of levels >= 10)
    const stageSum = Object.values(user.unlockedStages).reduce((a, b) => a + (b - 1), 0);
    if (stageSum >= 10) {
      const ach = ACHIEVEMENTS.find(a => a.id === 'stage-10');
      if (ach) triggerUnlock(ach.id, ach.title, ach.xpReward);
    }

    // 4. Over 1000 XP
    if (user.totalXP >= 1000) {
      const ach = ACHIEVEMENTS.find(a => a.id === 'badge-xp-1000');
      if (ach) triggerUnlock(ach.id, ach.title, ach.xpReward);
    }

    if (unlockedTitles.length > 0) {
      get().updateUser({ achievements: newUnlockedList });
    }

    return unlockedTitles;
  },

  setSoundEnabled: (enabled: boolean) => {
    localStorage.setItem('s_g_sound', enabled ? 'true' : 'false');
    set({ soundEnabled: enabled });
  },

  toggleTheme: () => {
    const current = get().theme;
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('s_g_theme', next);
    
    const root = document.documentElement;
    if (next === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    set({ theme: next });
  },

  // Admin Actions
  addQuestion: (q: Omit<Question, 'id'>) => {
    const { questions } = get();
    const newQ: Question = {
      ...q,
      id: `q-custom-${Date.now()}`
    };
    const updated = [...questions, newQ];
    localStorage.setItem('s_g_questions', JSON.stringify(updated));
    set({ questions: updated });
  },

  updateQuestion: (q: Question) => {
    const { questions } = get();
    const updated = questions.map(item => item.id === q.id ? q : item);
    localStorage.setItem('s_g_questions', JSON.stringify(updated));
    set({ questions: updated });
  },

  deleteQuestion: (id: string) => {
    const { questions } = get();
    const updated = questions.filter(item => item.id !== id);
    localStorage.setItem('s_g_questions', JSON.stringify(updated));
    set({ questions: updated });
  },

  bulkUploadQuestions: (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!Array.isArray(parsed)) {
        return { success: false, count: 0, error: 'الملف المرفوع يجب أن يكون عبارة عن مصفوفة أسئلة (Array).' };
      }
      
      // Validate structure roughly
      const isValid = parsed.every(item => 
        item.question && 
        Array.isArray(item.options) && 
        item.options.length === 4 && 
        item.correctAnswer && 
        item.category && 
        typeof item.stage === 'number'
      );

      if (!isValid) {
        return { 
          success: false, 
          count: 0, 
          error: 'صيغة بعض الأسئلة خاطئة. تأكد من وجود: question و options (4 خيارات) و correctAnswer و explanation و category و stage.' 
        };
      }

      // Format clean items
      const formatted: Question[] = parsed.map((item, i) => ({
        id: item.id || `q-upload-${Date.now()}-${i}`,
        question: item.question,
        options: item.options,
        correctAnswer: item.correctAnswer,
        explanation: item.explanation || '',
        category: item.category,
        stage: item.stage || 1
      }));

      const { questions } = get();
      // Merge or append. Let's merge by overwriting same IDs or prepending all.
      // We will append to keep existing ones
      const updated = [...questions, ...formatted];
      localStorage.setItem('s_g_questions', JSON.stringify(updated));
      set({ questions: updated });

      return { success: true, count: formatted.length };
    } catch (e: any) {
      return { success: false, count: 0, error: `فشل تحليل ملف الـ JSON: ${e.message}` };
    }
  },

  resetAllProgress: () => {
    localStorage.removeItem('s_g_user');
    localStorage.removeItem('s_g_userid');
    set({ user: null, leaderboard: DEFAULT_LEADERBOARD });
  },

  resetQuestionsToDefault: () => {
    localStorage.setItem('s_g_questions', JSON.stringify(INITIAL_QUESTIONS));
    set({ questions: INITIAL_QUESTIONS });
  }
}));
