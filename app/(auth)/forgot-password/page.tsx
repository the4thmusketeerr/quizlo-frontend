"use client";

import { useState } from "react";
import { goeyToast } from "@/components/ui/goey-toaster";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GradientButton } from "@/components/custom/gradient-button";
import { AnimatedCard } from "@/components/custom/animated-card";
import { Zap, Mail, CheckCircle2 } from "lucide-react";
import { forgotPassword } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (error) {
      if (error instanceof Error) {
        goeyToast.error(error.message);
      } else {
        goeyToast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="space-y-6">
        {/* Success Card */}
        <AnimatedCard hover="glow">
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-9 w-9 text-green-500" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground">
                Check your email
              </h2>
              <p className="text-sm text-muted-foreground">
                We&apos;ve sent a password reset link to
              </p>
              <p className="text-sm font-semibold text-primary">{email}</p>
            </div>
            <p className="max-w-xs text-xs text-muted-foreground leading-relaxed">
              Click the link in the email to reset your password. If you
              don&apos;t see it, check your spam folder.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setEmail("");
              }}
              className="mt-2 text-xs text-muted-foreground underline-offset-4 hover:underline transition-colors hover:text-foreground"
            >
              Use a different email?
            </button>
          </div>
        </AnimatedCard>

        <p className="text-center text-sm text-muted-foreground">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="text-primary transition-smooth hover:text-accent"
          >
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">

        
        <h1 className="text-2xl font-bold text-foreground">Forgot Password?</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No worries! Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {/* Form Card */}
      <AnimatedCard hover="glow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-card/50 border-border/50 pl-9"
              />
            </div>
          </div>

          <GradientButton
            type="submit"
            disabled={loading}
            className="w-full"
            size="md"
          >
            {loading ? "Sending reset link..." : "Send Reset Link"}
          </GradientButton>
        </form>
      </AnimatedCard>

      {/* Sign In Link */}
      <p className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link
          href="/login"
          className="text-primary transition-smooth hover:text-accent"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
