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
        <div className="absolute -top-40 right-0 h-96 w-96 bg-[#A855F7]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
        <div className="absolute top-40 -left-40 h-96 w-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] bg-primary/10 rounded-full filter blur-[100px]" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        {/* Badge */}
        {/* <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#A855F7]/30 bg-[#A855F7]/10 px-4 py-2 animation-fade-in shadow-[0_0_15px_rgba(168,85,247,0.15)]">
          <Sparkles className="h-4 w-4 text-[#A855F7]" />
          <span className="text-sm font-semibold text-primary">
            Powered by Advanced AI
          </span>
        </div> */}

        {/* Headline */}
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-7xl animate-slide-up leading-[1.1]">
          Master Any Subject with
          <span className="block bg-gradient-to-r from-[#A855F7] via-purple-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm">
            AI-Generated Quizzes
          </span>
        </h1>

        {/* Subheading */}
        <p className="mb-10 text-lg text-muted-foreground sm:text-2xl animate-slide-up animation-delay-100 max-w-2xl mx-auto">
          Create personalized learning experiences. Compete with friends in
          real-time. Track your progress with intelligent analytics.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center animate-slide-up animation-delay-200">
          <GradientButton size="lg" className="gap-2 h-14 px-8 text-lg bg-gradient-to-r from-[#A855F7] to-indigo-600 shadow-xl shadow-purple-500/20" asChild>
            <Link href="/register">
              Start Learning Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </GradientButton>
        </div>
      </div>
    </section>
  );
}
