import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { formatFileSize, getFileTypeIcon } from "@/utils/fileUtils";
import ProgressBar from "@/components/atoms/ProgressBar";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const UploadProgress = ({ upload, onCancel, onPause, onResume, onRemove }) => {
  const getStatusIcon = () => {
    switch (upload.status) {
      case "uploading":
        return "Upload";
      case "completed":
        return "CheckCircle";
      case "error":
        return "XCircle";
      case "paused":
        return "Pause";
      case "cancelled":
        return "X";
      default:
        return "File";
    }
  };

  const getStatusColor = () => {
    switch (upload.status) {
      case "uploading":
        return "text-primary";
      case "completed":
        return "text-success";
      case "error":
        return "text-error";
      case "paused":
        return "text-warning";
      case "cancelled":
        return "text-slate-500";
      default:
        return "text-slate-400";
    }
  };

  const getProgressVariant = () => {
    switch (upload.status) {
      case "completed":
        return "success";
      case "error":
        return "error";
      case "paused":
        return "warning";
      default:
        return "primary";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      <Card className="p-4" hoverable={upload.status === "completed"}>
        <div className="flex items-center space-x-4">
          {/* File Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center">
              <ApperIcon name={getFileTypeIcon(upload.type)} size={24} className="text-slate-300" />
            </div>
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-200 truncate">
                {upload.name}
              </h3>
              <div className="flex items-center space-x-2">
                <ApperIcon 
                  name={getStatusIcon()} 
                  size={16} 
                  className={getStatusColor()} 
                />
                <span className="text-xs text-slate-400">
                  {upload.progress}%
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <ProgressBar
                value={upload.progress}
                variant={getProgressVariant()}
                animated={upload.status === "uploading"}
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>{formatFileSize(upload.size)}</span>
                <span className="capitalize">{upload.status}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex-shrink-0 flex items-center space-x-1">
            {upload.status === "uploading" && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onPause?.(upload.Id)}
                  className="h-8 w-8 p-0"
                >
                  <ApperIcon name="Pause" size={14} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onCancel?.(upload.Id)}
                  className="h-8 w-8 p-0 text-error hover:text-error"
                >
                  <ApperIcon name="X" size={14} />
                </Button>
              </>
            )}

            {upload.status === "paused" && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onResume?.(upload.Id)}
                  className="h-8 w-8 p-0 text-success hover:text-success"
                >
                  <ApperIcon name="Play" size={14} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onCancel?.(upload.Id)}
                  className="h-8 w-8 p-0 text-error hover:text-error"
                >
                  <ApperIcon name="X" size={14} />
                </Button>
              </>
            )}

            {upload.status === "completed" && onRemove && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onRemove(upload.Id)}
                className="h-8 w-8 p-0 text-slate-400 hover:text-error"
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            )}

            {(upload.status === "error" || upload.status === "cancelled") && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onRemove?.(upload.Id)}
                className="h-8 w-8 p-0 text-slate-400 hover:text-error"
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default UploadProgress;