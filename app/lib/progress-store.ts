import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Types
export type QuizResult = {
  chapterId: string;
  setId: string;
  score: number;
  total: number;
  percentage: number;
  date: string; // ISO date
  passed: boolean;
  category?: string;
};

type StreakData = {
  current: number;
  longest: number;
  lastActiveDate: string | null; // ISO date
};

type ProgressStore = {
  // Chapter progress (0-100 percentage per chapter)
  chapterProgress: Record<string, number>;
  // Completed chapters (100% progress)
  completedChapters: string[];

  // Quiz history
  quizHistory: QuizResult[];

  // Sample paper completion (paperId -> completion percentage)
  samplePaperProgress: Record<string, number>;
  completedSamplePapers: string[];

  // Streak tracking
  streak: StreakData;
  dailyActivity: Record<string, boolean>; // date -> was active

  // Bookmarks
  bookmarkedChapters: string[];

  // Actions
  updateChapterProgress: (chapterId: string, progress: number, category?: string) => void;
  markChapterComplete: (chapterId: string, category?: string) => void;
  isChapterCompleted: (chapterId: string, category?: string) => boolean;
  getChapterProgress: (chapterId: string, category?: string) => number;

  saveQuizResult: (result: QuizResult, category?: string) => void;
  getQuizHistory: (category?: string) => QuizResult[];
  getBestQuizScore: (chapterId: string, setId: string, category?: string) => number | null;
  hasPassedQuiz: (chapterId: string, setId: string, category?: string) => boolean;

  updateSamplePaperProgress: (paperId: string, progress: number, category?: string) => void;
  markSamplePaperComplete: (paperId: string, category?: string) => void;
  getSamplePaperProgress: (paperId: string, category?: string) => number;
  getCompletedSamplePapersCount: (category?: string) => number;
  getSamplePapersProgress: (category?: string) => number;

  checkIn: () => void;
  getStreak: () => number;
  getLongestStreak: () => number;
  isStreakAtRisk: () => boolean;

  toggleBookmark: (chapterId: string, category?: string) => void;
  isBookmarked: (chapterId: string, category?: string) => boolean;
  getBookmarkedChapters: (category?: string) => string[];

  getOverallProgress: (category?: string, totalCount?: number) => number;
  getTotalChaptersCompleted: (category?: string) => number;
  getTotalQuizzesTaken: (category?: string) => number;
  getAverageQuizScore: (category?: string) => number;
  getOverallAppProgress: (category?: string, totalCh?: number, totalPapers?: number) => number;

  resetAllProgress: () => void;
};

// SecureStore adapter
const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(name);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch {
      // Silent fail
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch {
      // Silent fail
    }
  },
};

// Helper functions for date operations
const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getToday = (): string => {
  return formatLocalDate(new Date());
};

const getYesterday = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return formatLocalDate(date);
};

const isSameDay = (date1: string, date2: string): boolean => {
  return date1 === date2;
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => {
      const getPrefixedKey = (id: string, category?: string) => {
        const cat = category || "class12";
        return id.startsWith(`${cat}_`) ? id : `${cat}_${id}`;
      };

      return {
        // Initial state
        chapterProgress: {},
        completedChapters: [] as string[],
        quizHistory: [] as (QuizResult & { category?: string })[],
        samplePaperProgress: {},
        completedSamplePapers: [] as string[],
        streak: {
          current: 0,
          longest: 0,
          lastActiveDate: null,
        },
        dailyActivity: {},
        bookmarkedChapters: [] as string[],

        // Chapter progress actions
        updateChapterProgress: (chapterId: string, progress: number, category?: string) => {
          const key = getPrefixedKey(chapterId, category);
          const clampedProgress = Math.min(100, Math.max(0, progress));
          set((state) => ({
            chapterProgress: {
              ...state.chapterProgress,
              [key]: clampedProgress,
            },
          }));

          if (clampedProgress >= 100) {
            get().markChapterComplete(chapterId, category);
          }
        },

        markChapterComplete: (chapterId: string, category?: string) => {
          const key = getPrefixedKey(chapterId, category);
          set((state) => {
            if (state.completedChapters.includes(key)) {
              return state;
            }
            return {
              completedChapters: [...state.completedChapters, key],
              chapterProgress: {
                ...state.chapterProgress,
                [key]: 100,
              },
            };
          });
        },

        isChapterCompleted: (chapterId: string, category?: string) => {
          const key = getPrefixedKey(chapterId, category);
          return get().completedChapters.includes(key);
        },

        getChapterProgress: (chapterId: string, category?: string) => {
          const key = getPrefixedKey(chapterId, category);
          return get().chapterProgress[key] || 0;
        },

        // Quiz actions
        saveQuizResult: (result: QuizResult, category?: string) => {
          const cat = category || "class12";
          set((state) => ({
            quizHistory: [...state.quizHistory, { ...result, category: cat }],
          }));
          get().checkIn();
        },

        getQuizHistory: (category?: string) => {
          const cat = category || "class12";
          return get().quizHistory.filter((r) => r.category === cat);
        },

        getBestQuizScore: (chapterId: string, setId: string, category?: string) => {
          const cat = category || "class12";
          const results = get().quizHistory.filter(
            (r) => r.chapterId === chapterId && r.setId === setId && (r.category === cat)
          );
          if (results.length === 0) return null;
          return Math.max(...results.map((r) => r.percentage));
        },

        hasPassedQuiz: (chapterId: string, setId: string, category?: string) => {
          const cat = category || "class12";
          return get().quizHistory.some(
            (r) =>
              r.chapterId === chapterId && r.setId === setId && r.passed && (r.category === cat)
          );
        },

        // Sample paper actions
        updateSamplePaperProgress: (paperId: string, progress: number, category?: string) => {
          const key = getPrefixedKey(paperId, category);
          const clampedProgress = Math.min(100, Math.max(0, progress));
          set((state) => ({
            samplePaperProgress: {
              ...state.samplePaperProgress,
              [key]: clampedProgress,
            },
          }));
          if (clampedProgress >= 100) {
            get().markSamplePaperComplete(paperId, category);
          }
        },

        markSamplePaperComplete: (paperId: string, category?: string) => {
          const key = getPrefixedKey(paperId, category);
          set((state) => {
            if (state.completedSamplePapers.includes(key)) {
              return state;
            }
            return {
              completedSamplePapers: [...state.completedSamplePapers, key],
              samplePaperProgress: {
                ...state.samplePaperProgress,
                [key]: 100,
              },
            };
          });
        },

        getSamplePaperProgress: (paperId: string, category?: string) => {
          const key = getPrefixedKey(paperId, category);
          return get().samplePaperProgress[key] || 0;
        },

        getCompletedSamplePapersCount: (category?: string) => {
          const cat = category || "class12";
          return get().completedSamplePapers.filter((id) => id.startsWith(`${cat}_`)).length;
        },

        getSamplePapersProgress: (category?: string) => {
          const cat = category || "class12";
          // Use 20 as the expected total if dynamic not provided
          const totalPapers = 20; 
          const completed = get().getCompletedSamplePapersCount(cat);
          return Math.round((completed / totalPapers) * 100);
        },

        // Streak (global)
        checkIn: () => {
          const today = getToday();
          const { streak, dailyActivity } = get();
          if (dailyActivity[today]) return;
          const yesterday = getYesterday();
          let newStreak = 1;
          if (streak.lastActiveDate && isSameDay(streak.lastActiveDate, yesterday)) {
            newStreak = streak.current + 1;
          }
          const newLongest = Math.max(streak.longest, newStreak);
          set((state) => ({
            streak: { current: newStreak, longest: newLongest, lastActiveDate: today },
            dailyActivity: { ...state.dailyActivity, [today]: true },
          }));
        },

        getStreak: () => get().streak.current,
        getLongestStreak: () => get().streak.longest,
        isStreakAtRisk: () => {
          const { streak } = get();
          if (streak.current === 0) return false;
          const today = getToday();
          const yesterday = getYesterday();
          if (streak.lastActiveDate === today) return false;
          if (streak.lastActiveDate === yesterday) return false;
          return true;
        },

        // Bookmarks
        toggleBookmark: (chapterId: string, category?: string) => {
          const key = getPrefixedKey(chapterId, category);
          set((state) => {
            const isBookmarked = state.bookmarkedChapters.includes(key);
            if (isBookmarked) {
              return {
                bookmarkedChapters: state.bookmarkedChapters.filter((id) => id !== key),
              };
            }
            return { bookmarkedChapters: [...state.bookmarkedChapters, key] };
          });
        },

        isBookmarked: (chapterId: string, category?: string) => {
          const key = getPrefixedKey(chapterId, category);
          return get().bookmarkedChapters.includes(key);
        },

        getBookmarkedChapters: (category?: string) => {
          const cat = category || "class12";
          return get().bookmarkedChapters
            .filter((id) => id.startsWith(`${cat}_`))
            .map((id) => id.replace(`${cat}_`, ""));
        },

        // Stats
        getOverallProgress: (category?: string, totalCount?: number) => {
          const cat = category || "class12";
          const totalChapters = totalCount || 11;
          const completed = get().getTotalChaptersCompleted(cat);
          if (totalChapters === 0) return 0;
          return Math.round((completed / totalChapters) * 100);
        },

        getTotalChaptersCompleted: (category?: string) => {
          const cat = category || "class12";
          return get().completedChapters.filter((id) => id.startsWith(`${cat}_`)).length;
        },

        getTotalQuizzesTaken: (category?: string) => {
          return get().getQuizHistory(category).length;
        },

        getAverageQuizScore: (category?: string) => {
          const history = get().getQuizHistory(category);
          if (history.length === 0) return 0;
          const sum = history.reduce((acc, r) => acc + r.percentage, 0);
          return Math.round(sum / history.length);
        },

        getOverallAppProgress: (category?: string, totalCh?: number, totalPapers?: number) => {
          const notesWeight = 0.4;
          const quizWeight = 0.3;
          const papersWeight = 0.3;

          const notesProgress = get().getOverallProgress(category, totalCh);
          const quizProgress = get().getAverageQuizScore(category);
          const papersProgress = get().getSamplePapersProgress(category);

          return Math.round(
            notesProgress * notesWeight +
            quizProgress * quizWeight +
            papersProgress * papersWeight
          );
        },

        // Reset
        resetAllProgress: () => {
          set({
            chapterProgress: {},
            completedChapters: [],
            quizHistory: [],
            samplePaperProgress: {},
            completedSamplePapers: [],
            streak: { current: 0, longest: 0, lastActiveDate: null },
            dailyActivity: {},
            bookmarkedChapters: [],
          });
        },
      };
    },
    {
      name: "pylearn-progress-storage",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);

// Export helper functions (updated to use category from store if possible, but they are external so they'll need it passed if used outside components)
export function updateChapterProgress(chapterId: string, progress: number, category?: string): void {
  useProgressStore.getState().updateChapterProgress(chapterId, progress, category);
}

export function markChapterComplete(chapterId: string, category?: string): void {
  useProgressStore.getState().markChapterComplete(chapterId, category);
}

export function saveQuizResult(result: QuizResult, category?: string): void {
  useProgressStore.getState().saveQuizResult(result, category);
}

export function updateSamplePaperProgress(paperId: string, progress: number, category?: string): void {
  useProgressStore.getState().updateSamplePaperProgress(paperId, progress, category);
}

export function markSamplePaperComplete(paperId: string, category?: string): void {
  useProgressStore.getState().markSamplePaperComplete(paperId, category);
}

export function checkIn(): void {
  useProgressStore.getState().checkIn();
}

export function toggleBookmark(chapterId: string, category?: string): void {
  useProgressStore.getState().toggleBookmark(chapterId, category);
}

export function getOverallProgress(category?: string, totalCount?: number): number {
  return useProgressStore.getState().getOverallProgress(category, totalCount);
}

export function getSamplePapersProgress(category?: string): number {
  return useProgressStore.getState().getSamplePapersProgress(category);
}

export function getOverallAppProgress(category?: string, totalCh?: number, totalPapers?: number): number {
  return useProgressStore.getState().getOverallAppProgress(category, totalCh, totalPapers);
}
