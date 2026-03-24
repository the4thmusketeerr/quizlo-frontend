import { create } from "zustand";
import { persist } from "zustand/middleware";
import { QuizSession, SanitizedQuestion, QuizResults } from "@/lib/quiz";

interface QuizState {
  attemptId: string | null;
  quizTitle: string | null;
  timeAllocated: number;
  questions: SanitizedQuestion[];
  currentQuestionIndex: number;
  quizResults: QuizResults | null;
  questionResults: Record<string, {
    answer: any;
    isCorrect: boolean;
    correctData: any;
    pointsEarned: number;
  }>;
  
  // Actions
  setSession: (session: QuizSession) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setQuestionResult: (questionId: string, result: { answer: any; isCorrect: boolean; correctData: any; pointsEarned: number; }) => void;
  setResults: (results: QuizResults) => void;
  clearSession: () => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      attemptId: null,
      quizTitle: null,
      timeAllocated: 0,
      questions: [],
      currentQuestionIndex: 0,
      quizResults: null,
      questionResults: {},

      setSession: (session) => set({
        attemptId: session.attemptId,
        quizTitle: session.quizTitle,
        timeAllocated: session.timeAllocated,
        questions: session.questions,
        currentQuestionIndex: 0,
        quizResults: null,
        questionResults: {},
      }),

      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

      setQuestionResult: (questionId, result) => set((state) => ({
        questionResults: {
          ...state.questionResults,
          [questionId]: result,
        }
      })),

      setResults: (results) => set({ quizResults: results }),

      clearSession: () => set({
        attemptId: null,
        quizTitle: null,
        timeAllocated: 0,
        questions: [],
        currentQuestionIndex: 0,
        quizResults: null,
        questionResults: {},
      }),
    }),
    {
      name: "quiz-storage",
    }
  )
);
