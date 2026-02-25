import React from 'react'
import { cn } from '@/lib/utils'

interface AnimatedCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: 'lift' | 'glow' | 'scale'
}

export const AnimatedCard = React.forwardRef<
  HTMLDivElement,
  AnimatedCardProps
>(({ className, hover = 'lift', ...props }, ref) => {
  const hoverClasses = {
    lift: 'hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-2',
    glow: 'hover:shadow-lg hover:shadow-accent/50 hover:border-accent/50',
    scale: 'hover:scale-105 hover:shadow-lg hover:shadow-primary/20',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border border-border bg-card p-6 transition-smooth-lg',
        'backdrop-blur-sm',
        hoverClasses[hover],
        className
      )}
      {...props}
    >
      {props.children}
    </div>
  )
})

AnimatedCard.displayName = 'AnimatedCard'
