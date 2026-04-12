"use client";

import { useState, useEffect, Suspense } from "react";
import { goeyToast } from "@/components/ui/goey-toaster";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GradientButton } from "@/components/custom/gradient-button";
import { AnimatedCard } from "@/components/custom/animated-card";
import { Zap, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { passwordStrength } from "check-password-strength";
import { resetPassword } from "@/lib/auth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrengthValue, setPasswordStrengthValue] = useState<{
    id: number;
    value: string;
    contains: string[];
    length: number;
  } | null>(null);

  useEffect(() => {
    if (password) {
      setPasswordStrengthValue(passwordStrength(password));
    } else {
      setPasswordStrengthValue(null);
    }
  }, [password]);

  // No token — show error state
  if (!token) {
    return (
      <div className="space-y-6">
        <AnimatedCard hover="glow">
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <ShieldAlert className="h-9 w-9 text-destructive" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground">
                Invalid Reset Link
              </h2>
              <p className="text-sm text-muted-foreground">
                This password reset link is invalid or has expired.
              </p>
            </div>
            <Link
              href="/forgot-password"
              className="mt-2 text-sm text-primary transition-smooth hover:text-accent"
            >
              Request a new reset link
            </Link>
          </div>
        </AnimatedCard>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      goeyToast.error("Passwords do not match");
      return;
    }

    if (passwordStrengthValue && passwordStrengthValue.id < 1) {
      goeyToast.error("Please choose a stronger password");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({ token, password });
      goeyToast.success("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">

        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
            <Zap className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a strong new password for your account.
        </p>
      </div>

      {/* Form Card */}
      <AnimatedCard hover="glow">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-card/50 border-border/50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {passwordStrengthValue && (
              <div className="mt-2 space-y-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        index <= passwordStrengthValue.id
                          ? passwordStrengthValue.id === 0
                            ? "bg-red-500"
                            : passwordStrengthValue.id === 1
                              ? "bg-orange-500"
                              : passwordStrengthValue.id === 2
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          : "bg-border/50"
                      }`}
                    />
                  ))}
                </div>
                <p
                  className={`text-xs font-medium transition-colors ${
                    passwordStrengthValue.id === 0
                      ? "text-red-500"
                      : passwordStrengthValue.id === 1
                        ? "text-orange-500"
                        : passwordStrengthValue.id === 2
                          ? "text-yellow-500"
                          : "text-green-500"
                  }`}
                >
                  Password strength: {passwordStrengthValue.value}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-card/50 border-border/50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Password match indicator */}
            {confirmPassword && (
              <p
                className={`text-xs font-medium ${
                  password === confirmPassword
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {password === confirmPassword
                  ? "✓ Passwords match"
                  : "✗ Passwords do not match"}
              </p>
            )}
          </div>

          <GradientButton
            type="submit"
            disabled={loading}
            className="w-full"
            size="md"
          >
            {loading ? "Resetting password..." : "Reset Password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
