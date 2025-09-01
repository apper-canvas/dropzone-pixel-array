import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className, 
  hoverable = false,
  gradient = false,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-surface rounded-xl border border-slate-700/50 shadow-lg",
        gradient && "bg-gradient-to-br from-surface to-slate-800/80",
        hoverable && "transition-all duration-200 hover:shadow-xl hover:shadow-primary/5 hover:border-slate-600 card-glow",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;