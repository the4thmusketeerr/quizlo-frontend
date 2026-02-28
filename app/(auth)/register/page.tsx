"use client";

import { useState, useEffect } from "react";
import { passwordStrength } from "check-password-strength";
import { goeyToast } from "@/components/ui/goey-toaster";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/custom/gradient-button";
import { AnimatedCard } from "@/components/custom/animated-card";
import { Checkbox } from "@/components/ui/checkbox";
import { Zap, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { signup, storeToken } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrengthValue, setPasswordStrengthValue] = useState<{
    id: number;
    value: string;
    contains: string[];
    length: number;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, type } = e.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: e.target.value,
      });
    }
  };

  // Check password strength whenever password changes
  useEffect(() => {
    if (formData.password) {
      const strength = passwordStrength(formData.password);
      setPasswordStrengthValue(strength);
    } else {
      setPasswordStrengthValue(null);
    }
  }, [formData.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      goeyToast.error("Passwords do not match");
      return;
    }
    if (!formData.agreeToTerms) {
      goeyToast.error("Please agree to the terms and conditions");
      return;
    }

    setLoading(true);

    try {
      // Call the signup API
      const response = await signup({
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // Store the token returned by the signup endpoint
      if (response.token) {
        storeToken(response.token);
      }

      // Show success message
      goeyToast.success("Account created successfully! Redirecting...");

      // Clear form
      setFormData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
      });

      // Redirect to home page after a short delay
      setTimeout(() => {
        router.push("/home");
      }, 1500);
    } catch (error) {
      // Show error message
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
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-muted-foreground transition-smooth hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
            <Zap className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Join thousands of learners on QuizMind
        </p>
      </div>

      {/* Form Card */}
      <AnimatedCard hover="glow">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name and Last Name on same row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="bg-card/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="bg-card/50 border-border/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="johndoe"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="bg-card/50 border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-card/50 border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                name="password"
                value={formData.password}
                onChange={handleChange}
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
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
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, agreeToTerms: checked as boolean })
              }
            />
            <label
              htmlFor="terms"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              I agree to the{" "}
              <Link href="#" className="text-primary hover:text-accent">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-primary hover:text-accent">
                Privacy Policy
              </Link>
            </label>
          </div>

          <GradientButton
            type="submit"
            disabled={loading}
            className="w-full"
            size="md"
          >
            {loading ? "Creating account..." : "Create Account"}
          </GradientButton>
        </form>
      </AnimatedCard>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or sign up with
          </span>
        </div>
      </div>

      {/* Social Buttons */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full border-border/50"
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </Button>
      </div>

      {/* Sign In Link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
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
