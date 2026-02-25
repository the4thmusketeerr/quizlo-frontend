'use client'

import Link from 'next/link'
import { useState } from 'react'
import { MainLayout } from '@/components/custom/main-layout'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { QuizCard } from '@/components/dashboard/quiz-card'
import { GradientButton } from '@/components/custom/gradient-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Filter } from 'lucide-react'

const allQuizzes = [
  {
    id: '1',
    title: 'Biology: Photosynthesis',
    description: 'Learn about light and dark reactions in photosynthesis',
    questionCount: 25,
    difficulty: 'Medium' as const,
    category: 'Biology',
    lastStudied: '2 days ago',
    accuracy: 85,
  },
  {
    id: '2',
    title: 'Spanish Vocabulary',
    description: 'Essential Spanish words for everyday conversations',
    questionCount: 50,
    difficulty: 'Easy' as const,
    category: 'Languages',
    lastStudied: '1 week ago',
    accuracy: 78,
  },
  {
    id: '3',
    title: 'Python Advanced Concepts',
    description: 'Decorators, generators, and async/await patterns',
    questionCount: 30,
    difficulty: 'Hard' as const,
    category: 'Programming',
    lastStudied: '3 days ago',
    accuracy: 92,
  },
  {
    id: '4',
    title: 'World History: Renaissance',
    description: 'The Renaissance period and its key figures',
    questionCount: 40,
    difficulty: 'Medium' as const,
    category: 'History',
    lastStudied: '1 month ago',
    accuracy: 81,
  },
  {
    id: '5',
    title: 'Chemistry: Organic Compounds',
    description: 'Understanding carbon-based chemistry fundamentals',
    questionCount: 35,
    difficulty: 'Hard' as const,
    category: 'Chemistry',
    lastStudied: '2 weeks ago',
    accuracy: 75,
  },
  {
    id: '6',
    title: 'Japanese Hiragana',
    description: 'Master the Japanese phonetic writing system',
    questionCount: 46,
    difficulty: 'Easy' as const,
    category: 'Languages',
    lastStudied: '3 days ago',
    accuracy: 88,
  },
]

export default function QuizzesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [difficulty, setDifficulty] = useState<string>('all')
  const [category, setCategory] = useState<string>('all')

  const filteredQuizzes = allQuizzes.filter((quiz) => {
    const matchesSearch = quiz.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesDifficulty =
      difficulty === 'all' || quiz.difficulty === difficulty
    const matchesCategory = category === 'all' || quiz.category === category

    return matchesSearch && matchesDifficulty && matchesCategory
  })

  const categories = ['all', ...new Set(allQuizzes.map((q) => q.category))]
  const difficulties = ['all', 'Easy', 'Medium', 'Hard']

  return (
    <MainLayout>
      <DashboardHeader />

      <main className="space-y-6 px-6 py-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">All Quizzes</h2>
            <p className="text-sm text-muted-foreground">
              Browse and manage all your quizzes
            </p>
          </div>
          <GradientButton asChild>
            <Link href="/quiz/generator">Create New Quiz</Link>
          </GradientButton>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-card/50 border-border/50 pl-10"
              />
            </div>
          </div>

          <div className="flex gap-4 sm:gap-2">
            <div className="flex-1 sm:flex-none">
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="bg-card/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level === 'all'
                        ? 'All Levels'
                        : `${level} Level`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 sm:flex-none">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-card/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === 'all'
                        ? 'All Categories'
                        : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredQuizzes.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Found {filteredQuizzes.length} quiz{filteredQuizzes.length !== 1 ? 'zes' : ''}
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredQuizzes.map((quiz) => (
                <QuizCard key={quiz.id} {...quiz} />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-border/50 py-12 text-center">
            <p className="text-muted-foreground">No quizzes found</p>
            <p className="text-sm text-muted-foreground/75">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </main>
    </MainLayout>
  )
}
