'use client'

import Link from 'next/link'
import { Zap } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="border-t border-border/50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          {/* <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">QuizMind</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Learn smarter, not harder. Master any subject with AI-powered quizzes.
            </p>
          </div> */}

          {/* Product */}
          {/* <div>
            <h3 className="mb-4 font-semibold text-foreground">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#features"
                  className="text-muted-foreground transition-smooth hover:text-foreground"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-muted-foreground transition-smooth hover:text-foreground"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-smooth hover:text-foreground"
                >
                  API
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Company */}
          {/* <div>
            <h3 className="mb-4 font-semibold text-foreground">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-smooth hover:text-foreground"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-smooth hover:text-foreground"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-smooth hover:text-foreground"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div> */}
        </div>

        {/* <Separator className="my-8 bg-border/50" /> */}

        <div className="flex flex-col justify-center gap-4 md:flex-row items-center md:items-center">
          <p className="text-right text-sm text-muted-foreground">
            © 2026 Quizlo. All rights reserved.
          </p>
          {/* <div className="flex gap-6 text-sm">
            <Link
              href="#"
              className="text-muted-foreground transition-smooth hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-muted-foreground transition-smooth hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-muted-foreground transition-smooth hover:text-foreground"
            >
              Contact
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  )
}
