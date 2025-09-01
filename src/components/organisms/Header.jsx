import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useSelector } from 'react-redux';
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { AuthContext } from "@/App";
const Header = () => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface/80 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-40"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <ApperIcon name="CloudUpload" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display gradient-text">
                DropZone
              </h1>
              <p className="text-xs text-slate-500">
                File Upload Manager
              </p>
            </div>
          </motion.div>

{/* Navigation */}
          <nav className="flex items-center space-x-6">
            <motion.div 
              className="flex items-center space-x-1 text-slate-300"
              whileHover={{ scale: 1.05 }}
            >
              <ApperIcon name="Upload" size={16} />
              <span className="text-sm font-medium">Upload</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <ApperIcon name="History" size={16} />
              <span className="text-sm font-medium">History</span>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <ApperIcon name="Settings" size={16} />
              <span className="text-sm font-medium">Settings</span>
            </motion.div>

            {isAuthenticated && (
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-slate-700">
                <span className="text-sm text-slate-400">
                  {user?.firstName || user?.emailAddress || 'User'}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout}
                  className="text-slate-300 hover:text-white"
                >
                  <ApperIcon name="LogOut" size={16} className="mr-1" />
                  Logout
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;