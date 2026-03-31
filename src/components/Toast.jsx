import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToastStore } from '../store/useToastStore';

const Toast = () => {
  const { toasts, removeToast } = useToastStore();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-500" />;
      case 'info':
      default:
        return <Info size={20} className="text-blue-500" />;
    }
  };

  const getColors = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/30 text-green-200';
      case 'error':
        return 'bg-red-500/10 border-red-500/30 text-red-200';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-200';
      case 'info':
      default:
        return 'bg-blue-500/10 border-blue-500/30 text-blue-200';
    }
  };

  return (
    <div className="fixed top-24 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            transition={{ duration: 0.3 }}
            className={`${getColors(toast.type)} border rounded-xl p-4 mb-3 flex items-center gap-3 backdrop-blur-md max-w-sm pointer-events-auto shadow-lg`}
          >
            {getIcon(toast.type)}
            <span className="flex-1 font-medium text-sm">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
