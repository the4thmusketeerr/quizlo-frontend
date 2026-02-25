'use client'

import { AnimatedCard } from '@/components/custom/animated-card'
import {
  Zap,
  Brain,
  Trophy,
  TrendingUp,
  Users,
  Sparkles,
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Generation',
    description:
      'Generate unlimited quizzes from any topic in seconds using advanced AI technology.',
  },
  {
    icon: Zap,
    title: 'Smart Study Modes',
    description:
      'Choose between multiple learning modes: flashcards, practice tests, and adaptive learning.',
  },
  {
    icon: Trophy,
    title: 'Live Competitions',
    description:
      'Compete with friends in real-time quiz battles and climb the leaderboard.',
  },
  {
    icon: TrendingUp,
    title: 'Intelligent Analytics',
    description:
      'Track your progress with detailed analytics and identify areas for improvement.',
  },
  {
    icon: Users,
    title: 'Collaborative Learning',
    description:
      'Create study groups, share quizzes, and learn together with classmates.',
  },
  {
    icon: Sparkles,
    title: 'AI Explanations',
    description:
      'Get instant explanations for any question from our advanced AI assistant.',
  },
]

export function Features() {
  return (
    <section id="features" className="relative px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Powerful Features for
            <span className="block text-primary">Effective Learning</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to succeed in your studies
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <AnimatedCard key={index} hover="lift">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </AnimatedCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
