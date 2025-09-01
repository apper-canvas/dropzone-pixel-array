import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { formatFileSize, isImageFile } from "@/utils/fileUtils";

const FilePreviewModal = ({ file, isOpen, onClose }) => {
  if (!file) return null;

  const createPreviewUrl = (file) => {
    if (file.url) return file.url;
    return URL.createObjectURL(file);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-surface rounded-2xl border border-slate-600 shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Eye" size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-200 truncate max-w-sm">
{file.Name || file.name}
                  </h3>
                  <p className="text-sm text-slate-400">
{formatFileSize(file.size_c || file.size)} • {file.type_c || file.type}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              {isImageFile(file.type) ? (
                <div className="flex justify-center">
                  <motion.img
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
src={createPreviewUrl(file)}
                    alt={file.Name || file.name}
                    className="max-w-full max-h-[60vh] object-contain rounded-xl"
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <ApperIcon name="File" size={40} className="text-slate-300" />
                  </div>
                  <h4 className="text-lg font-medium text-slate-300 mb-2">
                    Preview not available
                  </h4>
                  <p className="text-slate-500">
                    This file type cannot be previewed in the browser
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-700 bg-slate-800/50">
{(file.url_c || file.url) && (
                <Button variant="outline" size="sm" asChild>
                  <a href={file.url_c || file.url} download={file.Name || file.name}>
                    <ApperIcon name="Download" size={16} className="mr-2" />
                    Download
                  </a>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FilePreviewModal;