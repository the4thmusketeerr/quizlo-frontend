import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

interface OutlineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export const OutlineButton = React.forwardRef<
  HTMLButtonElement,
  OutlineButtonProps
>(({ className, size = "md", asChild = false, ...props }, ref) => {
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
        "inline-flex items-center justify-center font-semibold transition-smooth",
        "rounded-lg border-2 border-primary bg-transparent text-primary",
        "hover:bg-primary/10 hover:border-accent hover:text-accent",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-primary disabled:hover:text-primary",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {props.children}
    </Comp>
  );
});

OutlineButton.displayName = "OutlineButton";
