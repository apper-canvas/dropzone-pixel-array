import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { formatFileSize, getFileTypeIcon, isImageFile } from "@/utils/fileUtils";
import Card from "@/components/atoms/Card";

const FilePreview = ({ file, onRemove }) => {
  const createPreviewUrl = (file) => {
    return URL.createObjectURL(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative group"
    >
      <Card className="p-4 hover:border-primary/30 transition-all duration-200">
        <div className="flex items-start space-x-3">
          {/* File Icon/Thumbnail */}
          <div className="flex-shrink-0">
            {isImageFile(file.type) ? (
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-700">
                <img
                  src={createPreviewUrl(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="w-full h-full bg-slate-700 flex items-center justify-center" style={{ display: "none" }}>
                  <ApperIcon name={getFileTypeIcon(file.type)} size={24} className="text-slate-400" />
                </div>
              </div>
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                <ApperIcon name={getFileTypeIcon(file.type)} size={24} className="text-primary" />
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-slate-200 truncate">
              {file.name}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {formatFileSize(file.size)} • {file.type}
            </p>
          </div>

          {/* Remove Button */}
          {onRemove && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onRemove(file)}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 hover:bg-error/20 hover:text-error text-slate-400 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <ApperIcon name="X" size={14} />
            </motion.button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default FilePreview;