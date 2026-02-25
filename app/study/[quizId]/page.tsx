'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/custom/main-layout'
import { Button } from '@/components/ui/button'
import { GradientButton } from '@/components/custom/gradient-button'
import { AnimatedCard } from '@/components/custom/animated-card'
import { Progress } from '@/components/ui/progress'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, ChevronLeft, Lightbulb } from 'lucide-react'

const mockQuestions = [
  {
    id: 1,
    question: 'What is photosynthesis?',
    type: 'multiple',
    options: [
      'Process where plants convert light energy into chemical energy',
      'Process where plants release oxygen only',
      'Process where plants absorb carbon dioxide only',
      'Process where animals produce energy',
    ],
    correctAnswer: 0,
    explanation: 'Photosynthesis is the process by which green plants convert light energy (usually from the sun) into chemical energy that can be later released to fuel plant activities.',
  },
  {
    id: 2,
    question: 'Which part of the plant is primarily responsible for photosynthesis?',
    type: 'multiple',
    options: ['Root', 'Leaf', 'Stem', 'Flower'],
    correctAnswer: 1,
    explanation: 'The leaf is the primary photosynthetic organ in most plants. Leaves contain chlorophyll in their cells, which absorbs light energy.',
  },
  {
    id: 3,
    question: 'Photosynthesis occurs only during daylight hours.',
    type: 'truefalse',
    correct: true,
    explanation: 'Plants need light energy for photosynthesis, so it primarily occurs during the day when light is available.',
  },
]

export default function StudyPage({ params }: { params: { quizId: string } }) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | boolean | null)[]>(
    Array(mockQuestions.length).fill(null)
  )
  const [showExplanation, setShowExplanation] = useState(false)

  const question = mockQuestions[currentQuestion]
  const isAnswered = selectedAnswers[currentQuestion] !== null
  const isCorrect =
    question.type === 'truefalse'
      ? selectedAnswers[currentQuestion] === question.correct
      : selectedAnswers[currentQuestion] === question.correctAnswer

  const progress = ((currentQuestion + 1) / mockQuestions.length) * 100

  const handleSelectAnswer = (answer: number | boolean) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answer
    setSelectedAnswers(newAnswers)
    setShowExplanation(false)
  }

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
    } else {
      // Show results page
      router.push('/results')
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowExplanation(false)
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Biology: Photosynthesis
              </h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {mockQuestions.length}
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2 bg-card" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{currentQuestion + 1} of {mockQuestions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Question Card */}
          <AnimatedCard className="space-y-6">
            {/* Question */}
            <div>
              <h2 className="mb-2 text-2xl font-bold text-foreground">
                {question.question}
              </h2>
              <Badge variant="secondary" className="w-fit">
                {question.type === 'multiple'
                  ? 'Multiple Choice'
                  : 'True/False'}
              </Badge>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.type === 'multiple' ? (
                (question as any).options.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                      selectedAnswers[currentQuestion] === index
                        ? isCorrect
                          ? 'border-success bg-success/20 text-success'
                          : 'border-destructive bg-destructive/20 text-destructive'
                        : 'border-border hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 font-semibold ${
                          selectedAnswers[currentQuestion] === index
                            ? 'border-current bg-current text-background'
                            : 'border-current text-current'
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {[true, false].map((value) => (
                    <button
                      key={String(value)}
                      onClick={() => handleSelectAnswer(value)}
                      className={`rounded-lg border-2 p-4 font-semibold transition-all ${
                        selectedAnswers[currentQuestion] === value
                          ? value ===
                            (question as any).correct
                            ? 'border-success bg-success/20 text-success'
                            : 'border-destructive bg-destructive/20 text-destructive'
                          : 'border-border hover:border-primary hover:bg-primary/5'
                      }`}
                    >
                      {value ? 'True' : 'False'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Explanation */}
            {isAnswered && (
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex w-full items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 p-3 text-primary transition-smooth hover:bg-primary/20"
              >
                <Lightbulb className="h-5 w-5" />
                <span className="font-medium">
                  {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                </span>
              </button>
            )}

            {showExplanation && (
              <Card className="border-primary/30 bg-primary/10 p-4">
                <p className="text-sm text-muted-foreground">
                  {question.type === 'truefalse'
                    ? (question as any).explanation
                    : mockQuestions[currentQuestion].explanation}
                </p>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                variant="outline"
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <GradientButton
                onClick={handleNext}
                disabled={!isAnswered}
                className="flex-1 gap-2"
              >
                {currentQuestion === mockQuestions.length - 1
                  ? 'Finish Quiz'
                  : 'Next Question'}
                <ChevronRight className="h-4 w-4" />
              </GradientButton>
            </div>
          </AnimatedCard>

          {/* Question Navigator */}
          <AnimatedCard>
            <h3 className="mb-4 font-semibold text-foreground">Questions</h3>
            <div className="grid grid-cols-10 gap-2">
              {mockQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentQuestion(index)
                    setShowExplanation(false)
                  }}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg font-semibold transition-all ${
                    index === currentQuestion
                      ? 'border-2 border-primary bg-primary text-primary-foreground'
                      : selectedAnswers[index] !== null
                      ? 'bg-success/20 text-success'
                      : 'bg-card border border-border hover:border-primary'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </AnimatedCard>
        </div>
      </div>
    </MainLayout>
  )
}
