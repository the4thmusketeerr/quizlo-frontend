"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  ShieldCheck, 
  Smartphone, 
  Key, 
  History,
  Globe,
  Lock,
  Loader2,
  AlertTriangle
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

export default function AccountSecurityPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Two-Factor Authentication
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [authenticatorApp, setAuthenticatorApp] = useState(false);
  const [smsRecovery, setSmsRecovery] = useState(false);

  // Login Options
  const [biometricLogin, setBiometricLogin] = useState(false);
  const [trustedDevicesOnly, setTrustedDevicesOnly] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    goeyToast.success("Security settings updated successfully!");
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
                Account Security
              </h1>
              <p className="text-sm font-medium text-muted-foreground">
                Manage your advanced security preferences and protect your account.
              </p>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Two-Factor Authentication */}
          <SettingCard 
            title="Two-Factor Authentication" 
            icon={<ShieldCheck size={20} />} 
            iconBg="bg-green-50 dark:bg-green-900/20"
            iconColor="text-green-500"
            footer={
              <div className="bg-[#F3F4F6] dark:bg-secondary/50 rounded-2xl p-5 flex items-start gap-3">
                 <AlertTriangle className="text-amber-500 mt-0.5 shrink-0" size={16} />
                 <div>
                    <span className="text-[12px] font-bold text-[#374151] dark:text-foreground block">
                    Security Recommendation
                    </span>
                    <span className="text-[12px] font-medium text-muted-foreground mt-1 block leading-relaxed">
                    We highly recommend enabling 2FA to ensure your account remains secure even if your password is compromised.
                    </span>
                 </div>
              </div>
            }
          >
            <SettingItem 
              title="Enable 2FA"
              description="Require an extra security code when logging in from unrecognized devices."
              checked={twoFactorAuth}
              onCheckedChange={(val) => {
                  setTwoFactorAuth(val);
                  if(!val) {
                      setAuthenticatorApp(false);
                      setSmsRecovery(false);
                  }
              }}
            />
            <SettingItem 
              title="Authenticator App"
              description="Use an app like Google Authenticator or Authy to generate security codes."
              checked={authenticatorApp}
              onCheckedChange={setAuthenticatorApp}
            />
             <SettingItem 
              title="SMS Recovery"
              description="Receive back-up codes via SMS if you lose access to your authenticator app."
              checked={smsRecovery}
              onCheckedChange={setSmsRecovery}
            />
          </SettingCard>

          {/* Device Management */}
          <div className="space-y-6 sm:space-y-8 flex flex-col">
            <SettingCard 
                title="Login Options" 
                icon={<Smartphone size={20} />} 
                iconBg="bg-blue-50 dark:bg-blue-900/20"
                iconColor="text-blue-500"
            >
                <SettingItem 
                title="Biometric Login"
                description="Allow login using Face ID, Touch ID or Windows Hello on supported devices."
                checked={biometricLogin}
                onCheckedChange={setBiometricLogin}
                />
                <SettingItem 
                title="Trusted Devices Only"
                description="Require email verification for all unrecognized devices trying to access your account."
                checked={trustedDevicesOnly}
                onCheckedChange={setTrustedDevicesOnly}
                />
            </SettingCard>

             <SettingCard 
                title="Active Sessions" 
                icon={<History size={20} />} 
                iconBg="bg-purple-50 dark:bg-purple-900/20"
                iconColor="text-purple-500"
            >
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-secondary flex items-center justify-center">
                              <Globe size={18} className="text-slate-500" />
                          </div>
                           <div>
                              <p className="text-sm font-bold text-[#1F2937] dark:text-foreground">Windows • Chrome</p>
                              <p className="text-[12px] text-muted-foreground">Current Session • New York, US</p>
                           </div>
                      </div>
                      <span className="text-[11px] font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md uppercase tracking-wider">Active</span>
                  </div>

                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-secondary flex items-center justify-center">
                              <Smartphone size={18} className="text-slate-500" />
                          </div>
                           <div>
                              <p className="text-sm font-bold text-[#1F2937] dark:text-foreground">iPhone 14 Pro</p>
                              <p className="text-[12px] text-muted-foreground">Last active 2 days ago • London, UK</p>
                           </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                          Revoke
                      </Button>
                  </div>
               </div>
               
               <Button variant="outline" className="w-full mt-4 h-12 rounded-xl text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20">
                   Sign Out of All Devices
               </Button>
            </SettingCard>
          </div>

        </div>

        {/* Security Notice */}
        <div className="bg-[#EFF6FF] dark:bg-blue-900/10 border border-[#DBEAFE] dark:border-blue-900/20 p-6 rounded-[32px] flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white dark:bg-blue-900/20 flex items-center justify-center border border-[#DBEAFE] dark:border-blue-900/20">
            <Lock size={20} className="text-[#3B82F6]" />
          </div>
          <div>
             <h4 className="text-sm font-bold text-[#1E40AF] dark:text-blue-300">Account Recovery</h4>
            <p className="text-[13px] text-[#1E40AF]/80 dark:text-blue-300/80 font-medium max-w-2xl">
              Make sure you have downloaded your emergency backup codes. These can be used to access your account if you lose your 2FA device.
            </p>
          </div>
          <Button variant="outline" className="ml-auto shrink-0 border-[#3B82F6]/30 text-[#1E40AF] dark:text-blue-300 hover:bg-[#3B82F6]/10">
              Download Codes
          </Button>
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
