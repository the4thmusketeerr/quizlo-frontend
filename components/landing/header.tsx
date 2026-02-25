'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">Quizlo</span>
        </Link>

        {/* <div className="hidden gap-8 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground"
          >
            How it Works
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground"
          >
            Pricing
          </Link>
        </div> */}

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-foreground hover:bg-primary/10 hover:text-primary"
            asChild
          >
            <Link href="/login">Sign In</Link>
          </Button>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/50" asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}
