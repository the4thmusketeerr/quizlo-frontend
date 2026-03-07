"use client";

import { useState, useEffect, useRef } from "react";
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
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Upload,
  ImageIcon,
  X,
  Loader2,
} from "lucide-react";
import { getProfile, changePassword, uploadProfilePicture, deleteProfilePicture } from "@/lib/user";
import { goeyToast } from "@/components/ui/goey-toaster";

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

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isPasswordSectionOpen, setIsPasswordSectionOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Avatar upload state
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      goeyToast.error("Please select a JPG, PNG, GIF, or WebP image.");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      goeyToast.error("Image must be less than 2MB.");
      return;
    }

    // Show local preview immediately
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    // Upload to server
    setIsUploadingAvatar(true);
    try {
      const response = await uploadProfilePicture(file);
      if (response.success && response.data?.profilePicture) {
        setProfileData((prev) => ({
          ...prev,
          avatar: response.data!.profilePicture,
        }));
        goeyToast.success("Profile picture updated!");
      }
    } catch (error) {
      // Revert preview on failure
      setAvatarPreview(null);
      if (error instanceof Error) {
        goeyToast.error(error.message);
      } else {
        goeyToast.error("Failed to upload profile picture.");
      }
    } finally {
      setIsUploadingAvatar(false);
      // Reset file input so the same file can be re-selected
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = async () => {
    try{
      const response = await deleteProfilePicture();
      if(response.success){
        setProfileData((prev) => ({
          ...prev,
          avatar: "",
        }));
        goeyToast.success("Profile picture removed!");
      }
    }
    catch(error)
    {
      if(error instanceof Error){
        goeyToast.error(error.message);
      }else{
        goeyToast.error("Failed to remove profile picture.");
      }
    }
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: "Weak", color: "bg-red-500", percent: 20 };
    if (score === 2)
      return { label: "Fair", color: "bg-orange-500", percent: 40 };
    if (score === 3)
      return { label: "Good", color: "bg-yellow-500", percent: 60 };
    if (score === 4)
      return { label: "Strong", color: "bg-emerald-500", percent: 80 };
    return { label: "Very Strong", color: "bg-green-500", percent: 100 };
  };

  const passwordStrength = getPasswordStrength(passwordForm.newPassword);

  const passwordChecks = [
    {
      label: "At least 8 characters",
      met: passwordForm.newPassword.length >= 8,
    },
    {
      label: "Contains uppercase letter",
      met: /[A-Z]/.test(passwordForm.newPassword),
    },
    {
      label: "Contains lowercase letter",
      met: /[a-z]/.test(passwordForm.newPassword),
    },
    { label: "Contains a number", met: /[0-9]/.test(passwordForm.newPassword) },
    {
      label: "Contains special character",
      met: /[^A-Za-z0-9]/.test(passwordForm.newPassword),
    },
  ];

  const isPasswordFormValid =
    passwordForm.currentPassword.length > 0 &&
    passwordForm.newPassword.length >= 8 &&
    passwordForm.newPassword === passwordForm.confirmPassword &&
    passwordStrength.percent >= 60;

  const handleChangePassword = async () => {
    if (!isPasswordFormValid) return;

    setIsChangingPassword(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      goeyToast.success("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsPasswordSectionOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        goeyToast.error(error.message);
      } else {
        goeyToast.error("Failed to change password. Please try again.");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

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
          console.log("settings profile data:",userData);
          setProfileData((prev) => ({
            ...prev,
            firstName: userData.firstName || prev.firstName,
            lastName: userData.lastName || prev.lastName,
            username: userData.username || prev.username,
            email: userData.email || prev.email,
            avatar: userData.profilePicture || prev.avatar,
          }));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        goeyToast.error("Failed to load profile data");
      }
    };

    fetchProfile();
  }, []);

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      goeyToast.success("Profile updated successfully!");
    }, 1000);
  };

  const handleNotificationUpdate = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      goeyToast.success("Notification preferences updated!");
    }, 1000);
  };

  const handlePrivacyUpdate = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      goeyToast.success("Privacy settings updated!");
    }, 1000);
  };

  return (
    <MainLayout>
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
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="avatar-upload"
                  />

                  {/* Clickable Avatar with Camera Overlay */}
                  <div className="relative group">
                    <Avatar
                      className="h-24 w-24 cursor-pointer ring-2 ring-transparent group-hover:ring-primary/50 transition-all duration-300"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <AvatarImage src={avatarPreview || profileData.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl">
                        {profileData.firstName?.[0] ?? "?"}
                        {profileData.lastName?.[0] ?? ""}
                      </AvatarFallback>
                    </Avatar>

                    {/* Camera Overlay */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    >
                      {isUploadingAvatar ? (
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      ) : (
                        <Camera className="h-6 w-6 text-white" />
                      )}
                    </button>

                    {/* Upload Indicator Badge */}
                    {isUploadingAvatar && (
                      <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center ring-2 ring-background">
                        <Loader2 className="h-3.5 w-3.5 text-primary-foreground animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">
                      {profileData.username}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG, GIF or WebP. Max size 2MB
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                      >
                        {isUploadingAvatar ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-3.5 w-3.5" />
                            Change Avatar
                          </>
                        )}
                      </Button>
                      {(avatarPreview || profileData.avatar) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 text-muted-foreground hover:text-white hover:bg-red-500"
                          onClick={handleRemoveAvatar}
                          disabled={isUploadingAvatar}
                        >
                          <X className="h-3.5 w-3.5" />
                          Remove
                        </Button>
                      )}
                    </div>
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
                  {/* Change Password Section */}
                  <div className="border rounded-lg overflow-hidden transition-all duration-300">
                    <button
                      type="button"
                      onClick={() =>
                        setIsPasswordSectionOpen(!isPasswordSectionOpen)
                      }
                      className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                          <Lock className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-foreground">
                            Change Password
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Update your password to keep your account secure
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
                          isPasswordSectionOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Expandable Password Form */}
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isPasswordSectionOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-4 pb-5 pt-2 space-y-5 border-t">
                          {/* Current Password */}
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">
                              Current Password
                            </Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                id="currentPassword"
                                type={
                                  showPasswords.current ? "text" : "password"
                                }
                                value={passwordForm.currentPassword}
                                onChange={(e) =>
                                  setPasswordForm({
                                    ...passwordForm,
                                    currentPassword: e.target.value,
                                  })
                                }
                                placeholder="Enter your current password"
                                className="pl-9 pr-10"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowPasswords({
                                    ...showPasswords,
                                    current: !showPasswords.current,
                                  })
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {showPasswords.current ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* New Password */}
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                id="newPassword"
                                type={showPasswords.new ? "text" : "password"}
                                value={passwordForm.newPassword}
                                onChange={(e) =>
                                  setPasswordForm({
                                    ...passwordForm,
                                    newPassword: e.target.value,
                                  })
                                }
                                placeholder="Enter your new password"
                                className="pl-9 pr-10"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowPasswords({
                                    ...showPasswords,
                                    new: !showPasswords.new,
                                  })
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {showPasswords.new ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>

                            {/* Password Strength Bar */}
                            {passwordForm.newPassword.length > 0 && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">
                                    Password strength
                                  </span>
                                  <span
                                    className={`text-xs font-medium ${
                                      passwordStrength.percent <= 20
                                        ? "text-red-500"
                                        : passwordStrength.percent <= 40
                                          ? "text-orange-500"
                                          : passwordStrength.percent <= 60
                                            ? "text-yellow-500"
                                            : "text-green-500"
                                    }`}
                                  >
                                    {passwordStrength.label}
                                  </span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ease-out ${passwordStrength.color}`}
                                    style={{
                                      width: `${passwordStrength.percent}%`,
                                    }}
                                  />
                                </div>

                                {/* Password Requirements Checklist */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                                  {passwordChecks.map((check) => (
                                    <div
                                      key={check.label}
                                      className="flex items-center gap-1.5"
                                    >
                                      {check.met ? (
                                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                                      ) : (
                                        <AlertCircle className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                                      )}
                                      <span
                                        className={`text-xs ${
                                          check.met
                                            ? "text-green-500"
                                            : "text-muted-foreground/50"
                                        }`}
                                      >
                                        {check.label}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Confirm Password */}
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                              Confirm New Password
                            </Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                id="confirmPassword"
                                type={
                                  showPasswords.confirm ? "text" : "password"
                                }
                                value={passwordForm.confirmPassword}
                                onChange={(e) =>
                                  setPasswordForm({
                                    ...passwordForm,
                                    confirmPassword: e.target.value,
                                  })
                                }
                                placeholder="Confirm your new password"
                                className={`pl-9 pr-10 ${
                                  passwordForm.confirmPassword.length > 0 &&
                                  passwordForm.confirmPassword !==
                                    passwordForm.newPassword
                                    ? "border-red-500 focus-visible:ring-red-500"
                                    : passwordForm.confirmPassword.length > 0 &&
                                        passwordForm.confirmPassword ===
                                          passwordForm.newPassword
                                      ? "border-green-500 focus-visible:ring-green-500"
                                      : ""
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowPasswords({
                                    ...showPasswords,
                                    confirm: !showPasswords.confirm,
                                  })
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {showPasswords.confirm ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                            {passwordForm.confirmPassword.length > 0 &&
                              passwordForm.confirmPassword !==
                                passwordForm.newPassword && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  Passwords do not match
                                </p>
                              )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-end gap-3 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setPasswordForm({
                                  currentPassword: "",
                                  newPassword: "",
                                  confirmPassword: "",
                                });
                                setIsPasswordSectionOpen(false);
                              }}
                            >
                              Cancel
                            </Button>
                            <GradientButton
                              onClick={handleChangePassword}
                              disabled={
                                !isPasswordFormValid || isChangingPassword
                              }
                              className="gap-2"
                              size="sm"
                            >
                              <Lock className="h-3.5 w-3.5" />
                              {isChangingPassword
                                ? "Updating..."
                                : "Update Password"}
                            </GradientButton>
                          </div>
                        </div>
                      </div>
                    </div>
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
