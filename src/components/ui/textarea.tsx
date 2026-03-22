import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-foreground ring-offset-background placeholder:text-white/25 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:shadow-[0_0_0_3px_rgba(200,255,62,0.08)] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150 ease-out font-body",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
