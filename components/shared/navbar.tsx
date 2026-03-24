"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Bell,
  Search,
  LayoutDashboard,
  Settings,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { logout } from "@/lib/auth";
import { getProfile, getLevelLabel } from "@/lib/user";
import { useAppStore } from "@/store/useAppStore";
import { goeyToast } from "@/components/ui/goey-toaster";

export function AppNavbar() {
  const router = useRouter();
  const { profile: storeProfile, setProfile: setStoreProfile, clearAllData } = useAppStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const profileData = {
    firstName: storeProfile?.firstName || "User",
    lastName: storeProfile?.lastName || "User",
    username: storeProfile?.username || "user",
    email: storeProfile?.email || "user@example.com",
    avatar: storeProfile?.profilePicture || "",
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await getProfile();
        if (response.success && response.data) {
          setStoreProfile(response.data);

          // Daily login XP bonus toast
          if (response.dailyLoginXP && response.dailyLoginXP > 0) {
            goeyToast(`🎉 Daily Login Bonus! +${response.dailyLoginXP} XP`, {
              duration: 3000,
            });
          }
        }
      } catch (error) {
        console.log("Error fetching profile: ", error);
      }
    }

    fetchProfile();
  }, [setStoreProfile]);

  const handleLogout = async () => {
    await logout();
    clearAllData();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo.png"
            alt="Quizlo Logo"
            width={106}
            height={106}
            className="rounded-lg object-contain"
          />
        </Link>

        {/* Search — hidden on small mobile */}
        <div className="hidden flex-1 max-w-sm mx-6 sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search quizzes..."
              className="pl-9 bg-muted/40 border-border/50 h-9 text-sm focus-visible:ring-primary/30"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Mobile search icon */}
          <button className="rounded-full p-2 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-smooth sm:hidden">
            <Search className="h-5 w-5" />
          </button>

          {/* Bell */}
          <button className="relative rounded-full p-2 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-smooth">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-1.5 rounded-full pl-1 pr-2 py-1 hover:bg-muted/60 transition-smooth"
              aria-label="Profile menu"
            >
              {/* Avatar */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white text-sm font-bold select-none overflow-hidden">
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <span>
                    {profileData.firstName.charAt(0).toUpperCase() +
                      profileData.lastName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <ChevronDown
                className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <>
                {/* Overlay to close */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 z-50 mt-2 w-52 rounded-2xl border border-border/50 bg-popover shadow-xl ring-1 ring-black/5 overflow-hidden">
                  {/* User info header */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-muted/30">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white text-sm font-bold overflow-hidden">
                      {profileData.avatar ? (
                        <img
                          src={profileData.avatar}
                          alt="Profile"
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <span className="select-none">
                          {profileData.firstName.charAt(0).toUpperCase() +
                            profileData.lastName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {profileData.username}
                      </p>
                      {/* <p className="text-xs text-muted-foreground truncate">
                        {storeProfile?.level ? (
                          <span className="ml-1 text-purple-500 font-bold">
                            {getLevelLabel(storeProfile.level)}
                          </span>
                        ) : null}
                      </p> */}
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="p-1.5 space-y-0.5">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-smooth"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-smooth"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </div>

                  <div className="p-1.5 border-t border-border/50">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-smooth"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
