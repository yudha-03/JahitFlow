"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scissors,
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  X,
  LogOut,
} from "lucide-react";

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const navigationMenu = [
  {
    group: "MENU UTAMA",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Pesanan", href: "/orders", icon: Scissors },
      { name: "Pelanggan", href: "/customers", icon: Users },
    ],
  },
  {
    group: "KEUANGAN",
    items: [
      { name: "Pembayaran", href: "/payments", icon: CreditCard },
      { name: "Laporan", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    group: "NAVIGASI",
    items: [
      { name: "Pengaturan", href: "/settings", icon: Settings },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Aside (Atelier Modern Workspace - Ukuran Standar Presisi) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-stone-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-atelier ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo & Brand Header */}
          <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-indigo-700 text-white rounded-2xl flex items-center justify-center shadow-md shadow-indigo-700/20 group-hover:bg-indigo-800 transition">
                <Scissors size={20} className="transform -rotate-45" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">
                  Jahit<span className="text-indigo-700">Flow</span>
                </span>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mt-1">
                  Satria Tailor
                </span>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 lg:hidden rounded-lg hover:bg-stone-100"
              aria-label="Tutup menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-6">
            {navigationMenu.map((group, groupIdx) => (
              <div key={groupIdx}>
                <p className="px-3 text-[10px] font-extrabold text-slate-400 tracking-widest uppercase mb-2">
                  {group.group}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? "bg-indigo-700 text-white shadow-md shadow-indigo-700/20"
                            : "text-slate-600 hover:bg-stone-100/80 hover:text-slate-900"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? "text-white" : "text-slate-400"
                          }`}
                        />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User Profile Card & Logout */}
          <div className="p-4 border-t border-stone-100 bg-[#FAF9F6]">
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-xs shrink-0">
                  S
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                    Satria
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium truncate">
                    Pemilik Usaha
                  </p>
                </div>
              </div>
              <button
                type="button"
                title="Keluar"
                onClick={() => router.push("/login")}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
