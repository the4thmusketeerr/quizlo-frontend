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
        <div className="mb-20 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Powerful Features for
            <span className="block bg-gradient-to-r from-[#A855F7] to-indigo-600 bg-clip-text text-transparent">
              Effective Learning
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Everything you need to master any subject with the power of artificial intelligence.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <AnimatedCard key={index} hover="lift" className="border-border/50 bg-card/50 p-4 sm:p-8">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#A855F7]/20 to-indigo-600/20 shadow-inner group-hover:from-[#A855F7]/30 md:mb-6 md:h-14 md:w-14 md:rounded-2xl">
                  <Icon className="h-5 w-5 text-[#A855F7] md:h-7 md:w-7" />
                </div>
                <h3 className="mb-2 text-base font-bold text-foreground md:mb-3 md:text-xl">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
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
