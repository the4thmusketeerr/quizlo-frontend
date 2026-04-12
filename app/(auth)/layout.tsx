import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fafafa] px-4 py-12 dark:bg-[#09090b]">
      {/* Back button in top-left corner */}
      <Link
        href="/"
        className="absolute left-6 top-6 z-20 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-smooth hover:text-[#A855F7] sm:left-10 sm:top-10"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-purple-400/30 blur-3xl animate-float" />
        <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-purple-600/30 blur-3xl animate-float animation-delay-2000" />
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[120px]" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 z-0 opacity-10 [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm dark:bg-zinc-900/95 sm:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}

