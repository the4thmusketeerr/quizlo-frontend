'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/custom/main-layout'
import { AnimatedCard } from '@/components/custom/animated-card'
import { GradientButton } from '@/components/custom/gradient-button'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Clock, Play, Pause, X } from 'lucide-react'

const mockLeaderboard = [
  { rank: 1, name: 'Alice Johnson', score: 450, streak: 3 },
  { rank: 2, name: 'Bob Smith', score: 420, streak: 2 },
  { rank: 3, name: 'Carol Davis', score: 390, streak: 1 },
  { rank: 4, name: 'David Wilson', score: 360, streak: 0 },
  { rank: 5, name: 'Emma Brown', score: 330, streak: 0 },
]

const mockQuestion = {
  id: 1,
  number: 1,
  total: 20,
  text: 'What is the primary source of energy for photosynthesis?',
  options: ['Moonlight', 'Sunlight', 'Heat', 'Wind'],
  timeLimit: 30,
}

export default function HostPage({ params }: { params: { gameId: string } }) {
  const [timeLeft, setTimeLeft] = useState(mockQuestion.timeLimit)
  const [isPlaying, setIsPlaying] = useState(true)
  const [answered, setAnswered] = useState([0, 2, 2, 1])

  useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [isPlaying])

  const timePercentage = (timeLeft / mockQuestion.timeLimit) * 100

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 px-4 py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Live Quiz Game
              </h1>
              <p className="text-sm text-muted-foreground">
                Hosting: Biology - Photosynthesis
              </p>
            </div>
            <div className="flex gap-3">
              <GradientButton
                size="lg"
                onClick={() => setIsPlaying(!isPlaying)}
                className="gap-2"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-5 w-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Resume
                  </>
                )}
              </GradientButton>
              <Button
                variant="outline"
                size="lg"
                className="border-destructive/50 text-destructive hover:bg-destructive/10 gap-2"
              >
                <X className="h-5 w-5" />
                End Game
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Question Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Question Card */}
              <AnimatedCard className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      Question {mockQuestion.number} of {mockQuestion.total}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span className="font-semibold">{timeLeft}s</span>
                    </div>
                  </div>
                  <div className="w-full rounded-full h-2 bg-card overflow-hidden">
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
                </div>

                <h2 className="text-2xl font-bold text-foreground">
                  {mockQuestion.text}
                </h2>

                {/* Answer Options */}
                <div className="grid grid-cols-2 gap-3">
                  {mockQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className="rounded-lg border-2 border-border bg-card p-4 text-center"
                    >
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 font-bold text-primary mx-auto">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <p className="font-medium text-foreground">{option}</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {answered[index]} answered
                      </p>
                    </div>
                  ))}
                </div>

                {/* Answered Stats */}
                <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
                  <span className="font-semibold text-foreground">
                    {answered.reduce((a, b) => a + b, 0)} players answered
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Waiting for more responses...
                  </span>
                </div>
              </AnimatedCard>

              {/* Player Status */}
              <AnimatedCard>
                <h3 className="mb-4 font-semibold text-foreground">
                  Players Connected (12)
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-card p-3 text-center border border-border/50"
                    >
                      <div className="mb-2 h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent mx-auto" />
                      <p className="text-xs font-medium text-foreground truncate">
                        Player {i + 1}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {Math.floor(Math.random() * 500)} pts
                      </p>
                    </div>
                  ))}
                </div>
              </AnimatedCard>
            </div>

            {/* Leaderboard */}
            <div className="h-fit">
              <AnimatedCard hover="glow">
                <h3 className="mb-4 font-semibold text-foreground">Live Leaderboard</h3>
                <div className="space-y-2">
                  {mockLeaderboard.map((player) => (
                    <div
                      key={player.rank}
                      className="flex items-center justify-between rounded-lg bg-card/50 p-3 border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent font-bold text-white text-sm">
                          {player.rank}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">
                            {player.name}
                          </p>
                          {player.streak > 0 && (
                            <p className="text-xs text-warning">
                              {player.streak} streak
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="font-bold text-primary">
                        {player.score}
                      </span>
                    </div>
                  ))}
                </div>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
