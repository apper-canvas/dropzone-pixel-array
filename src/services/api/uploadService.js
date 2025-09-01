import uploadsData from "@/services/mockData/uploads.json";

let uploads = [...uploadsData];
let uploadId = Math.max(...uploads.map(u => u.Id)) + 1;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const uploadService = {
  getAll: async () => {
    await delay(300);
    return [...uploads];
  },

  getById: async (id) => {
    await delay(200);
    const upload = uploads.find(u => u.Id === parseInt(id));
    if (!upload) {
      throw new Error("Upload not found");
    }
    return { ...upload };
  },

  create: async (uploadData) => {
    await delay(400);
    const newUpload = {
      Id: uploadId++,
      name: uploadData.name,
      size: uploadData.size,
      type: uploadData.type,
      status: "uploading",
      progress: 0,
      uploadedAt: new Date().toISOString(),
      url: ""
    };
    uploads.unshift(newUpload);
    return { ...newUpload };
  },

  update: async (id, updateData) => {
    await delay(200);
    const index = uploads.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Upload not found");
    }
    uploads[index] = { ...uploads[index], ...updateData };
    return { ...uploads[index] };
  },

  delete: async (id) => {
    await delay(300);
    const index = uploads.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Upload not found");
    }
    uploads.splice(index, 1);
    return true;
  },

  // Simulate upload progress
  simulateUpload: async (id, onProgress) => {
    const upload = uploads.find(u => u.Id === parseInt(id));
    if (!upload) {
      throw new Error("Upload not found");
    }

    const totalSteps = 100;
    const baseDelay = 50; // Base delay per step
    const sizeMultiplier = Math.max(1, upload.size / (10 * 1024 * 1024)); // Slower for larger files

    for (let progress = 0; progress <= 100; progress += Math.random() * 5 + 1) {
      progress = Math.min(100, progress);
      
      const currentDelay = baseDelay * sizeMultiplier * (1 + Math.random() * 0.5);
      await delay(currentDelay);
      
      // Update upload progress
      const index = uploads.findIndex(u => u.Id === parseInt(id));
      if (index !== -1) {
        uploads[index].progress = Math.round(progress);
        if (progress >= 100) {
          uploads[index].status = "completed";
          uploads[index].url = `https://example.com/uploads/${upload.name}`;
        }
        onProgress?.(uploads[index]);
      }
    }

    return uploads.find(u => u.Id === parseInt(id));
  },

  cancel: async (id) => {
    await delay(200);
    const index = uploads.findIndex(u => u.Id === parseInt(id));
    if (index !== -1) {
      uploads[index].status = "cancelled";
      uploads[index].progress = 0;
      return { ...uploads[index] };
    }
    throw new Error("Upload not found");
  },

  pause: async (id) => {
    await delay(200);
    const index = uploads.findIndex(u => u.Id === parseInt(id));
    if (index !== -1) {
      uploads[index].status = "paused";
      return { ...uploads[index] };
    }
    throw new Error("Upload not found");
  },

  resume: async (id) => {
    await delay(200);
    const index = uploads.findIndex(u => u.Id === parseInt(id));
    if (index !== -1) {
      uploads[index].status = "uploading";
      return { ...uploads[index] };
    }
    throw new Error("Upload not found");
  },

  getRecentUploads: async (hours = 24) => {
    await delay(250);
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return uploads
      .filter(upload => new Date(upload.uploadedAt) > cutoff)
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
      .slice(0, 10);
  },

  getUploadStats: async () => {
    await delay(200);
    const completedUploads = uploads.filter(u => u.status === "completed");
    const totalSize = completedUploads.reduce((sum, u) => sum + u.size, 0);
    
    return {
      totalUploads: completedUploads.length,
      totalSize,
      averageSize: completedUploads.length > 0 ? totalSize / completedUploads.length : 0,
      recentUploads: completedUploads.length,
      successRate: uploads.length > 0 ? (completedUploads.length / uploads.length) * 100 : 100
    };
  }
};