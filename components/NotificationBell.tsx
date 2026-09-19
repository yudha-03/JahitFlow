"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Bell,
  AlertTriangle,
  Clock,
  Scissors,
  CheckCircle2,
  X,
  ExternalLink,
  Phone,
  ChevronRight,
  CircleAlert
} from "lucide-react";
import { api } from "@/lib/api";

export interface OrderAlertItem {
  id?: string;
  code: string;
  customerName: string;
  phone?: string;
  itemName: string;
  dueDate: string;
  status: string;
  price?: number;
  paid?: number;
}

export interface NotificationBellProps {
  orders?: OrderAlertItem[];
  onOrderUpdated?: () => void;
  className?: string;
}

// Helper untuk menghitung urgensi deadline
function calculateUrgency(dueDateStr?: string) {
  if (!dueDateStr || dueDateStr === "Belum diatur") return null;

  const due = new Date(dueDateStr);
  if (isNaN(due.getTime())) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(due.getFullYear(), due.getMonth(), due.getDate());

  const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      severity: "overdue" as const,
      days: diffDays,
      label: `Lewat ${Math.abs(diffDays)} hari!`,
      color: "bg-rose-100 text-rose-800 border-rose-300",
      dotColor: "bg-rose-600",
    };
  }

  if (diffDays === 0) {
    return {
      severity: "today" as const,
      days: 0,
      label: "Jatuh Tempo Hari Ini!",
      color: "bg-rose-50 text-rose-700 border-rose-200",
      dotColor: "bg-rose-500",
    };
  }

  if (diffDays === 1) {
    return {
      severity: "tomorrow" as const,
      days: 1,
      label: "Target Besok!",
      color: "bg-amber-100 text-amber-900 border-amber-300",
      dotColor: "bg-amber-500",
    };
  }

  if (diffDays <= 3) {
    return {
      severity: "soon" as const,
      days: diffDays,
      label: `${diffDays} hari lagi`,
      color: "bg-amber-50 text-amber-800 border-amber-200",
      dotColor: "bg-amber-400",
    };
  }

  return null; // Lebih dari 3 hari, belum darurat
}

export default function NotificationBell({
  orders: propOrders,
  onOrderUpdated,
  className = "",
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalOrders, setInternalOrders] = useState<OrderAlertItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Jika tidak ada propOrders yang di-pass, fetch otomatis dari API
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await api.orders.getAll();
      setInternalOrders(data || []);
    } catch (err) {
      console.error("NotificationBell: Gagal memuat pesanan", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (propOrders) {
      setInternalOrders(propOrders);
    } else {
      fetchOrders();
    }
  }, [propOrders]);

  // Handle click outside untuk menutup popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Filter aturan:
  // 1. Status masih "Belum Dikerjakan" (belum tersentuh sama sekali)
  // 2. Deadline mendekati (H-3 s/d hari H atau sudah lewat)
  const urgentOrders = internalOrders
    .filter((order) => {
      if (order.status !== "Belum Dikerjakan") return false;
      const urgency = calculateUrgency(order.dueDate);
      return urgency !== null;
    })
    .map((order) => ({
      ...order,
      urgency: calculateUrgency(order.dueDate)!,
    }))
    .sort((a, b) => a.urgency.days - b.urgency.days); // Urutan paling darurat duluan

  // Aksi Cepat: Mulai Kerjakan (ubah status ke Dipotong)
  const handleStartWorking = async (orderId?: string, orderCode?: string) => {
    if (!orderId && !orderCode) return;
    try {
      const targetId = orderId || orderCode!;
      await api.orders.updateStatus(targetId, "Dipotong");

      // Perbarui state internal
      setInternalOrders((prev) =>
        prev.map((o) =>
          o.id === targetId || o.code === targetId ? { ...o, status: "Dipotong" } : o
        )
      );

      if (onOrderUpdated) {
        onOrderUpdated();
      }
    } catch (err) {
      console.error("Gagal memperbarui status pengerjaan:", err);
    }
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Tombol Icon Lonceng */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl border transition focus:outline-none shadow-2xs ${
          urgentOrders.length > 0
            ? "text-rose-600 bg-rose-50/50 border-rose-200 hover:bg-rose-100/70"
            : "text-slate-600 bg-white hover:bg-stone-100 border-stone-200"
        }`}
        aria-label="Pengingat Antrean Pesanan Kritis"
        title={
          urgentOrders.length > 0
            ? `${urgentOrders.length} pesanan mepet deadline belum disentuh!`
            : "Antrean pesanan aman"
        }
      >
        <Bell className="w-4 h-4" />
        {urgentOrders.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-black text-white ring-2 ring-white animate-pulse shadow-xs">
            {urgentOrders.length}
          </span>
        )}
      </button>

      {/* Floating Popover Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200/90 z-50 overflow-hidden text-slate-800"
          >
            {/* Header Popover */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl ${
                    urgentOrders.length > 0
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {urgentOrders.length > 0 ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm leading-tight">
                    Alarm Antrean Pesanan
                  </h4>
                  <p className="text-[10px] text-slate-300">
                    {urgentOrders.length > 0
                      ? `${urgentOrders.length} pesanan mepet belum disentuh`
                      : "Semua pesanan berjalan aman"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-stone-100 p-2">
              {urgentOrders.length === 0 ? (
                /* Zero State: Kondisi Aman */
                <div className="p-6 text-center space-y-2.5">
                  <div className="w-10 h-10 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-2xs">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Meja Jahit Aman! 👏</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      Tidak ada pesanan mendekati target yang belum disentuh. Semua pengerjaan terkendali.
                    </p>
                  </div>
                </div>
              ) : (
                /* List Kartu Pesanan Mepet */
                urgentOrders.map((order, idx) => (
                  <div
                    key={order.code}
                    className="p-3 rounded-2xl hover:bg-[#FAF9F6] transition-colors space-y-2 group"
                  >
                    {/* Baris Urutan & Badge Deadline */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">
                          #{idx + 1}
                        </span>
                        <span className="font-mono text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                          {order.code}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${order.urgency.color}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${order.urgency.dotColor}`} />
                        {order.urgency.label}
                      </span>
                    </div>

                    {/* Informasi Pakaian & Pelanggan */}
                    <div>
                      <h5 className="font-extrabold text-xs text-slate-900 leading-snug">
                        {order.customerName}
                      </h5>
                      <p className="text-[11px] font-medium text-slate-600 mt-0.5">
                        {order.itemName}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>Target ambil: {order.dueDate}</span>
                        <span className="mx-1">•</span>
                        <span className="text-rose-600 font-bold">Belum Dikerjakan</span>
                      </div>
                    </div>

                    {/* Tombol Aksi Cepat */}
                    <div className="pt-1.5 flex items-center justify-between gap-2 border-t border-stone-100 text-xs">
                      {order.phone ? (
                        <a
                          href={`https://wa.me/${order.phone.replace(/^0/, "62")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/70 px-2.5 py-1 rounded-xl border border-emerald-200 transition"
                        >
                          <Phone className="w-3 h-3" /> Chat WA
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400">Tanpa No. WA</span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleStartWorking(order.id, order.code)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded-xl shadow-xs active:scale-95 transition"
                      >
                        <Scissors className="w-3 h-3" /> Mulai Potong
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Popover */}
            <div className="p-3 bg-[#FAF9F6] border-t border-stone-100 flex items-center justify-between text-xs font-bold text-slate-600">
              <span className="text-[10px] text-slate-400">
                Peringatan: H-3 s/d Lewat Waktu
              </span>
              <Link
                href="/orders"
                onClick={() => setIsOpen(false)}
                className="text-indigo-700 hover:text-indigo-800 flex items-center gap-0.5 text-[11px] transition"
              >
                Lihat Semua Pesanan <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
