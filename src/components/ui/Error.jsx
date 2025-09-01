import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry, type = "default" }) => {
  const getErrorIcon = () => {
    if (type === "upload") return "CloudOff";
    if (type === "network") return "WifiOff";
    if (type === "file") return "FileX";
    return "AlertTriangle";
  };

  const getErrorTitle = () => {
    if (type === "upload") return "Upload Failed";
    if (type === "network") return "Connection Error";
    if (type === "file") return "File Error";
    return "Error";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center space-y-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center"
      >
        <ApperIcon name={getErrorIcon()} size={32} className="text-error" />
      </motion.div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-200">{getErrorTitle()}</h3>
        <p className="text-slate-400 max-w-md">{message}</p>
      </div>
      
      {onRetry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button onClick={onRetry} variant="outline" size="sm">
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Try Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Error;