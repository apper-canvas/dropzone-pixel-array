import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  className, 
  showValue = false,
  size = "md",
  variant = "primary",
  animated = true
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3"
  };
  
  const variants = {
    primary: "from-primary to-secondary",
    success: "from-success to-emerald-400",
    error: "from-error to-red-500",
    warning: "from-warning to-orange-400"
  };
  
  return (
    <div className={cn("space-y-1", className)}>
      {showValue && (
        <div className="flex justify-between text-xs text-slate-400">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn("bg-slate-700 rounded-full overflow-hidden", sizes[size])}>
        <motion.div
          className={cn(
            "h-full bg-gradient-to-r rounded-full",
            variants[variant],
            animated && percentage > 0 && percentage < 100 && "progress-pulse"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;