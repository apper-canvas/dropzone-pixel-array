export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileTypeIcon = (type) => {
  if (type.startsWith("image/")) return "Image";
  if (type.startsWith("video/")) return "Video";
  if (type.startsWith("audio/")) return "Music";
  if (type === "application/pdf") return "FileText";
  if (type.includes("document") || type.includes("word")) return "FileText";
  if (type.includes("spreadsheet") || type.includes("excel")) return "FileSpreadsheet";
  if (type.includes("presentation") || type.includes("powerpoint")) return "FilePresentation";
  if (type.includes("zip") || type.includes("archive")) return "Archive";
  return "File";
};

export const isImageFile = (type) => {
  return type.startsWith("image/");
};

export const getFileExtension = (filename) => {
  return filename.split(".").pop()?.toLowerCase() || "";
};

export const isValidFileType = (file, acceptedTypes = []) => {
  if (acceptedTypes.length === 0) return true;
  return acceptedTypes.some(type => {
    if (type === "*/*") return true;
    if (type.endsWith("/*")) {
      const category = type.split("/")[0];
      return file.type.startsWith(category + "/");
    }
    return file.type === type;
  });
};

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const CHUNK_SIZE = 1024 * 1024; // 1MB chunks

export const ACCEPTED_FILE_TYPES = [
  "image/*",
  "video/*",
  "audio/*",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "application/zip",
  "application/x-zip-compressed"
];

export const formatUploadTime = (startTime, currentTime) => {
  const elapsed = (currentTime - startTime) / 1000; // seconds
  if (elapsed < 60) return `${Math.floor(elapsed)}s`;
  if (elapsed < 3600) return `${Math.floor(elapsed / 60)}m ${Math.floor(elapsed % 60)}s`;
  return `${Math.floor(elapsed / 3600)}h ${Math.floor((elapsed % 3600) / 60)}m`;
};

export const estimateTimeRemaining = (uploadedSize, totalSize, startTime) => {
  const elapsed = (Date.now() - startTime) / 1000; // seconds
  const bytesPerSecond = uploadedSize / elapsed;
  const remainingBytes = totalSize - uploadedSize;
  const remainingSeconds = remainingBytes / bytesPerSecond;
  
  if (remainingSeconds < 60) return `${Math.floor(remainingSeconds)}s remaining`;
  if (remainingSeconds < 3600) return `${Math.floor(remainingSeconds / 60)}m remaining`;
  return `${Math.floor(remainingSeconds / 3600)}h remaining`;
};