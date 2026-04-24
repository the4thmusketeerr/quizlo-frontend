"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Eye, 
  Zap, 
  Users, 
  Database,
  Lock,
  Globe,
  Loader2,
  ClipboardList,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { goeyToast } from "@/components/ui/goey-toaster";

interface SettingItemProps {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const SettingItem = ({ title, description, checked, onCheckedChange }: SettingItemProps) => (
  <div className="flex items-start justify-between gap-4 py-1">
    <div className="space-y-0.5">
      <h4 className="text-sm font-bold text-[#1F2937] dark:text-foreground">{title}</h4>
      <p className="text-[13px] text-muted-foreground leading-snug max-w-[280px]">
        {description}
      </p>
    </div>
    <Switch 
      checked={checked} 
      onCheckedChange={onCheckedChange}
      className="data-[state=checked]:bg-[#A855F7]"
    />
  </div>
);

interface SettingCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const SettingCard = ({ icon, iconBg, iconColor, title, children, footer }: SettingCardProps) => (
  <div className="bg-white dark:bg-card rounded-[32px] p-6 sm:p-8 shadow-sm border border-border/50 flex flex-col h-full">
    <div className="flex items-center gap-3 mb-6">
      <div className={`h-10 w-10 rounded-2xl ${iconBg} flex items-center justify-center`}>
        <div className={iconColor}>{icon}</div>
      </div>
      <h3 className="text-lg font-bold text-[#1F2937] dark:text-foreground">{title}</h3>
    </div>
    <div className="space-y-6 flex-1">
      {children}
    </div>
    {footer && (
      <div className="mt-8 pt-6 border-t border-border/50">
        {footer}
      </div>
    )}
  </div>
);

export default function PrivacySettingsPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Profile Visibility State
  const [publicProfile, setPublicProfile] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [showStreak, setShowStreak] = useState(false);

  // Activity State
  const [showActivity, setShowActivity] = useState(true);
  const [appearLeaderboards, setAppearLeaderboards] = useState(true);

  // Social State
  const [allowFriendRequests, setAllowFriendRequests] = useState(true);
  const [allowRoomInvites, setAllowRoomInvites] = useState(true);

  // Data & Personalization State
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState(true);
  const [analyticsSharing, setAnalyticsSharing] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    goeyToast.success("Privacy settings updated successfully!");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] dark:bg-background pb-12 cursor-default">
      <div className="max-w-[1000px] mx-auto px-4 pt-6 sm:pt-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-6">
          <div className="space-y-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.back()}
              className="group h-10 rounded-full px-4 font-bold text-slate-500 hover:bg-white hover:text-[#A855F7] hover:shadow-sm transition-all w-fit"
            >
              <ChevronLeft className="mr-1.5 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back
            </Button>
            
            <div className="space-y-1">
              <h1 className="text-[28px] sm:text-[32px] font-bold text-[#1F2937] dark:text-foreground leading-tight">
                Privacy Settings
              </h1>
              <p className="text-sm font-medium text-muted-foreground">
                Control who can see your activity and how your data is used.
              </p>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Profile Visibility */}
          <SettingCard 
            title="Profile Visibility" 
            icon={<Eye size={20} />} 
            iconBg="bg-blue-50 dark:bg-blue-900/20"
            iconColor="text-blue-500"
          >
            <SettingItem 
              title="Public Profile"
              description="Allow other users to search for you and view your basic profile information."
              checked={publicProfile}
              onCheckedChange={setPublicProfile}
            />
            <SettingItem 
              title="Show Stats Publicly"
              description="Display your accuracy rate and total quizzes taken on your public profile."
              checked={showStats}
              onCheckedChange={setShowStats}
            />
            <SettingItem 
              title="Show Streak & XP"
              description="Make your current daily streak and total experience points visible to everyone."
              checked={showStreak}
              onCheckedChange={setShowStreak}
            />
          </SettingCard>

          {/* Activity */}
          <SettingCard 
            title="Activity" 
            icon={<ClipboardList size={20} />} 
            iconBg="bg-amber-50 dark:bg-amber-900/20"
            iconColor="text-amber-500"
            footer={
              <div className="bg-[#F3F4F6] dark:bg-secondary/50 rounded-2xl p-5 space-y-2">
                <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest block px-1">
                  LIVE STATUS
                </span>
                <div className="flex items-center gap-2.5 px-1">
                  <div className="h-2 w-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                  <span className="text-[13px] font-bold text-[#374151] dark:text-foreground">
                    You are currently visible to friends.
                  </span>
                </div>
              </div>
            }
          >
            <SettingItem 
              title="Show Recent Activity"
              description="Friends can see which quizzes you've played recently."
              checked={showActivity}
              onCheckedChange={setShowActivity}
            />
            <SettingItem 
              title="Appear on Leaderboards"
              description="Your username will be shown on global and regional rankings."
              checked={appearLeaderboards}
              onCheckedChange={setAppearLeaderboards}
            />
          </SettingCard>

          {/* Social */}
          <SettingCard 
            title="Social" 
            icon={<Users size={20} />} 
            iconBg="bg-purple-50 dark:bg-purple-900/20"
            iconColor="text-purple-500"
          >
            <SettingItem 
              title="Allow Friend Requests"
              description="Who can send you invitations to connect on Quizlo."
              checked={allowFriendRequests}
              onCheckedChange={setAllowFriendRequests}
            />
            <SettingItem 
              title="Allow Room Invites"
              description="Accept requests to join private quiz rooms and competitive lobbies."
              checked={allowRoomInvites}
              onCheckedChange={setAllowRoomInvites}
            />
          </SettingCard>

          {/* Data & Personalization */}
          <SettingCard 
            title="Data & Personalization" 
            icon={<Database size={20} />} 
            iconBg="bg-emerald-50 dark:bg-emerald-900/20"
            iconColor="text-emerald-500"
          >
            <SettingItem 
              title="Personalized Recommendations"
              description="Tailor the 'Explore' tab based on your quiz history and interests."
              checked={personalizedRecommendations}
              onCheckedChange={setPersonalizedRecommendations}
            />
            <SettingItem 
              title="Analytics Sharing"
              description="Help us improve Quizlo by sharing anonymous usage statistics."
              checked={analyticsSharing}
              onCheckedChange={setAnalyticsSharing}
            />
          </SettingCard>

        </div>

        {/* Security Notice */}
        <div className="bg-[#EFF6FF] dark:bg-blue-900/10 border border-[#DBEAFE] dark:border-blue-900/20 p-6 rounded-[32px] flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white dark:bg-blue-900/20 flex items-center justify-center border border-[#DBEAFE] dark:border-blue-900/20">
            <Lock size={20} className="text-[#3B82F6]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#1E40AF] dark:text-blue-300">Privacy & Security</h4>
            <p className="text-[13px] text-[#1E40AF]/80 dark:text-blue-300/80 font-medium">
              We encrypt your data and never sell it to third parties. 
              <span className="underline ml-1 cursor-pointer">Learn more</span>
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-row gap-3 sm:gap-4 pt-2">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="flex-1 h-14 rounded-2xl bg-[#E9EEF5] dark:bg-secondary/30 hover:bg-[#DEE5EF] dark:hover:bg-secondary/50 text-[#4B5563] dark:text-foreground font-bold text-sm sm:text-base transition-all"
          >
            Cancel
          </Button>
          <Button 
            disabled={isSaving}
            onClick={handleSave}
            className="flex-[1.5] sm:flex-1 h-14 rounded-2xl bg-[#A855F7] hover:bg-[#9333EA] text-white font-bold text-sm sm:text-base shadow-xl shadow-purple-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
