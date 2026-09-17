"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export interface ToastProps {
  message: string | null;
  type?: "success" | "error" | "info";
  onClose?: () => void;
}

export default function Toast({ message, type = "success" }: ToastProps) {
  const getStyle = () => {
    switch (type) {
      case "error":
        return {
          bg: "bg-red-800 border-red-700 text-white",
          icon: <AlertCircle className="w-5 h-5 text-red-300" />,
        };
      case "info":
        return {
          bg: "bg-blue-800 border-blue-700 text-white",
          icon: <Info className="w-5 h-5 text-blue-300" />,
        };
      case "success":
      default:
        return {
          bg: "bg-emerald-800 border-emerald-700 text-white",
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-300" />,
        };
    }
  };

  const current = getStyle();

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-3 right-3 sm:top-5 sm:right-5 z-50 max-w-[calc(100vw-1.5rem)] px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-semibold text-sm border ${current.bg}`}
        >
          {current.icon}
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
