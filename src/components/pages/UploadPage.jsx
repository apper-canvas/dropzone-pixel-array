import React from "react";
import { motion } from "framer-motion";
import UploadManager from "@/components/organisms/UploadManager";

const UploadPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-8 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold font-display gradient-text mb-4"
        >
          Upload & Manage Files
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-slate-400 max-w-2xl mx-auto"
        >
          Effortlessly upload, track, and manage your files with real-time progress monitoring 
          and beautiful previews. Drag and drop or browse to get started.
        </motion.p>
      </div>

      <UploadManager />
    </motion.div>
  );
};

export default UploadPage;