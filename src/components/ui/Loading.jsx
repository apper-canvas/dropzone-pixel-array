import React from "react";
import { motion } from "framer-motion";

const Loading = ({ type = "default", message = "Loading..." }) => {
  if (type === "upload") {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-6">
        <motion.div
          className="relative w-16 h-16"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 border-4 border-surface border-t-primary rounded-full"></div>
          <div className="absolute inset-2 w-12 h-12 border-4 border-surface border-t-secondary rounded-full animate-spin"></div>
        </motion.div>
        <div className="text-center">
          <p className="text-lg font-medium text-slate-300">{message}</p>
          <p className="text-sm text-slate-500 mt-1">Please wait while we process your files</p>
        </div>
      </div>
    );
  }

  if (type === "skeleton") {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-surface rounded-xl p-6 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-slate-600 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-600 rounded w-3/4"></div>
                <div className="h-3 bg-slate-700 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-8 bg-slate-600 rounded"></div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-slate-700 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <motion.div
        className="w-8 h-8 border-4 border-surface border-t-primary rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="text-slate-400">{message}</p>
    </div>
  );
};

export default Loading;