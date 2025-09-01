import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { uploadService } from "@/services/api/uploadService";

export const useUpload = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createUpload = useCallback(async (fileData) => {
    try {
      setError("");
      const upload = await uploadService.create(fileData);
      setUploads(prev => [upload, ...prev]);
      return upload;
    } catch (err) {
      setError("Failed to create upload");
      throw err;
    }
  }, []);

  const updateUpload = useCallback(async (id, data) => {
    try {
      const updated = await uploadService.update(id, data);
setUploads(prev => prev.map(u => u.Id === id ? updated : u));
      return updated;
    } catch (err) {
      setError("Failed to update upload");
      throw err;
    }
  }, []);

  const deleteUpload = useCallback(async (id) => {
    try {
      await uploadService.delete(id);
      setUploads(prev => prev.filter(u => u.Id !== id));
      toast.success("Upload removed");
    } catch (err) {
      setError("Failed to remove upload");
      toast.error("Failed to remove upload");
    }
  }, []);

  const simulateUpload = useCallback(async (id, onProgress) => {
    try {
      return await uploadService.simulateUpload(id, onProgress);
    } catch (err) {
      setError("Upload failed");
      throw err;
    }
  }, []);

  const pauseUpload = useCallback(async (id) => {
    try {
const paused = await uploadService.pause(id);
      setUploads(prev => prev.map(u => u.Id === id ? paused : u));
      toast.info("Upload paused");
    } catch (err) {
      toast.error("Failed to pause upload");
    }
  }, []);

  const resumeUpload = useCallback(async (id) => {
    try {
      const resumed = await uploadService.resume(id);
setUploads(prev => prev.map(u => u.Id === id ? resumed : u));
      toast.info("Upload resumed");
    } catch (err) {
      toast.error("Failed to resume upload");
    }
  }, []);

  const cancelUpload = useCallback(async (id) => {
    try {
      const cancelled = await uploadService.cancel(id);
setUploads(prev => prev.map(u => u.Id === id ? cancelled : u));
      toast.info("Upload cancelled");
    } catch (err) {
      toast.error("Failed to cancel upload");
    }
  }, []);

  const loadUploads = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await uploadService.getRecentUploads();
      setUploads(data);
    } catch (err) {
      setError("Failed to load uploads");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    uploads,
    loading,
    error,
    createUpload,
    updateUpload,
    deleteUpload,
    simulateUpload,
    pauseUpload,
    resumeUpload,
    cancelUpload,
    loadUploads,
    setUploads
  };
};