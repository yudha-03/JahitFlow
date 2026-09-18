"use client";

import React from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

export interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenMenu: () => void;
  children?: React.ReactNode;
}

export default function Header({
  title,
  subtitle,
  onOpenMenu,
  children,
}: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-8 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4"
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMenu}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden focus:outline-none shrink-0"
          aria-label="Buka Menu Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="min-w-0">
          <h1 className="text-base sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 font-medium hidden sm:block truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {children && (
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {children}
        </div>
      )}
    </motion.header>
  );
}
