'use client'

import Link from 'next/link'
import { AnimatedCard } from '@/components/custom/animated-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Edit2, Trash2, Share2 } from 'lucide-react'

interface QuizCardProps {
  id: string
  title: string
  description: string
  questionCount: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  lastStudied?: string
  accuracy?: number
}

const difficultyColors = {
  Easy: 'bg-success/20 text-success',
  Medium: 'bg-warning/20 text-warning',
  Hard: 'bg-destructive/20 text-destructive',
}

export function QuizCard({
  id,
  title,
  description,
  questionCount,
  difficulty,
  category,
  lastStudied,
  accuracy,
}: QuizCardProps) {
  return (
    <AnimatedCard hover="lift" className="flex flex-col justify-between">
      <div>
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground line-clamp-2">
              {title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>
          <Badge className={`ml-2 ${difficultyColors[difficulty]}`}>
            {difficulty}
          </Badge>
        </div>

        <div className="mb-4 flex gap-4 text-xs text-muted-foreground">
          <span>{questionCount} questions</span>
          <span>•</span>
          <span>{category}</span>
          {lastStudied && (
            <>
              <span>•</span>
              <span>Last: {lastStudied}</span>
            </>
          )}
        </div>

        {accuracy !== undefined && (
          <div className="mb-4 flex items-center gap-2">
            <div className="flex-1 rounded-full bg-card h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent"
                style={{ width: `${accuracy}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-foreground">
              {accuracy}%
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          asChild
          className="flex-1 gap-2 bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
        >
          <Link href={`/study/${id}`}>
            <Play className="h-4 w-4" />
            Study
          </Link>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="border-border/50 hover:bg-primary/10"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="border-border/50 hover:bg-primary/10"
        >
          <Share2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="border-border/50 hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </AnimatedCard>
  )
}
