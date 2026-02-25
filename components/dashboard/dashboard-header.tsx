'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bell, Search } from 'lucide-react'

export function DashboardHeader() {
  return (
    <div className="border-b border-border/50 bg-background/40 px-6 py-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back! Continue your learning journey.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden w-64 md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search quizzes..."
                className="bg-card/50 border-border/50 pl-10"
              />
            </div>
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent" />
          </Button>
        </div>
      </div>
    </div>
  )
}
