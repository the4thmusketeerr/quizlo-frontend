import { AppNavbar } from "@/components/shared/navbar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      {children}
    </div>
  );
}
