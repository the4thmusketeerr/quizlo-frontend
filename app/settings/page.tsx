"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Camera, 
  User as UserIcon, 
  Mail, 
  Lock, 
  Shield, 
  Eye,
  Bell, 
  Moon, 
  Volume2, 
  Zap, 
  History, 
  Download, 
  HelpCircle, 
  MessageSquare, 
  FileText, 
  ChevronRight, 
  ChevronLeft,
  LogOut,
  Loader2,
  Pencil
} from "lucide-react";
import { getProfile, uploadProfilePicture, type ProfileData } from "@/lib/user";
import { useAppStore } from "@/store/useAppStore";
import { goeyToast } from "@/components/ui/goey-toaster";
import { clearToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { profile: storeProfile, setProfile: setStoreProfile } = useAppStore();
  const router = useRouter();

  const [profileData, setProfileData] = useState({
    firstName: storeProfile?.firstName || "",
    lastName: storeProfile?.lastName || "",
    username: storeProfile?.username || "User",
    email: storeProfile?.email || "user@example.com",
    avatar: storeProfile?.profilePicture || "",
  });

  const [preferences, setPreferences] = useState({
    darkMode: theme === "dark",
    soundEffects: true,
    quizAnimations: true,
  });

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        if (response.success && response.data) {
          const userData = response.data;
          setStoreProfile(userData);
          setProfileData({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            username: userData.username || "",
            email: userData.email || "",
            avatar: userData.profilePicture || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        goeyToast.error("Failed to load profile data");
      }
    };

    fetchProfile();
  }, [setStoreProfile]);

  useEffect(() => {
    setPreferences(prev => ({ ...prev, darkMode: theme === "dark" }));
  }, [theme]);

  const toggleDarkMode = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
    setPreferences(prev => ({ ...prev, darkMode: checked }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const response = await uploadProfilePicture(file);
      if (response.success && response.data?.profilePicture) {
        const updatedProfile = { 
          ...(storeProfile as ProfileData), 
          profilePicture: response.data.profilePicture 
        };
        setStoreProfile(updatedProfile);
        setProfileData((prev) => ({
          ...prev,
          avatar: response.data!.profilePicture,
        }));
        goeyToast.success("Profile picture updated!");
      }
    } catch (error) {
      if (error instanceof Error) {
        goeyToast.error(error.message);
      } else {
        goeyToast.error("Failed to upload profile picture.");
      }
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleLogout = () => {
    clearToken();
    router.push("/login");
    goeyToast.success("Logged out successfully");
  };

  return (
    <main className="min-h-screen bg-[#F8F9FE] dark:bg-background pb-12">
      <div className="max-w-[540px] mx-auto px-4 pt-8 space-y-8">
        {/* Navigation / Back Button */}
        {/* <div className="flex items-center mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="group h-10 rounded-full px-4 font-bold text-slate-500 hover:bg-white hover:text-[#A855F7] hover:shadow-sm"
          >
            <ChevronLeft className="mr-1.5 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </Button>
        </div> */}

        {/* PROFILE SECTION */}
        <SectionTitle title="PROFILE" />
        <div className="bg-white dark:bg-card rounded-[32px] p-6 shadow-sm border border-border/50">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-white dark:border-border shadow-sm">
                <AvatarImage src={profileData.avatar} />
                <AvatarFallback className="bg-muted">
                  <img src="https://placehold.net/avatar.svg" alt="Avatar" className="h-full w-full object-cover" />
                </AvatarFallback>
              </Avatar>
              {/* <div 
                className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-[#A855F7] border-2 border-white dark:border-border flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploadingAvatar ? (
                  <Loader2 className="h-3 w-3 text-white animate-spin" />
                ) : (
                  <Pencil className="h-3 w-3 text-white" />
                )}
              </div> */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-[22px] font-bold text-[#1F2937] dark:text-foreground leading-tight">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-[14px] text-muted-foreground">{profileData.email}</p>
            </div>
          </div>

          <div className="space-y-1">
            <SettingsItem 
              icon={<Camera className="h-5 w-5 text-[#A855F7]" />} 
              label="Change profile picture" 
              onClick={() => router.push("/settings/change-profile-picture")}
            />
            <SettingsItem 
              icon={<UserIcon className="h-5 w-5 text-[#A855F7]" />} 
              label="Edit username" 
              onClick={() => router.push("/settings/edit-username")}
            />
            <SettingsItem 
              icon={<Mail className="h-5 w-5 text-[#A855F7]" />} 
              label="Update email" 
              onClick={() => router.push("/settings/update-email")}
            />
          </div>
        </div>

        {/* ACCOUNT SECTION */}
        <SectionTitle title="ACCOUNT" />
        <div className="bg-white dark:bg-card rounded-[32px] px-6 py-2 shadow-sm border border-border/50">
          <div className="space-y-1">
            <SettingsItem 
              icon={<Lock className="h-5 w-5 text-[#A855F7]" />} 
              label="Change Password" 
              onClick={() => router.push("/settings/change-password")}
            />
            <SettingsItem 
              icon={<Shield className="h-5 w-5 text-[#A855F7]" />} 
              label="Security" 
              onClick={() => router.push("/settings/account-security")}
            />
            <SettingsItem 
              icon={<Eye className="h-5 w-5 text-[#A855F7]" />} 
              label="Privacy Settings" 
              onClick={() => router.push("/settings/privacy-settings")}
            />
            <SettingsItem 
              icon={<Bell className="h-5 w-5 text-[#A855F7]" />} 
              label="Notification Preferences" 
              onClick={() => router.push("/settings/notifications-preference")}
            />
          </div>
        </div>

        {/* APP PREFERENCES */}
        <SectionTitle title="APP PREFERENCES" />
        <div className="bg-white dark:bg-card rounded-[32px] px-6 py-2 shadow-sm border border-border/50">
          <div className="space-y-1">
            <SettingsToggle 
              icon={<Moon className="h-5 w-5 text-[#A855F7]" />} 
              label="Dark Mode" 
              checked={preferences.darkMode}
              onCheckedChange={toggleDarkMode}
            />
            <SettingsToggle 
              icon={<Volume2 className="h-5 w-5 text-[#A855F7]" />} 
              label="Sound Effects" 
              checked={preferences.soundEffects}
              onCheckedChange={(v) => setPreferences(prev => ({ ...prev, soundEffects: v }))}
            />
            <SettingsToggle 
              icon={<Zap className="h-5 w-5 text-[#A855F7]" />} 
              label="Quiz Animations" 
              checked={preferences.quizAnimations}
              onCheckedChange={(v) => setPreferences(prev => ({ ...prev, quizAnimations: v }))}
            />
          </div>
        </div>

        {/* ACTIVITY & DATA */}
        <SectionTitle title="ACTIVITY & DATA" />
        <div className="bg-white dark:bg-card rounded-[32px] px-6 py-2 shadow-sm border border-border/50">
          <div className="space-y-1">
            <SettingsItem 
              icon={<History className="h-5 w-5 text-[#A855F7]" />} 
              label="View Quiz History" 
            />
            <SettingsItem 
              icon={<Download className="h-5 w-5 text-[#A855F7]" />} 
              label="Download My Data" 
            />
          </div>
        </div>

        {/* SUPPORT SECTION */}
        <SectionTitle title="SUPPORT" />
        <div className="bg-white dark:bg-card rounded-[32px] px-6 py-2 shadow-sm border border-border/50">
          <div className="space-y-1">
            <SettingsItem 
              icon={<HelpCircle className="h-5 w-5 text-[#A855F7]" />} 
              label="Help Center" 
            />
            <SettingsItem 
              icon={<MessageSquare className="h-5 w-5 text-[#A855F7]" />} 
              label="Contact Support" 
            />
            <SettingsItem 
              icon={<FileText className="h-5 w-5 text-[#A855F7]" />} 
              label="Terms & Privacy" 
            />
          </div>
        </div>

        {/* LOG OUT BUTTON */}
        <div className="pt-4">
          <Button 
            variant="ghost" 
            className="w-full h-14 rounded-[20px] bg-[#E9EEF5] dark:bg-secondary/30 hover:bg-[#DEE5EF] dark:hover:bg-secondary/50 text-[#4B5563] dark:text-foreground font-bold text-base transition-all duration-300 gap-3"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </Button>
          <p className="text-center text-[11px] font-medium text-muted-foreground mt-4">
            Quizlo v2.4.0 • Made with ❤️ for learners
          </p>
        </div>
      </div>
    </main>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h3 className="text-[12px] font-bold tracking-wider text-[#A855F7] ml-2 mb-1 uppercase">
      {title}
    </h3>
  );
}

function SettingsItem({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <div 
      className="flex items-center justify-between py-4 cursor-pointer group hover:bg-muted/30 -mx-4 px-4 rounded-xl transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl">
          {icon}
        </div>
        <span className="text-base font-medium text-[#374151] dark:text-gray-200 group-hover:text-[#A855F7] transition-colors">
          {label}
        </span>
      </div>
      <ChevronRight className="h-5 w-5 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
    </div>
  );
}

function SettingsToggle({ icon, label, checked, onCheckedChange }: { icon: React.ReactNode, label: string, checked: boolean, onCheckedChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-4 -mx-4 px-4">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl">
          {icon}
        </div>
        <span className="text-base font-medium text-[#374151] dark:text-gray-200">
          {label}
        </span>
      </div>
      <Switch 
        checked={checked} 
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-[#A855F7]"
      />
    </div>
  );
}
