"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, User, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/useAppStore";
import { updateUsername as updateUsernameApi } from "@/lib/user";
import { goeyToast } from "@/components/ui/goey-toaster";

export default function EditUsernamePage() {
  const router = useRouter();
  const { profile, setProfile } = useAppStore();
  
  const [newUsername, setNewUsername] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isValid, setIsValid] = useState(true);
  
  // Validation regex: letters, numbers, underscores, 3-20 chars
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

  const validateUsername = (val: string) => {
    setNewUsername(val);
    if (val === "") {
      setIsValid(true);
      return;
    }
    setIsValid(usernameRegex.test(val));
  };

  const handleSave = async () => {
    if (!newUsername || !isValid || newUsername === profile?.username) return;
    
    setIsSaving(true);
    try {
      const response = await updateUsernameApi(newUsername);
      if (response.success && response.data) {
        setProfile(response.data);
        goeyToast.success("Username updated successfully!");
        router.back();
      }
    } catch (error) {
      goeyToast.error(error instanceof Error ? error.message : "Failed to update username");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (username: string) => {
    if (!username) return "U";
    return username.substring(0, 2).toUpperCase();
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
          <h1 className="text-[32px] font-bold text-[#1F2937] dark:text-foreground leading-tight">Edit Username</h1>
          <p className="text-sm font-medium text-muted-foreground">Update your public identity in the Quizlo arena.</p>
        </div>

        {/* CURRENT USERNAME DISPLAY */}
        <div className="bg-white dark:bg-card rounded-[32px] p-6 shadow-sm border border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-[#9CA3AF] uppercase mb-1">
                CURRENT USERNAME
              </p>
              <p className="text-xl font-bold text-[#111827] dark:text-foreground">
                {profile?.username || "Loading..."}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-[#F5F3FF] dark:bg-purple-900/20 flex items-center justify-center">
              <User className="h-6 w-6 text-[#A855F7]" />
            </div>
          </div>
        </div>

        {/* INPUT SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <label className="text-sm font-bold text-[#374151] dark:text-foreground">New Username</label>
            <span className="text-[11px] text-[#9CA3AF] font-semibold">3-20 characters</span>
          </div>
          
          <div className="relative">
            <Input
              value={newUsername}
              onChange={(e) => validateUsername(e.target.value)}
              placeholder="Enter new username"
              className={`h-14 rounded-2xl border-none bg-white dark:bg-card px-6 text-base font-medium shadow-sm ring-1 ring-border focus-visible:ring-2 focus-visible:ring-[#A855F7] transition-all ${
                !isValid && newUsername !== "" ? "ring-red-400 focus-visible:ring-red-400" : ""
              }`}
            />
            {isValid && newUsername.length >= 3 && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-[#10B981] flex items-center justify-center shadow-sm">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </div>

          {/* VALIDATION INDICATOR */}
          {newUsername.length > 0 && (
            <div className={`p-4 rounded-2xl border transition-all duration-300 ${
              isValid && newUsername.length >= 3 
                ? "bg-[#F0FDF4] border-[#BBF7D0] dark:bg-green-900/10 dark:border-green-800/20" 
                : "bg-[#FEF2F2] border-[#FECACA] dark:bg-red-900/10 dark:border-red-800/20"
            }`}>
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-full p-0.5 ${isValid && newUsername.length >= 3 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                  {isValid && newUsername.length >= 3 ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className={`text-sm font-bold ${isValid && newUsername.length >= 3 ? "text-[#166534]" : "text-[#991B1B]"}`}>
                    {isValid && newUsername.length >= 3 ? "Username available." : "Invalid username format."}
                  </p>
                  <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">
                    Must be unique. Letters, numbers, and underscores allowed.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* LIVE PREVIEW AREA */}
        <div className="p-6 rounded-[28px] border-2 border-dashed border-[#DDD6FE] dark:border-purple-800/30 bg-[#F5F3FF]/40 dark:bg-purple-900/5 transition-all">
          <p className="text-[11px] font-bold text-[#A855F7] uppercase tracking-widest mb-4">LIVE PREVIEW</p>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-[#A855F7] flex items-center justify-center text-[11px] font-bold text-white shadow-md">
              {getInitials(newUsername || profile?.username || "U")}
            </div>
            <p className="text-sm font-medium text-[#4B5563] dark:text-gray-300">
              Your profile will appear as: <span className="font-bold text-[#1F2937] dark:text-foreground">
                {newUsername || profile?.username || "User"}
              </span>
            </p>
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex gap-4 pt-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="flex-1 h-16 rounded-[20px] bg-[#E9EEF5] dark:bg-secondary/30 hover:bg-[#DEE5EF] dark:hover:bg-secondary/50 text-[#4B5563] dark:text-foreground font-bold text-base transition-all"
          >
            Cancel
          </Button>
          <Button 
            disabled={!isValid || newUsername.length < 3 || isSaving || newUsername === profile?.username}
            onClick={handleSave}
            className="flex-1 h-16 rounded-[20px] bg-[#A855F7] hover:bg-[#9333EA] text-white font-bold text-base shadow-xl shadow-purple-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </div>
            ) : (
              "Save Username"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  );
}
