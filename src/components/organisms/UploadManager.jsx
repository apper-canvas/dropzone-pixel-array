import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import DropZone from "@/components/molecules/DropZone";
import UploadProgress from "@/components/molecules/UploadProgress";
import FilePreview from "@/components/molecules/FilePreview";
import FilePreviewModal from "@/components/molecules/FilePreviewModal";
import UploadStats from "@/components/molecules/UploadStats";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { uploadService } from "@/services/api/uploadService";

const UploadManager = () => {
  const [uploads, setUploads] = useState([]);
  const [queuedFiles, setQueuedFiles] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Load existing uploads and stats
  useEffect(() => {
    loadUploads();
    loadStats();
  }, []);

  const loadUploads = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await uploadService.getRecentUploads();
      setUploads(data);
    } catch (err) {
      setError("Failed to load uploads. Please try again.");
      console.error("Error loading uploads:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await uploadService.getUploadStats();
      setStats(statsData);
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  };

  const handleFilesSelected = useCallback((files) => {
    setQueuedFiles(prev => [...prev, ...files]);
  }, []);

  const handleRemoveQueuedFile = useCallback((fileToRemove) => {
    setQueuedFiles(prev => prev.filter(file => file !== fileToRemove));
  }, []);

  const handleStartUpload = useCallback(async () => {
    if (queuedFiles.length === 0) return;

    const newUploads = [];
    
    // Create upload records for each file
    for (const file of queuedFiles) {
      try {
        const upload = await uploadService.create({
          name: file.name,
          size: file.size,
          type: file.type
        });
        newUploads.push(upload);
      } catch (err) {
        toast.error(`Failed to start upload for ${file.name}`);
      }
    }

    // Add to uploads list
    setUploads(prev => [...newUploads, ...prev]);
    setQueuedFiles([]);

    // Start simulation for each upload
    newUploads.forEach(upload => {
      uploadService.simulateUpload(upload.Id, (updatedUpload) => {
        setUploads(prev => prev.map(u => 
          u.Id === updatedUpload.Id ? updatedUpload : u
        ));
      }).then(() => {
        toast.success(`${upload.name} uploaded successfully!`);
        loadStats(); // Refresh stats after completion
      }).catch((err) => {
        toast.error(`Failed to upload ${upload.name}`);
        setUploads(prev => prev.map(u => 
          u.Id === upload.Id ? { ...u, status: "error" } : u
        ));
      });
    });

    toast.info(`Started uploading ${newUploads.length} file(s)`);
  }, [queuedFiles]);

  const handleCancelUpload = useCallback(async (uploadId) => {
    try {
      await uploadService.cancel(uploadId);
      setUploads(prev => prev.map(u => 
        u.Id === uploadId ? { ...u, status: "cancelled", progress: 0 } : u
      ));
      toast.info("Upload cancelled");
    } catch (err) {
      toast.error("Failed to cancel upload");
    }
  }, []);

  const handlePauseUpload = useCallback(async (uploadId) => {
    try {
      await uploadService.pause(uploadId);
      setUploads(prev => prev.map(u => 
        u.Id === uploadId ? { ...u, status: "paused" } : u
      ));
      toast.info("Upload paused");
    } catch (err) {
      toast.error("Failed to pause upload");
    }
  }, []);

  const handleResumeUpload = useCallback(async (uploadId) => {
    try {
      await uploadService.resume(uploadId);
      setUploads(prev => prev.map(u => 
        u.Id === uploadId ? { ...u, status: "uploading" } : u
      ));
      
      // Continue simulation
      uploadService.simulateUpload(uploadId, (updatedUpload) => {
        setUploads(prev => prev.map(u => 
          u.Id === updatedUpload.Id ? updatedUpload : u
        ));
      }).then(() => {
        const upload = uploads.find(u => u.Id === uploadId);
        if (upload) {
          toast.success(`${upload.name} uploaded successfully!`);
          loadStats();
        }
      }).catch(() => {
        setUploads(prev => prev.map(u => 
          u.Id === uploadId ? { ...u, status: "error" } : u
        ));
      });
      
      toast.info("Upload resumed");
    } catch (err) {
      toast.error("Failed to resume upload");
    }
  }, [uploads]);

  const handleRemoveUpload = useCallback(async (uploadId) => {
    try {
      await uploadService.delete(uploadId);
      setUploads(prev => prev.filter(u => u.Id !== uploadId));
      toast.success("Upload removed");
      loadStats();
    } catch (err) {
      toast.error("Failed to remove upload");
    }
  }, []);

  const handlePreviewFile = useCallback((upload) => {
    if (upload.url && upload.type.startsWith("image/")) {
      setPreviewFile(upload);
      setIsPreviewOpen(true);
    }
  }, []);

  const handleClearAll = useCallback(() => {
    const completedUploads = uploads.filter(u => u.status === "completed" || u.status === "error" || u.status === "cancelled");
    completedUploads.forEach(upload => {
      handleRemoveUpload(upload.Id);
    });
  }, [uploads, handleRemoveUpload]);

  if (loading) {
    return <Loading type="skeleton" message="Loading uploads..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadUploads} type="upload" />;
  }

  const activeUploads = uploads.filter(u => u.status === "uploading" || u.status === "paused");
  const completedUploads = uploads.filter(u => u.status === "completed");
  const hasUploads = uploads.length > 0;

  return (
    <div className="space-y-8">
      {/* Stats */}
      {hasUploads && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <UploadStats stats={stats} />
        </motion.div>
      )}

      {/* Drop Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DropZone onFilesSelected={handleFilesSelected} />
      </motion.div>

      {/* Queued Files */}
      <AnimatePresence>
        {queuedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold font-display text-slate-200">
                Ready to Upload ({queuedFiles.length})
              </h2>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQueuedFiles([])}
                >
                  <ApperIcon name="X" size={16} className="mr-2" />
                  Clear All
                </Button>
                <Button onClick={handleStartUpload}>
                  <ApperIcon name="Upload" size={16} className="mr-2" />
                  Upload {queuedFiles.length} File{queuedFiles.length !== 1 ? "s" : ""}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {queuedFiles.map((file, index) => (
                  <FilePreview
                    key={`${file.name}-${index}`}
                    file={file}
                    onRemove={handleRemoveQueuedFile}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Uploads */}
      <AnimatePresence>
        {activeUploads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold font-display text-slate-200">
              Uploading ({activeUploads.length})
            </h2>
            <div className="space-y-3">
              <AnimatePresence>
                {activeUploads.map((upload) => (
                  <UploadProgress
                    key={upload.Id}
                    upload={upload}
                    onCancel={handleCancelUpload}
                    onPause={handlePauseUpload}
                    onResume={handleResumeUpload}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload History */}
      {completedUploads.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold font-display text-slate-200">
              Recent Uploads ({completedUploads.length})
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
            >
              <ApperIcon name="Trash2" size={16} className="mr-2" />
              Clear History
            </Button>
          </div>
          
          <div className="space-y-3">
            <AnimatePresence>
              {completedUploads.map((upload) => (
                <motion.div
                  key={upload.Id}
                  className="cursor-pointer"
                  onClick={() => handlePreviewFile(upload)}
                >
                  <UploadProgress
                    upload={upload}
                    onRemove={handleRemoveUpload}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!hasUploads && queuedFiles.length === 0 && (
        <Empty
          type="upload"
          action={() => document.querySelector("input[type='file']")?.click()}
        />
      )}

      {/* File Preview Modal */}
      <FilePreviewModal
        file={previewFile}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewFile(null);
        }}
      />
    </div>
  );
};

export default UploadManager;