"use client";

import Link from "next/link";
import { GradientButton } from "@/components/custom/gradient-button";
import { OutlineButton } from "@/components/custom/outline-button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 right-0 h-80 w-80 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div className="absolute top-40 -left-40 h-80 w-80 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 animation-fade-in">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-sm font-semibold text-primary">
            Powered by Advanced AI
          </span>
        </div>

        {/* Headline */}
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl animate-slide-up">
          Master Any Subject with
          <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            AI-Generated Quizzes
          </span>
        </h1>

        {/* Subheading */}
        <p className="mb-10 text-lg text-muted-foreground sm:text-xl animate-slide-up animation-delay-100">
          Create personalized learning experiences. Compete with friends in
          real-time. Track your progress with intelligent analytics.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center animate-slide-up animation-delay-200">
          <GradientButton size="lg" className="gap-2" asChild>
            <Link href="/register">
              Start Learning Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </GradientButton>
          {/* <OutlineButton size="lg" asChild>
            <Link href="#how-it-works">Watch Demo</Link>
          </OutlineButton> */}
        </div>

        {/* Stats */}
        {/* <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border/50 pt-12">
          <div>
            <div className="text-3xl font-bold text-primary sm:text-4xl">
              10K+
            </div>
            <p className="text-sm text-muted-foreground">Active Learners</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent sm:text-4xl">
              500K+
            </div>
            <p className="text-sm text-muted-foreground">Quizzes Created</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-secondary sm:text-4xl">
              98%
            </div>
            <p className="text-sm text-muted-foreground">User Satisfaction</p>
          </div>
        </div> */}
      </div>
    </section>
  );
}
