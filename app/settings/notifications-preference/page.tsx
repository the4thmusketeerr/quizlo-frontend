"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Bell, 
  Mail, 
  Radio, 
  BarChart3, 
  Users, 
  Settings2,
  Loader2,
  Wrench
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { goeyToast } from "@/components/ui/goey-toaster";

interface NotificationItemProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  variant?: "switch" | "checkbox";
}

const NotificationItem = ({ 
  title, 
  description, 
  icon, 
  iconBg, 
  checked, 
  onCheckedChange,
  variant = "switch" 
}: NotificationItemProps) => (
  <div className="flex items-center justify-between gap-4 py-3">
    <div className="flex items-center gap-4">
      {icon && (
        <div className={`h-10 w-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
      )}
      <div className="space-y-0.5">
        <h4 className="text-sm font-bold text-[#1F2937] dark:text-foreground">{title}</h4>
        {description && (
          <p className="text-[12px] text-muted-foreground leading-snug max-w-[320px]">
            {description}
          </p>
        )}
      </div>
    </div>
    {variant === "switch" ? (
      <Switch 
        checked={checked} 
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-[#A855F7]"
      />
    ) : (
      <Checkbox 
        checked={checked} 
        onCheckedChange={onCheckedChange}
        className="h-5 w-5 rounded-md border-2 border-muted-foreground/30 data-[state=checked]:bg-[#A855F7] data-[state=checked]:border-[#A855F7]"
      />
    )}
  </div>
);

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
}

const SectionHeader = ({ icon, title }: SectionHeaderProps) => (
  <div className="flex items-center gap-2.5 mb-4 px-1">
    <div className="text-muted-foreground/60">{icon}</div>
    <h3 className="text-[11px] font-bold tracking-[0.15em] text-muted-foreground/80 uppercase">
      {title}
    </h3>
  </div>
);

export default function NotificationsPreferencePage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Channels State
  const [inApp, setInApp] = useState(true);
  const [email, setEmail] = useState(false);

  // Activity State
  const [quizResults, setQuizResults] = useState(true);
  const [achievements, setAchievements] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);

  // Social State
  const [friendRequests, setFriendRequests] = useState(true);
  const [roomInvites, setRoomInvites] = useState(true);
  const [leaderboardUpdates, setLeaderboardUpdates] = useState(false);

  // System State
  const [newFeatures, setNewFeatures] = useState(true);
  const [announcements, setAnnouncements] = useState(true);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    goeyToast.success("Notification preferences updated!");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] dark:bg-background pb-12 cursor-default">
      <div className="max-w-[800px] mx-auto px-4 pt-6 sm:pt-8 space-y-10">
        
        {/* Header */}
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
              Notification Preferences
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              Choose how and when you want to be notified about your activity.
            </p>
          </div>
        </div>

        {/* Notification Channels */}
        <div className="space-y-4">
          <SectionHeader icon={<Radio size={16} />} title="Notification Channels" />
          <div className="bg-white dark:bg-card rounded-[32px] p-6 sm:p-8 shadow-sm border border-border/50 space-y-4">
            <NotificationItem 
              title="In-App Notifications"
              description="Receive alerts within the Quizlo web and mobile app."
              icon={<Bell size={18} className="text-blue-500" />}
              iconBg="bg-blue-50 dark:bg-blue-900/20"
              checked={inApp}
              onCheckedChange={setInApp}
            />
            <div className="h-px bg-border/50" />
            <NotificationItem 
              title="Email Notifications"
              description="Get periodic updates and reports delivered to your inbox."
              icon={<Mail size={18} className="text-purple-500" />}
              iconBg="bg-purple-50 dark:bg-purple-900/20"
              checked={email}
              onCheckedChange={setEmail}
            />
          </div>
        </div>

        {/* Activity Notifications */}
        <div className="space-y-4">
          <SectionHeader icon={<BarChart3 size={16} />} title="Activity Notifications" />
          <div className="bg-white dark:bg-card rounded-[32px] p-6 sm:p-8 shadow-sm border border-border/50 space-y-4">
            <NotificationItem 
              title="Quiz Results"
              checked={quizResults}
              onCheckedChange={setQuizResults}
            />
            <div className="h-px bg-border/50" />
            <NotificationItem 
              title="Achievements & XP"
              checked={achievements}
              onCheckedChange={setAchievements}
            />
            <div className="h-px bg-border/50" />
            <NotificationItem 
              title="Streak Reminders"
              checked={streakReminders}
              onCheckedChange={setStreakReminders}
            />
          </div>
        </div>

        {/* Social & System Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Social */}
          <div className="space-y-4">
            <SectionHeader icon={<Users size={16} />} title="Social" />
            <div className="bg-white dark:bg-card rounded-[32px] p-6 sm:p-8 shadow-sm border border-border/50 h-full space-y-4">
              <NotificationItem 
                title="Friend Requests"
                checked={friendRequests}
                onCheckedChange={setFriendRequests}
                variant="checkbox"
              />
              <NotificationItem 
                title="Room Invites"
                checked={roomInvites}
                onCheckedChange={setRoomInvites}
                variant="checkbox"
              />
              <NotificationItem 
                title="Leaderboard Updates"
                checked={leaderboardUpdates}
                onCheckedChange={setLeaderboardUpdates}
                variant="checkbox"
              />
            </div>
          </div>

          {/* System & Updates */}
          <div className="space-y-4">
            <SectionHeader icon={<Wrench size={16} />} title="System & Updates" />
            <div className="bg-white dark:bg-card rounded-[32px] p-6 sm:p-8 shadow-sm border border-border/50 h-full space-y-4">
              <NotificationItem 
                title="New Features"
                description="Stay in the loop with what's new."
                checked={newFeatures}
                onCheckedChange={setNewFeatures}
                variant="checkbox"
              />
              <NotificationItem 
                title="Announcements"
                description="Community news and events."
                checked={announcements}
                onCheckedChange={setAnnouncements}
                variant="checkbox"
              />
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-row gap-3 sm:gap-4 pt-4">
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
            ) : "Save Changes"}
          </Button>
        </div>

      </div>
    </div>
  );
}
