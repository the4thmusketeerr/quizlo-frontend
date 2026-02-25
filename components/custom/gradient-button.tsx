import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export const GradientButton = React.forwardRef<
  HTMLButtonElement,
  GradientButtonProps
>(
  (
    { className, variant = "primary", size = "md", asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <Comp
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center font-semibold transition-smooth",
          "rounded-lg overflow-hidden group",
          sizeClasses[size],
          variant === "primary" &&
            "bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:shadow-lg hover:shadow-primary/50 hover:scale-105",
          variant === "secondary" &&
            "bg-gradient-to-r from-accent to-primary text-accent-foreground hover:shadow-lg hover:shadow-accent/50 hover:scale-105",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none",
          className,
        )}
        {...props}
      />
    );
  },
);

GradientButton.displayName = "GradientButton";
