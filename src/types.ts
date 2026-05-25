export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  category: string;
  stage: number; // 3 questions per stage
}

export interface UserProfile {
  username: string;
  avatar: string; // Avatar avatar emoji or key
  totalXP: number;
  level: number;
  unlockedStages: Record<string, number>; // categoryId -> unlockedStageCount (stage 1 unlocked by default, i.e., stage number is 1, 2...)
  completedQuestions: string[]; // list of question ids answered correctly
  achievements: string[]; // achievement ids
  dailyRewardLastClaimed?: string; // date string YYYY-MM-DD
  streakDays: number;
  lastActiveDate?: string;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  isCurrentUser?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  isUnlocked?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}
