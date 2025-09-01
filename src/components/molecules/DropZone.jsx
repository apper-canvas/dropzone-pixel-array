import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { 
  isValidFileType, 
  MAX_FILE_SIZE, 
  ACCEPTED_FILE_TYPES,
  formatFileSize 
} from "@/utils/fileUtils";

const DropZone = ({ onFilesSelected, disabled = false, multiple = true }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set drag over to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  const handleFiles = (files) => {
    const validFiles = [];
    const errors = [];

    files.forEach(file => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File size exceeds ${formatFileSize(MAX_FILE_SIZE)}`);
        return;
      }

      // Check file type
      if (!isValidFileType(file, ACCEPTED_FILE_TYPES)) {
        errors.push(`${file.name}: File type not supported`);
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }

    // Show errors if any
    errors.forEach(error => {
      console.warn(error);
    });
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <motion.div
      className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
        disabled 
          ? "border-slate-700 bg-slate-800/30 cursor-not-allowed"
          : isDragOver 
            ? "drag-over" 
            : "border-slate-600 hover:border-primary/50 hover:bg-primary/5"
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={openFileDialog}
      whileHover={!disabled ? { scale: 1.01 } : {}}
      whileTap={!disabled ? { scale: 0.99 } : {}}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={ACCEPTED_FILE_TYPES.join(",")}
        onChange={handleFileSelect}
        className="file-input-hidden"
        disabled={disabled}
      />

      <motion.div
        animate={isDragOver ? { scale: 1.1 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        {/* Upload Icon */}
        <motion.div
          animate={isDragOver ? { y: -10 } : { y: 0 }}
          transition={{ duration: 0.2 }}
          className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center"
        >
          <ApperIcon 
            name={isDragOver ? "Download" : "CloudUpload"} 
            size={40} 
            className="text-white"
          />
        </motion.div>

        {/* Title and Description */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold font-display text-slate-200">
            {isDragOver ? "Drop files here" : "Upload your files"}
          </h3>
          <p className="text-slate-400 max-w-md mx-auto">
            {isDragOver 
              ? "Release to upload your files" 
              : "Drag and drop files here, or click to browse and select files from your computer"
            }
          </p>
        </div>

        {/* Browse Button */}
        {!isDragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Button size="lg" disabled={disabled}>
              <ApperIcon name="FolderOpen" size={18} className="mr-2" />
              Browse Files
            </Button>
          </motion.div>
        )}

        {/* File Info */}
        <motion.div
          className="pt-4 border-t border-slate-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-xs text-slate-500 mb-2">
            Supported formats: Images, Videos, Documents, PDFs, Archives
          </p>
          <p className="text-xs text-slate-500">
            Maximum file size: {formatFileSize(MAX_FILE_SIZE)}
          </p>
        </motion.div>
      </motion.div>

      {/* Drag Overlay Effect */}
      {isDragOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border-2 border-primary pointer-events-none"
        />
      )}
    </motion.div>
  );
};

export default DropZone;