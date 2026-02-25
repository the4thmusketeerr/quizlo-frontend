'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/custom/main-layout'
import { AnimatedCard } from '@/components/custom/animated-card'
import { GradientButton } from '@/components/custom/gradient-button'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Clock, Trophy, AlertCircle } from 'lucide-react'

const mockQuestion = {
  id: 1,
  number: 1,
  total: 20,
  text: 'What is the primary source of energy for photosynthesis?',
  options: ['Moonlight', 'Sunlight', 'Heat', 'Wind'],
  correctAnswer: 1,
  timeLimit: 30,
}

export default function PlayPage({ params }: { params: { gameId: string } }) {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(mockQuestion.timeLimit)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [currentScore, setCurrentScore] = useState(0)

  useEffect(() => {
    if (selectedAnswer !== null || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [selectedAnswer, timeLeft])

  const handleTimeUp = () => {
    setShowResult(true)
  }

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index)
    const isCorrect = index === mockQuestion.correctAnswer
    if (isCorrect) {
      const points = Math.max(10, Math.floor((timeLeft / mockQuestion.timeLimit) * 100))
      setCurrentScore((prev) => prev + points)
    }
    setShowResult(true)
  }

  const timePercentage = (timeLeft / mockQuestion.timeLimit) * 100
  const isCorrect = selectedAnswer === mockQuestion.correctAnswer

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Quiz Battle</h1>
              <p className="text-sm text-muted-foreground">
                Question {mockQuestion.number} of {mockQuestion.total}
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-primary/20 px-4 py-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="font-bold text-primary">{currentScore} pts</span>
            </div>
          </div>

          {/* Timer */}
          <Card className="border-border/50 bg-card/50">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  Time Remaining
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 rounded-full bg-background h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      timePercentage > 33
                        ? 'bg-success'
                        : timePercentage > 16
                        ? 'bg-warning'
                        : 'bg-destructive'
                    }`}
                    style={{ width: `${timePercentage}%` }}
                  />
                </div>
                <span className="min-w-fit text-2xl font-bold text-foreground">
                  {timeLeft}s
                </span>
              </div>
            </div>
          </Card>

          {/* Question Card */}
          <AnimatedCard className="space-y-8 animate-scale-in">
            <h2 className="text-3xl font-bold text-foreground">
              {mockQuestion.text}
            </h2>

            {/* Answer Options */}
            {!showResult ? (
              <div className="space-y-3">
                {mockQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className="w-full text-left transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100"
                  >
                    <div className="rounded-xl border-2 border-border bg-card p-6 hover:border-primary hover:bg-primary/5 disabled:opacity-50">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary font-bold text-lg text-white">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-lg font-medium text-foreground">
                          {option}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <>
                {/* Result Display */}
                <div
                  className={`rounded-xl border-2 p-6 ${
                    isCorrect
                      ? 'border-success bg-success/20'
                      : 'border-destructive bg-destructive/20'
                  } text-center`}
                >
                  <p
                    className={`text-2xl font-bold ${
                      isCorrect ? 'text-success' : 'text-destructive'
                    }`}
                  >
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </p>
                  {isCorrect && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      +{Math.max(10, Math.floor((timeLeft / mockQuestion.timeLimit) * 100))} points
                    </p>
                  )}
                </div>

                {/* Explanation */}
                <div className="rounded-lg border border-primary/30 bg-primary/10 p-4">
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                    <AlertCircle className="h-4 w-4" />
                    Correct Answer
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {mockQuestion.options[mockQuestion.correctAnswer]}
                  </p>
                </div>

                {/* Next Button */}
                <GradientButton
                  onClick={() => router.push(`/live/play/${params.gameId}`)}
                  className="w-full"
                  size="lg"
                >
                  Next Question
                </GradientButton>
              </>
            )}
          </AnimatedCard>

          {/* Progress Indicator */}
          <div className="flex gap-1">
            {Array.from({ length: mockQuestion.total }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  i < mockQuestion.number
                    ? 'bg-success'
                    : i === mockQuestion.number - 1
                    ? 'bg-primary'
                    : 'bg-card'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
