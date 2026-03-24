import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Category, Quiz } from "@/lib/quiz";
import { ProfileData } from "@/lib/user";

interface AppDataState {
  // Categories
  categories: Category[];
  lastFetchedCategories: number | null;
  setCategories: (categories: Category[]) => void;

  // Quizzes
  quizzes: Quiz[];
  lastFetchedQuizzes: number | null;
  setQuizzes: (quizzes: Quiz[]) => void;

  // User Profile
  profile: ProfileData | null;
  lastFetchedProfile: number | null;
  setProfile: (profile: ProfileData) => void;

  // Clear all
  clearAllData: () => void;
}

export const useAppStore = create<AppDataState>()(
  persist(
    (set) => ({
      categories: [],
      lastFetchedCategories: null,
      setCategories: (categories) => set({ 
        categories, 
        lastFetchedCategories: Date.now() 
      }),

      quizzes: [],
      lastFetchedQuizzes: null,
      setQuizzes: (quizzes) => set({ 
        quizzes, 
        lastFetchedQuizzes: Date.now() 
      }),

      profile: null,
      lastFetchedProfile: null,
      setProfile: (profile) => set({ 
        profile, 
        lastFetchedProfile: Date.now() 
      }),

      clearAllData: () => set({
        categories: [],
        lastFetchedCategories: null,
        quizzes: [],
        lastFetchedQuizzes: null,
        profile: null,
        lastFetchedProfile: null,
      }),
    }),
    {
      name: "app-data-storage",
    }
  )
);
