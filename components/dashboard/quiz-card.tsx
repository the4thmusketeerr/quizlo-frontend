'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Play, Edit2, Trash2, Share2, HelpCircle, Clock, Eye, User, Lock, FileEdit } from 'lucide-react'

interface QuizCardProps {
  id: string
  title: string
  description: string
  questionCount: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  plays?: number
  timeAllocated?: number
  username?: string
  isPrivate?: boolean
  isDraft?: boolean
  creationMode?: string
  updatedAt?: string
  createdAt?: string
  coverPicture?: string
  viewMode?: 'grid' | 'list'
  onDelete?: (id: string) => void
  onShare?: (id: string) => void
}

const difficultyColors = {
  Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  Hard: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
}



export function QuizCard({
  id,
  title,
  description,
  questionCount,
  difficulty,
  category,
  plays = 0,
  timeAllocated = 0,
  username = "You",
  isPrivate = false,
  isDraft = false,
  creationMode = "Manual",
  updatedAt,
  createdAt,
  coverPicture,
  viewMode = 'grid',
  onDelete,
  onShare,
}: QuizCardProps) {
  // Format timeAllocated (seconds) to "Xm Ys" matching explore page
  const minutes = Math.floor(timeAllocated / 60);
  const seconds = timeAllocated % 60;
  const formattedTime =
    minutes > 0
      ? `${minutes}m ${seconds > 0 ? `${seconds}s` : ""}`.trim()
      : `${seconds}s`;

  if (viewMode === 'list') {
    return (
      <div className="group flex items-center gap-4 rounded-xl border border-border/40 bg-card px-5 py-3 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <span className="shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-purple-400 text-white">
            {category}
          </span>
          <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${isDraft ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400" : "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400"}`}>
            {isDraft ? "Draft" : "Published"}
          </span>
          <Link href={`/dashboard/quizzes/${id}/view`} className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
          </Link>
          <p className="hidden md:block truncate text-xs text-muted-foreground max-w-[200px] lg:max-w-[400px]">
            {description}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4 text-[10px] font-bold uppercase tracking-tight text-muted-foreground mr-2">
          <span className="flex items-center gap-1.5"><HelpCircle className="h-3 w-3" />{questionCount} Qs</span>
          <span className="flex items-center gap-1.5"><Eye className="h-3 w-3" />{plays} Plays</span>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary border border-border/20 transition-colors">
            <Link href={`/dashboard/quizzes/${id}/view`}><Eye className="h-3.5 w-3.5" /></Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary border border-border/20 transition-colors">
            <Link href={`/dashboard/quizzes/${id}/edit`}><Edit2 className="h-3.5 w-3.5" /></Link>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onShare?.(id)}
            className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary border border-border/20 transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete?.(id)}
            className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive border border-border/20 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="group flex flex-col h-full rounded-2xl border border-border/40 bg-card p-3 shadow-sm hover:shadow-md hover:border-border/70 transition-all duration-200">
      {/* Cover Picture */}
      <div className="relative mb-3 h-28 w-full overflow-hidden rounded-xl sm:h-32 md:h-40 lg:h-48">
        {coverPicture ? (
          <img
            src={coverPicture}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <img
            src="https://placehold.net/600x600.png"
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
      </div>

      <Link href={`/dashboard/quizzes/${id}/view`} className="flex-1 px-1">
        {/* Tags row */}
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <span className="inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-purple-400 text-white">
            {category}
          </span>
          <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${difficultyColors[difficulty]}`}>
            {difficulty}
          </span>
          <span className="inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
            {creationMode}
          </span>
          {isPrivate && (
            <span className="inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-100 dark:bg-zinc-200 dark:text-zinc-800 flex items-center gap-1">
              <Lock className="h-2.5 w-2.5" /> Private
            </span>
          )}
          {isDraft && (
            <span className="inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 flex items-center gap-1">
              <FileEdit className="h-2.5 w-2.5" /> Draft
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
          {description}
        </p>

        {/* Meta Stats */}
        <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-3 text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
          <span className="flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded">
            <HelpCircle className="h-3 w-3 text-muted-foreground/70" /> {questionCount} Qs
          </span>
          <span className="flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded">
            <Clock className="h-3 w-3 text-muted-foreground/70" /> {formattedTime}
          </span>
          <span className="flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded">
            <Eye className="h-3 w-3 text-muted-foreground/70" /> {plays} Plays
          </span>
          
          {(updatedAt || createdAt) && (
            <span className="ml-auto text-[9px] opacity-70 italic lowercase">
              {updatedAt ? `Edited ${updatedAt}` : `Created ${createdAt}`}
            </span>
          )}
        </div>
      </Link>

      {/* Action Buttons Row */}
      <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/40">
        <div className="flex gap-1.5">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors border border-border/20"
          >
            <Link href={`/dashboard/quizzes/${id}/view`}>
              <Eye className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors border border-border/20"
          >
            <Link href={`/dashboard/quizzes/${id}/edit`}>
              <Edit2 className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onShare?.(id)}
            className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors border border-border/20"
          >
            <Share2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete?.(id)}
          className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors border border-border/20 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
