import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-white/25 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:shadow-[0_0_0_3px_rgba(200,255,62,0.08)] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150 ease-out font-body",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
