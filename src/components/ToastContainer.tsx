import React, { useEffect, useState } from "react";
import { toast } from "../lib/toast";
import { CheckCircle, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ToastInstance {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastInstance[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((message, type) => {
      const newToast: ToastInstance = {
        id: Math.random().toString(36).substring(2, 9),
        message,
        type
      };
      
      setToasts((prev) => [...prev, newToast]);

      // Auto-remove after 4.5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 4500);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />;
      case "error":
        return <XCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-emerald-200 bg-emerald-50/95 shadow-emerald-100/50";
      case "error":
        return "border-rose-200 bg-rose-50/95 shadow-rose-100/50";
      case "warning":
        return "border-amber-200 bg-amber-50/95 shadow-amber-100/50";
      default:
        return "border-blue-200 bg-blue-50/95 shadow-blue-100/50";
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none select-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }}
            className={`pointer-events-auto p-4 rounded-xl border flex items-start gap-3 shadow-lg ${getBorderColor(
              t.type
            )} transition-colors backdrop-blur-xs`}
          >
            {getIcon(t.type)}
            <div className="flex-1 text-xs font-semibold text-slate-800 leading-snug">
              {t.message}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
