import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { formatFileSize } from "@/utils/fileUtils";
import Card from "@/components/atoms/Card";

const UploadStats = ({ stats }) => {
  const statItems = [
    {
      icon: "Upload",
      label: "Total Uploads",
      value: stats.totalUploads || 0,
      color: "text-primary"
    },
    {
      icon: "HardDrive",
      label: "Total Size",
      value: formatFileSize(stats.totalSize || 0),
      color: "text-secondary"
    },
    {
      icon: "TrendingUp",
      label: "Success Rate",
      value: `${Math.round(stats.successRate || 100)}%`,
      color: "text-success"
    },
    {
      icon: "Clock",
      label: "Recent Files",
      value: stats.recentUploads || 0,
      color: "text-accent"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-4 text-center space-y-3">
            <div className={`w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center mx-auto ${item.color}`}>
              <ApperIcon name={item.icon} size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold font-display text-slate-200">
                {item.value}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {item.label}
              </p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default UploadStats;