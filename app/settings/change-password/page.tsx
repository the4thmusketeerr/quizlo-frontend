"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Eye, EyeOff, Check, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changePassword } from "@/lib/user";
import { logout } from "@/lib/auth";
import { goeyToast } from "@/components/ui/goey-toaster";
import { useAppStore } from "@/store/useAppStore";

export default function ChangePasswordPage() {
  const router = useRouter();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);

  // Validation rules
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  
  const strength = useMemo(() => {
    let score = 0;
    if (hasMinLength) score++;
    if (hasUppercase) score++;
    if (hasNumberOrSymbol) score++;
    
    if (newPassword.length === 0) return { label: "", color: "bg-transparent", text: "" };
    if (score === 1) return { label: "Weak", color: "bg-red-500", text: "text-red-500" };
    if (score === 2) return { label: "Good", color: "bg-yellow-500", text: "text-yellow-500" };
    if (score === 3) return { label: "Strong", color: "bg-[#10B981]", text: "text-[#10B981]" };
    return { label: "Too Short", color: "bg-red-300", text: "text-red-300" };
  }, [newPassword, hasMinLength, hasUppercase, hasNumberOrSymbol]);

  const canSave = 
    currentPassword && 
    newPassword && 
    confirmPassword && 
    newPassword === confirmPassword && 
    hasMinLength && 
    hasUppercase && 
    hasNumberOrSymbol;

  const handleUpdatePassword = async () => {
    if (!canSave || isSaving) return;
    
    setIsSaving(true);
    try {
      const response = await changePassword({
        currentPassword,
        newPassword
      });
      if (response.success) {
        goeyToast.success("Password updated! Please log in again.");
        await logout();
        useAppStore.getState().clearAllData();
        router.push("/login");
      }
    } catch (error: any) {
      goeyToast.error(error instanceof Error ? error.message : "Failed to update password");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] dark:bg-background pb-12 cursor-default">
      <div className="max-w-[540px] mx-auto px-4 pt-6 sm:pt-8 space-y-6 sm:space-y-8">
        {/* Navigation / Back Button */}
        <div className="flex items-center mb-0 sm:mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="group h-10 rounded-full px-4 font-bold text-slate-500 hover:bg-white hover:text-[#A855F7] hover:shadow-sm transition-all"
          >
            <ChevronLeft className="mr-1.5 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </Button>
        </div>

        <div className="space-y-1">
          <h1 className="text-[28px] sm:text-[32px] font-bold text-[#1F2937] dark:text-foreground leading-tight">Change Password</h1>
          <p className="text-sm font-medium text-muted-foreground">Update your password to keep your account secure.</p>
        </div>

        <div className="bg-white dark:bg-card rounded-[32px] p-6 sm:p-8 shadow-sm border border-border/50 space-y-6">
          {/* CURRENT PASSWORD */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest text-[#9CA3AF] uppercase px-1">
              CURRENT PASSWORD
            </label>
            <div className="relative">
              <Input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="h-14 rounded-2xl border-none bg-[#F3F4F6] dark:bg-secondary/50 px-6 text-base font-medium shadow-none focus-visible:ring-2 focus-visible:ring-[#A855F7] transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                aria-label={showCurrent ? "Hide password" : "Show password"}
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* NEW PASSWORD */}
          <div className="space-y-4 pt-1 sm:pt-2">
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-[#9CA3AF] uppercase px-1">
                NEW PASSWORD
              </label>
              <div className="relative">
                <Input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="h-14 rounded-2xl border-none bg-[#F3F4F6] dark:bg-secondary/50 px-6 text-base font-medium shadow-none focus-visible:ring-2 focus-visible:ring-[#A855F7] transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                  aria-label={showNew ? "Hide password" : "Show password"}
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* PASSWORD STRENGTH */}
            <div className="space-y-3 px-1">
              <div className="flex justify-between items-center h-4">
                <span className="text-[10px] font-bold tracking-widest text-[#9CA3AF] uppercase">PASSWORD STRENGTH</span>
                {newPassword.length > 0 && (
                  <span className={`text-[11px] font-bold ${strength.text} uppercase tracking-wider`}>{strength.label}</span>
                )}
              </div>
              <div className="h-1.5 w-full bg-[#E5E7EB] dark:bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 ease-out ${strength.color}`} 
                  style={{ width: `${(newPassword.length > 0 ? (strength.label === "Weak" ? 33 : strength.label === "Good" ? 66 : strength.label === "Strong" ? 100 : 15) : 0)}%` }}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 pt-1">
                <div className="flex items-center gap-3">
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center transition-colors duration-300 ${hasMinLength ? "bg-[#10B981]" : "bg-[#F3F4F6] dark:bg-secondary"}`}>
                    <Check size={12} className={`transition-opacity duration-300 ${hasMinLength ? "text-white opacity-100" : "text-transparent opacity-0"}`} strokeWidth={3} />
                  </div>
                  <span className={`text-[13px] font-medium transition-colors duration-300 ${hasMinLength ? "text-[#374151] dark:text-foreground" : "text-[#9CA3AF]"}`}>At least 8 characters</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center transition-colors duration-300 ${hasUppercase ? "bg-[#10B981]" : "bg-[#F3F4F6] dark:bg-secondary"}`}>
                    <Check size={12} className={`transition-opacity duration-300 ${hasUppercase ? "text-white opacity-100" : "text-transparent opacity-0"}`} strokeWidth={3} />
                  </div>
                  <span className={`text-[13px] font-medium transition-colors duration-300 ${hasUppercase ? "text-[#374151] dark:text-foreground" : "text-[#9CA3AF]"}`}>An uppercase letter</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center transition-colors duration-300 ${hasNumberOrSymbol ? "bg-[#10B981]" : "bg-[#F3F4F6] dark:bg-secondary"}`}>
                    <Check size={12} className={`transition-opacity duration-300 ${hasNumberOrSymbol ? "text-white opacity-100" : "text-transparent opacity-0"}`} strokeWidth={3} />
                  </div>
                  <span className={`text-[13px] font-medium transition-colors duration-300 ${hasNumberOrSymbol ? "text-[#374151] dark:text-foreground" : "text-[#9CA3AF]"}`}>A number or symbol</span>
                </div>
              </div>
            </div>
          </div>

          {/* CONFIRM NEW PASSWORD */}
          <div className="space-y-2 pt-1 sm:pt-2">
            <label className="text-[10px] font-bold tracking-widest text-[#9CA3AF] uppercase px-1">
              CONFIRM NEW PASSWORD
            </label>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="h-14 rounded-2xl border-none bg-[#F3F4F6] dark:bg-secondary/50 px-6 text-base font-medium shadow-none focus-visible:ring-2 focus-visible:ring-[#A855F7] transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-[11px] font-bold text-red-500 px-1 mt-1 uppercase tracking-wider">Passwords do not match</p>
            )}
          </div>

          {/* INFO BOX */}
          <div className="bg-[#EFF6FF] dark:bg-blue-900/10 border border-[#DBEAFE] dark:border-blue-900/20 p-4 sm:p-5 rounded-[24px] flex gap-3 sm:gap-4">
            <div className="h-6 w-6 rounded-full bg-[#3B82F6] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm shadow-blue-200 dark:shadow-none">
              <Info size={14} className="text-white" />
            </div>
            <p className="text-[12px] sm:text-[13px] leading-relaxed text-[#1E40AF] dark:text-blue-300 font-bold">
              After changing your password, you will be logged out of other devices. This helps keep your account synchronized and secure.
            </p>
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex flex-row gap-3 sm:gap-4 pt-1 sm:pt-2">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="flex-1 h-14 sm:h-16 rounded-[20px] sm:rounded-[24px] bg-[#E9EEF5] dark:bg-secondary/30 hover:bg-[#DEE5EF] dark:hover:bg-secondary/50 text-[#4B5563] dark:text-foreground font-bold text-sm sm:text-base transition-all"
          >
            Cancel
          </Button>
          <Button 
            disabled={!canSave || isSaving}
            onClick={handleUpdatePassword}
            className="flex-[1.5] sm:flex-1 h-14 sm:h-16 rounded-[20px] sm:rounded-[24px] bg-[#A855F7] hover:bg-[#9333EA] text-white font-bold text-sm sm:text-base shadow-xl shadow-purple-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="hidden xs:inline">Updating...</span>
              </div>
            ) : (
              "Update Password"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
