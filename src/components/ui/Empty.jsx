import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No files uploaded yet", 
  description = "Upload your first file to get started",
  action,
  actionLabel = "Upload Files",
  icon = "Upload",
  type = "default" 
}) => {
  const getEmptyIcon = () => {
    if (type === "upload") return "CloudUpload";
    if (type === "files") return "FolderOpen";
    if (type === "search") return "Search";
    return icon;
  };

  const getEmptyTitle = () => {
    if (type === "upload") return "Ready to upload";
    if (type === "files") return "No files found";
    if (type === "search") return "No results found";
    return title;
  };

  const getEmptyDescription = () => {
    if (type === "upload") return "Drag and drop files here or click to browse";
    if (type === "files") return "Your uploaded files will appear here";
    if (type === "search") return "Try adjusting your search terms";
    return description;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center opacity-80"
      >
        <ApperIcon name={getEmptyIcon()} size={40} className="text-white" />
      </motion.div>
      
      <div className="space-y-3 max-w-md">
        <h3 className="text-xl font-semibold font-display text-slate-200">
          {getEmptyTitle()}
        </h3>
        <p className="text-slate-400 leading-relaxed">
          {getEmptyDescription()}
        </p>
      </div>
      
      {action && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button onClick={action} size="lg" className="mt-2">
            <ApperIcon name="Plus" size={18} className="mr-2" />
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Empty;