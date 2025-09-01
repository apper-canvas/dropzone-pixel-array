import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  className, 
  disabled = false,
  isLoading = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-primary hover:shadow-lg hover:shadow-primary/25 text-white focus:ring-primary border border-primary/20",
    secondary: "bg-gradient-to-r from-secondary to-accent hover:shadow-lg hover:shadow-secondary/25 text-white focus:ring-secondary border border-secondary/20",
    outline: "border-2 border-slate-600 text-slate-300 hover:border-primary hover:text-primary hover:bg-primary/5 focus:ring-primary",
    ghost: "text-slate-300 hover:text-white hover:bg-slate-800 focus:ring-slate-500",
    danger: "bg-gradient-to-r from-error to-red-600 hover:shadow-lg hover:shadow-error/25 text-white focus:ring-error border border-error/20",
    success: "bg-gradient-to-r from-success to-emerald-600 hover:shadow-lg hover:shadow-success/25 text-white focus:ring-success border border-success/20"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-xl",
    xl: "px-8 py-4 text-lg rounded-2xl"
  };
  
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          Loading...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;