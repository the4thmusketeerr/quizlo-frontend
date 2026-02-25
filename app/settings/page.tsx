"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { MainLayout } from "@/components/custom/main-layout";
import { AnimatedCard } from "@/components/custom/animated-card";
import { GradientButton } from "@/components/custom/gradient-button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  User,
  Bell,
  Lock,
  Palette,
  Globe,
  Shield,
  Mail,
  Camera,
  Save,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { getProfile } from "@/lib/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    email: "john.doe@example.com",
    bio: "Learning enthusiast and quiz creator",
    avatar: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    quizReminders: true,
    studyStreakReminders: false,
    weeklyReports: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    showQuizzes: true,
    showAchievements: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        if (response.success && response.data) {
          const userData = response.data;
          setProfileData((prev) => ({
            ...prev,
            firstName: userData.first_name || prev.firstName,
            lastName: userData.last_name || prev.lastName,
            username: userData.username || prev.username,
            email: userData.email || prev.email,
          }));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      }
    };

    fetchProfile();
  }, []);

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Profile updated successfully!");
    }, 1000);
  };

  const handleNotificationUpdate = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Notification preferences updated!");
    }, 1000);
  };

  const handlePrivacyUpdate = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Privacy settings updated!");
    }, 1000);
  };

  return (
    <MainLayout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger
              value="profile"
              className="flex items-center gap-2 max-sm:gap-1 max-sm:px-2 max-sm:text-xs"
            >
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2 max-sm:gap-1 max-sm:px-2 max-sm:text-xs"
            >
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="flex items-center gap-2 max-sm:gap-1 max-sm:px-2 max-sm:text-xs"
            >
              <Shield className="h-4 w-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="flex items-center gap-2 max-sm:gap-1 max-sm:px-2 max-sm:text-xs"
            >
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <AnimatedCard>
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Profile Information
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Update your profile details and how others see you
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl">
                      {profileData.firstName?.[0] ?? "?"}
                      {profileData.lastName?.[0] ?? ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">
                      {profileData.username}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG or GIF. Max size 2MB
                    </p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Camera className="h-4 w-4" />
                      Change Avatar
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Personal Information */}
                <div className="grid gap-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            firstName: e.target.value,
                          })
                        }
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            lastName: e.target.value,
                          })
                        }
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profileData.username}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          username: e.target.value,
                        })
                      }
                      placeholder="Enter your username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          bio: e.target.value,
                        })
                      }
                      placeholder="Tell us about yourself"
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      Brief description for your profile. Max 200 characters.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline">Cancel</Button>
                  <GradientButton
                    onClick={handleProfileUpdate}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </GradientButton>
                </div>
              </div>
            </AnimatedCard>

            {/* Account Security Section */}
            <AnimatedCard>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Account Security
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your password and security settings
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                        <Lock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Password</p>
                        <p className="text-sm text-muted-foreground">
                          Last changed 3 months ago
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                        <Shield className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Two-Factor Authentication
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <AnimatedCard>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Notification Preferences
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Choose what notifications you want to receive
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="email-notifications"
                        className="text-base"
                      >
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email updates about your activity
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          emailNotifications: checked,
                        })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="quiz-reminders" className="text-base">
                        Quiz Reminders
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get reminded about upcoming quizzes
                      </p>
                    </div>
                    <Switch
                      id="quiz-reminders"
                      checked={notificationSettings.quizReminders}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          quizReminders: checked,
                        })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="study-streak" className="text-base">
                        Study Streak Reminders
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Daily reminders to maintain your streak
                      </p>
                    </div>
                    <Switch
                      id="study-streak"
                      checked={notificationSettings.studyStreakReminders}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          studyStreakReminders: checked,
                        })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weekly-reports" className="text-base">
                        Weekly Reports
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive a summary of your weekly progress
                      </p>
                    </div>
                    <Switch
                      id="weekly-reports"
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          weeklyReports: checked,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline">Reset</Button>
                  <GradientButton
                    onClick={handleNotificationUpdate}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isLoading ? "Saving..." : "Save Preferences"}
                  </GradientButton>
                </div>
              </div>
            </AnimatedCard>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <AnimatedCard>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Privacy Settings
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Control who can see your content and activity
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="profile-visibility" className="text-base">
                        Profile Visibility
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Make your profile visible to other users
                      </p>
                    </div>
                    <Switch
                      id="profile-visibility"
                      checked={privacySettings.profileVisibility}
                      onCheckedChange={(checked) =>
                        setPrivacySettings({
                          ...privacySettings,
                          profileVisibility: checked,
                        })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-quizzes" className="text-base">
                        Show My Quizzes
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allow others to view your created quizzes
                      </p>
                    </div>
                    <Switch
                      id="show-quizzes"
                      checked={privacySettings.showQuizzes}
                      onCheckedChange={(checked) =>
                        setPrivacySettings({
                          ...privacySettings,
                          showQuizzes: checked,
                        })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-achievements" className="text-base">
                        Show Achievements
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Display your achievements on your profile
                      </p>
                    </div>
                    <Switch
                      id="show-achievements"
                      checked={privacySettings.showAchievements}
                      onCheckedChange={(checked) =>
                        setPrivacySettings({
                          ...privacySettings,
                          showAchievements: checked,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline">Reset</Button>
                  <GradientButton
                    onClick={handlePrivacyUpdate}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isLoading ? "Saving..." : "Save Settings"}
                  </GradientButton>
                </div>
              </div>
            </AnimatedCard>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <AnimatedCard>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Appearance Settings
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Customize how QuizMind looks for you
                  </p>
                </div>

                <Separator />

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base">Theme</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Select your preferred color theme
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setTheme("light")}
                        className={`h-24 flex-col gap-2 transition-all ${
                          theme === "light"
                            ? "border-primary border-2 bg-primary/5"
                            : ""
                        }`}
                      >
                        <Sun className="h-6 w-6" />
                        <span className="font-medium">Light</span>
                        {theme === "light" && (
                          <span className="text-xs text-primary">Active</span>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setTheme("dark")}
                        className={`h-24 flex-col gap-2 transition-all ${
                          theme === "dark"
                            ? "border-primary border-2 bg-primary/5"
                            : ""
                        }`}
                      >
                        <Moon className="h-6 w-6" />
                        <span className="font-medium">Dark</span>
                        {theme === "dark" && (
                          <span className="text-xs text-primary">Active</span>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setTheme("system")}
                        className={`h-24 flex-col gap-2 transition-all ${
                          theme === "system"
                            ? "border-primary border-2 bg-primary/5"
                            : ""
                        }`}
                      >
                        <Monitor className="h-6 w-6" />
                        <span className="font-medium">System</span>
                        {theme === "system" && (
                          <span className="text-xs text-primary">Active</span>
                        )}
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-base">Language</Label>
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <select className="flex h-10 w-full md:w-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline">Reset</Button>
                  <GradientButton disabled={isLoading} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Appearance
                  </GradientButton>
                </div>
              </div>
            </AnimatedCard>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
