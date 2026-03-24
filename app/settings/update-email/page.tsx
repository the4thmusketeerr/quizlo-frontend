"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Mail, Check, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/useAppStore";
import { updateEmail as updateEmailApi } from "@/lib/user";
import { goeyToast } from "@/components/ui/goey-toaster";
import Link from "next/link";

export default function UpdateEmailPage() {
  const router = useRouter();
  const { profile, setProfile } = useAppStore();
  
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (val: string) => {
    setNewEmail(val);
    if (val === "") {
      setIsValidEmail(true);
      return;
    }
    setIsValidEmail(emailRegex.test(val));
  };

  const handleSave = async () => {
    if (!newEmail || !isValidEmail || !password || newEmail === profile?.email) return;
    
    setIsSaving(true);
    try {
      const response = await updateEmailApi(newEmail, password);
      if (response.success && response.data) {
        setProfile(response.data);
        goeyToast.success("Email updated successfully!");
        router.back();
      }
    } catch (error) {
      goeyToast.error(error instanceof Error ? error.message : "Failed to update email");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] dark:bg-background pb-12 cursor-default">
      <div className="max-w-[540px] mx-auto px-4 pt-8 space-y-8">
        {/* Navigation / Back Button */}
        <div className="flex items-center mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="group h-10 rounded-full px-4 font-bold text-slate-500 hover:bg-white hover:text-[#A855F7] hover:shadow-sm"
          >
            <ChevronLeft className="mr-1.5 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </Button>
        </div>

        <div className="space-y-1">
          <h1 className="text-[32px] font-bold text-[#1F2937] dark:text-foreground leading-tight">Update Email</h1>
          <p className="text-sm font-medium text-muted-foreground">Manage your account communications and security.</p>
        </div>

        {/* CURRENT EMAIL DISPLAY */}
        <div className="bg-white dark:bg-card rounded-[32px] p-6 shadow-sm border border-border/50">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-[#F5F3FF] dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
              <Mail className="h-6 w-6 text-[#A855F7]" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-[#9CA3AF] uppercase mb-1">
                CURRENT EMAIL
              </p>
              <p className="text-lg font-bold text-[#111827] dark:text-foreground break-all">
                {profile?.email || "Loading..."}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                This is the email used for login and notifications.
              </p>
            </div>
          </div>
        </div>

        {/* INPUT SECTION */}
        <div className="bg-white dark:bg-card rounded-[32px] p-8 shadow-sm border border-border/50 space-y-8">
          {/* New Email Input */}
          <div className="space-y-4">
            <div className="px-2">
              <label className="text-sm font-bold text-[#374151] dark:text-foreground">New Email Address</label>
            </div>
            
            <div className="relative">
              <Input
                value={newEmail}
                onChange={(e) => validateEmail(e.target.value)}
                placeholder="new.email@example.com"
                className={`h-14 rounded-2xl border-none bg-[#F9FAFB] dark:bg-secondary/20 px-6 text-base font-medium shadow-none transition-all ${
                  !isValidEmail && newEmail !== "" ? "ring-2 ring-red-400" : "focus-visible:ring-2 focus-visible:ring-[#A855F7]"
                }`}
              />
              {isValidEmail && newEmail.length >= 6 && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-[#10B981] flex items-center justify-center shadow-sm">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 px-2 text-[12px] text-muted-foreground">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>A verification link will be sent to your new email address.</span>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-border/50" />

          {/* Password Input */}
          <div className="space-y-4">
            <div className="px-2">
              <label className="text-sm font-bold text-[#374151] dark:text-foreground">Confirm Password</label>
            </div>
            
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your current password"
                className="h-14 rounded-2xl border-none bg-[#F9FAFB] dark:bg-secondary/20 px-6 pr-14 text-base font-medium shadow-none focus-visible:ring-2 focus-visible:ring-[#A855F7] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <p className="px-2 text-[12px] text-muted-foreground leading-relaxed">
              Please confirm your password to make this sensitive change.
            </p>
          </div>
        </div>

        {/* SECURITY INFO BOX */}
        <div className="p-8 rounded-[32px] bg-[#F5F3FF] dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/20 transition-all text-center">
          <p className="text-sm font-bold text-[#7C3AED] dark:text-purple-400 leading-relaxed">
            Your security is our priority. We'll never share your email with third parties.
          </p>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex gap-4 pt-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="flex-1 h-16 rounded-[22px] bg-[#F3F4F6] dark:bg-secondary/30 hover:bg-[#E5E7EB] dark:hover:bg-secondary/50 text-[#4B5563] dark:text-foreground font-bold text-base transition-all"
          >
            Cancel
          </Button>
          <Button 
            disabled={!isValidEmail || newEmail.length < 5 || !password || isSaving || newEmail === profile?.email}
            onClick={handleSave}
            className="flex-1 h-16 rounded-[22px] bg-[#A855F7] hover:bg-[#9333EA] text-white font-bold text-base shadow-xl shadow-purple-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Updating...
              </div>
            ) : (
              "Update Email"
            )}
          </Button>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs font-medium text-muted-foreground">
            Having trouble?{" "}
            <Link href="/support" className="text-[#A855F7] font-bold hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
