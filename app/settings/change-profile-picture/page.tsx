"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Upload,
  RefreshCw,
  Check,
  Loader2,
  Plus,
  Image as ImageIcon,
  Pencil,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store/useAppStore";
import { uploadProfilePicture, type ProfileData } from "@/lib/user";
import { goeyToast } from "@/components/ui/goey-toaster";
import { cn } from "@/lib/utils";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import { useMemo } from "react";

export default function ChangeProfilePicturePage() {
  const router = useRouter();
  const { profile, setProfile } = useAppStore();

  const [isUploading, setIsUploading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(
    profile?.profilePicture || null,
  );
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeMode, setActiveMode] = useState<"upload" | "presets" | "custom">(
    "upload",
  );

  // DiceBear State
  const [avatarOptions, setAvatarOptions] = useState<any>({
    seed: profile?.username || "seed",
    backgroundColor: ["b6e3f4"],
    top: ["longHair"],
    accessories: ["none"],
    hairColor: ["brown"],
    facialHair: ["none"],
    facialHairColor: ["brown"],
    clothes: ["overall"],
    eyes: ["default"],
    eyebrow: ["default"],
    mouth: ["smile"],
    skinColor: ["f8d25c"],
  });

  const customAvatarSvg = useMemo(() => {
    return createAvatar(avataaars, {
      ...avatarOptions,
      size: 128,
    }).toString();
  }, [avatarOptions]);

  const customAvatarUri = useMemo(() => {
    return `data:image/svg+xml;utf8,${encodeURIComponent(customAvatarSvg)}`;
  }, [customAvatarSvg]);

  // Update selected avatar when in custom mode
  useEffect(() => {
    if (activeMode === "custom") {
      setSelectedAvatar(customAvatarUri);
    }
  }, [customAvatarUri, activeMode]);

  // Simulated generated avatars for the grid
  const [generatedAvatars] = useState([
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Toby",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Ruby",
  ]);

  const handleFile = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await uploadProfilePicture(file);
      if (response.success && response.data?.profilePicture) {
        const updatedProfile = {
          ...(profile as ProfileData),
          profilePicture: response.data.profilePicture,
        };
        setProfile(updatedProfile);
        setSelectedAvatar(response.data.profilePicture);
        goeyToast.success("Profile picture updated!");
      }
    } catch (error) {
      goeyToast.error(
        error instanceof Error ? error.message : "Failed to upload photo",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const saveCustomAvatar = async () => {
    try {
      const blob = new Blob([customAvatarSvg], { type: "image/svg+xml" });
      const file = new File([blob], "avatar.svg", { type: "image/svg+xml" });
      await handleFile(file);
      router.back();
    } catch (error) {
      console.error("Error saving custom avatar:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] dark:bg-background pb-12 cursor-default">
      <div className="max-w-[700px] mx-auto px-4 pt-8 space-y-10">
        {/* HEADER SECTION */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-10 w-10 rounded-full bg-white shadow-sm hover:bg-slate-50 border border-slate-100 dark:bg-secondary/20 dark:border-none"
            >
              <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-gray-300" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-[#1F2937] dark:text-foreground leading-tight">
                Change Profile Picture
              </h1>
              <p className="text-[13px] font-medium text-muted-foreground">
                Update how others see you on Quizlo.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-[#F5F3FF] dark:bg-purple-900/20 px-3 py-1.5 rounded-full select-none">
            <HelpCircle className="h-3.5 w-3.5 text-[#A855F7]" />
            <span className="text-[11px] font-bold text-[#A855F7]">Quizlo</span>
          </div>
        </div>

        {/* PROFILE PREVIEW */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <Avatar className="h-28 w-28 md:h-32 md:w-32 border-[6px] border-white dark:border-card shadow-2xl ring-1 ring-slate-100 dark:ring-border/50">
              <AvatarImage src={selectedAvatar || ""} />
              <AvatarFallback className="bg-[#A855F7] text-white text-3xl font-bold">
                {profile?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            {/* <div className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-[#A855F7] border-[3px] border-white dark:border-card flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-110 transition-all">
              <Pencil className="h-4 w-4 text-white" />
            </div> */}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black text-[#1F2937] dark:text-foreground tracking-tight">
              {profile?.username || "User"}
            </h2>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex bg-white dark:bg-card p-1.5 rounded-[24px] shadow-sm border border-border/50 max-w-md mx-auto">
          {(["upload", "presets", "custom"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setActiveMode(mode)}
              className={cn(
                "flex-1 py-3 px-4 rounded-[18px] text-sm font-bold capitalize transition-all",
                activeMode === mode
                  ? "bg-[#F5F3FF] text-[#A855F7] dark:bg-purple-900/20 shadow-sm"
                  : "text-muted-foreground hover:bg-slate-50 dark:hover:bg-secondary/20",
              )}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* CONTENT SECTIONS */}
        {activeMode === "upload" && (
          <div className="bg-white dark:bg-card rounded-[40px] p-8 shadow-sm border border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-bold text-[#374151] dark:text-foreground mb-6">
              Upload a Photo
            </h3>
            <div
              className={cn(
                "relative h-64 rounded-[32px] border-2 border-dashed border-[#DDD6FE] dark:border-purple-800/30 bg-[#F5F3FF]/30 dark:bg-purple-900/5 flex flex-col items-center justify-center transition-all duration-300",
                dragActive
                  ? "border-[#A855F7] bg-[#F5F3FF]/60 scale-[0.99]"
                  : "hover:border-[#A855F7]/50",
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="h-14 w-14 rounded-2xl bg-[#F5F3FF] dark:bg-purple-900/20 flex items-center justify-center mb-5 shadow-sm">
                <Upload className="h-7 w-7 text-[#A855F7]" />
              </div>
              <p className="text-base font-bold text-[#1F2937] dark:text-foreground">
                Drag and drop your photo here
              </p>
              <p className="text-[12px] font-medium text-muted-foreground mt-2">
                Supported: JPG, PNG • Max size 5MB
              </p>

              <Button
                onClick={() => fileInputRef.current?.click()}
                className="mt-8 h-11 rounded-full bg-white dark:bg-secondary hover:bg-slate-50 dark:hover:bg-secondary/80 text-[#374151] dark:text-foreground font-bold text-sm px-8 shadow-sm border border-slate-100 dark:border-none"
              >
                Upload from device
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files?.[0] && handleFile(e.target.files[0])
                }
                className="hidden"
              />

              {isUploading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-card/80 rounded-[32px] flex flex-col items-center justify-center backdrop-blur-[2px] z-10">
                  <Loader2 className="h-10 w-10 text-[#A855F7] animate-spin mb-3" />
                  <p className="text-base font-bold text-[#A855F7]">
                    Uploading...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeMode === "presets" && (
          <div className="bg-white dark:bg-card rounded-[40px] p-8 shadow-sm border border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-[#374151] dark:text-foreground">
                Choose a Generated Avatar
              </h3>
              <Button
                variant="ghost"
                className="text-[#A855F7] font-bold text-sm gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/10 h-10 px-4 rounded-full"
              >
                <RefreshCw className="h-4 w-4" />
                Generate New
              </Button>
            </div>
            <p className="text-[13px] font-medium text-muted-foreground mb-8">
              Pick a ready-made avatar generated for you.
            </p>

            <div className="grid grid-cols-5 gap-4 md:gap-6">
              {generatedAvatars.map((url, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedAvatar(url)}
                  className={cn(
                    "relative aspect-square rounded-full cursor-pointer transition-all duration-300 transform hover:scale-105",
                    selectedAvatar === url
                      ? "ring-4 ring-[#A855F7] ring-offset-4 ring-offset-white dark:ring-offset-background"
                      : "hover:ring-2 hover:ring-[#A855F7]/30",
                  )}
                >
                  <img
                    src={url}
                    alt={`Avatar ${index}`}
                    className="w-full h-full rounded-full object-cover shadow-md"
                  />
                  {selectedAvatar === url && (
                    <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-[#A855F7] flex items-center justify-center border-2 border-white dark:border-card shadow-lg animate-in zoom-in-50 duration-300">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeMode === "custom" && (
          <div className="bg-white dark:bg-card rounded-[40px] p-8 shadow-sm border border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-bold text-[#374151] dark:text-foreground mb-6">
              Create Your Avatar
            </h3>

            <div className="space-y-8">
              {[
                {
                  label: "Eyes",
                  key: "eyes",
                  options: [
                    "default",
                    "happy",
                    "wink",
                    "hearts",
                    "side",
                    "squint",
                    "surprised",
                    "xDizzy",
                    "winkWacky",
                    "eyeroll",
                  ],
                },
                {
                  label: "Hair Color",
                  key: "hairColor",
                  options: [
                    "2c1b18",
                    "4a312c",
                    "ecdcbf",
                    "b58143",
                    "724133",
                    "f59797",
                    "a55728",
                    "d6b370",
                    "e8e1e1",
                    "c93305",
                  ],
                },
                {
                  label: "Hair",
                  key: "top",
                  options: [
                    "longHair",
                    "shortHair",
                    "bighair",
                    "curly",
                    "bob",
                    "curvy",
                    "eyepatch",
                    "hat",
                    "hijab",
                    "turban",
                    "dreads",
                    "fro",
                  ],
                },
                {
                  label: "Skin",
                  key: "skinColor",
                  options: ["f8d25c", "ffdbac", "f1c27d", "e0ac69", "8d5524"],
                },
                {
                  label: "Mouth",
                  key: "mouth",
                  options: [
                    "smile",
                    "default",
                    "grimace",
                    "eating",
                    "serious",
                    "tongue",
                  ],
                },
                {
                  label: "Facial Hair Color",
                  key: "facialHairColor",
                  options: [
                    "2c1b18",
                    "4a312c",
                    "724133",
                    "a55728",
                    "e8e1e1",
                    "f59797",
                  ],
                },
                {
                  label: "Facial Hair",
                  key: "facialHair",
                  options: [
                    "beardLight",
                    "beardMedium",
                    "beardMajestic",
                    "moustacheFancy",
                    "moustacheMagnum",
                  ],
                },
                {
                  label: "Clothes",
                  key: "clothes",
                  options: ["overall", "blazer", "shirt", "hoodie", "sweater"],
                },
              ].map((group) => (
                <div key={group.key} className="space-y-3">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.options.map((opt) => (
                      <Button
                        key={opt}
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setAvatarOptions((prev: any) => ({
                            ...prev,
                            [group.key]: [opt],
                          }))
                        }
                        className={cn(
                          "rounded-full px-4 h-9 font-bold transition-all",
                          avatarOptions[group.key][0] === opt
                            ? "bg-[#A855F7] text-white border-transparent shadow-md scale-105"
                            : "hover:border-[#A855F7] hover:text-[#A855F7]",
                        )}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER ACTIONS */}
        <div className="flex gap-4 pt-4 pb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex-1 h-14 rounded-[22px] bg-[#F3F4F6] dark:bg-secondary/30 hover:bg-[#E5E7EB] dark:hover:bg-secondary/50 text-[#4B5563] dark:text-foreground font-bold text-base transition-all"
          >
            Cancel
          </Button>
          <Button
            disabled={isUploading}
            onClick={() => {
              if (activeMode === "custom") {
                saveCustomAvatar();
              } else if (selectedAvatar !== profile?.profilePicture) {
                goeyToast.success("New avatar selected!");
                router.back();
              } else {
                router.back();
              }
            }}
            className="flex-1 h-14 rounded-[22px] bg-[#B066FF] hover:bg-[#9333EA] text-white font-bold text-base shadow-xl shadow-purple-100 dark:shadow-none transition-all hover:scale-[1.05] active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              Save Profile Picture
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
