'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/custom/main-layout'
import { GradientButton } from '@/components/custom/gradient-button'
import { OutlineButton } from '@/components/custom/outline-button'
import { AnimatedCard } from '@/components/custom/animated-card'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Sparkles, Zap } from 'lucide-react'

export default function GeneratorPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [questionCount, setQuestionCount] = useState([20])
  const [questionType, setQuestionType] = useState('mixed')

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Redirect to study page with generated quiz
      router.push('/study/generated-1')
    }, 2000)
  }

  return (
    <MainLayout>
      <DashboardHeader />

      <main className="space-y-8 px-6 py-6">
        {/* Header */}
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold text-primary">
              AI-Powered Quiz Generation
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-foreground">
            Create a Quiz in Seconds
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter any topic, concept, or content, and our AI will generate a
            comprehensive quiz tailored to your learning needs.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <AnimatedCard>
              <form onSubmit={handleGenerate} className="space-y-6">
                {/* Topic Input */}
                <div className="space-y-2">
                  <Label htmlFor="topic" className="text-base font-semibold">
                    Topic or Content
                  </Label>
                  <Textarea
                    id="topic"
                    placeholder="Enter a topic (e.g., 'Photosynthesis in plants'), paste text, or describe what you want to learn about..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                    className="min-h-32 bg-card/50 border-border/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Be as specific as possible for better results
                  </p>
                </div>

                {/* Difficulty */}
                <div className="space-y-2">
                  <Label htmlFor="difficulty" className="text-base font-semibold">
                    Difficulty Level
                  </Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="bg-card/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy - Beginner</SelectItem>
                      <SelectItem value="medium">
                        Medium - Intermediate
                      </SelectItem>
                      <SelectItem value="hard">Hard - Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Question Count Slider */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">
                      Number of Questions
                    </Label>
                    <span className="rounded-lg bg-primary/20 px-3 py-1 text-lg font-semibold text-primary">
                      {questionCount[0]}
                    </span>
                  </div>
                  <Slider
                    value={questionCount}
                    onValueChange={setQuestionCount}
                    min={5}
                    max={50}
                    step={5}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5 questions</span>
                    <span>50 questions</span>
                  </div>
                </div>

                {/* Question Type */}
                <div className="space-y-2">
                  <Label htmlFor="question-type" className="text-base font-semibold">
                    Question Type
                  </Label>
                  <Select value={questionType} onValueChange={setQuestionType}>
                    <SelectTrigger className="bg-card/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mixed">
                        Mixed (Multiple choice, T/F, Short answer)
                      </SelectItem>
                      <SelectItem value="multiple">
                        Multiple Choice Only
                      </SelectItem>
                      <SelectItem value="truefalse">
                        True/False Only
                      </SelectItem>
                      <SelectItem value="shortanswer">
                        Short Answer Only
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <GradientButton
                    type="submit"
                    disabled={isLoading || !topic.trim()}
                    className="flex-1 gap-2"
                    size="lg"
                  >
                    <Zap className="h-5 w-5" />
                    {isLoading ? 'Generating...' : 'Generate Quiz'}
                  </GradientButton>
                  <OutlineButton
                    type="button"
                    onClick={() => router.back()}
                    size="lg"
                  >
                    Cancel
                  </OutlineButton>
                </div>
              </form>
            </AnimatedCard>
          </div>

          {/* Tips Sidebar */}
          <div className="space-y-4">
            <AnimatedCard hover="glow">
              <h3 className="mb-4 font-semibold text-foreground">Tips for Better Results</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    1
                  </span>
                  <span className="text-muted-foreground">
                    Be specific about your topic
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    2
                  </span>
                  <span className="text-muted-foreground">
                    Include key concepts you want covered
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    3
                  </span>
                  <span className="text-muted-foreground">
                    Paste entire chapters for comprehensive quizzes
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    4
                  </span>
                  <span className="text-muted-foreground">
                    Choose question types that match your learning style
                  </span>
                </li>
              </ul>
            </AnimatedCard>

            <AnimatedCard hover="glow" className="bg-gradient-to-br from-primary/10 to-accent/10">
              <p className="mb-4 font-semibold text-foreground">
                Premium Feature
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Unlock AI explanations, custom scoring, and more with Premium
              </p>
              <GradientButton className="w-full" size="sm">
                Upgrade Now
              </GradientButton>
            </AnimatedCard>
          </div>
        </div>
      </main>
    </MainLayout>
  )
}
