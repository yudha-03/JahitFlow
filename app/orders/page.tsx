"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api, getAuthUser } from "@/lib/api";
import NotificationBell from "@/components/NotificationBell";
import {
  Scissors,
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  Plus,
  Search,
  Bell,
  Clock,
  CheckCircle2,
  Menu,
  X,
  LogOut,
  Circle,
  ScissorsLineDashed,
  Filter,
  Calendar,
  Eye,
  FileEdit,
  Trash2,
  Info,
  Home,
  ShoppingBag,
  Sparkles,
  Receipt,
  Phone,
  ArrowRight,
  ExternalLink,
  Copy
} from "lucide-react";

// ============================================================================
// TYPES & INITIAL STATE (ZERO DUMMY DATA)
// ============================================================================

type OrderStatus = "Belum Dikerjakan" | "Dipotong" | "Dijahit" | "Siap Diambil" | "Selesai";

interface OrderItem {
  code: string;
  customerName: string;
  phone: string;
  itemName: string;
  dueDate: string;
  status: OrderStatus;
  price: number;
  paid: number;
}

// Keadaan awal kosong murni sesuai permintaan
const INITIAL_ORDERS: OrderItem[] = [];

const ORDER_TABS = ["Semua", "Belum Dikerjakan", "Dipotong", "Dijahit", "Siap Diambil", "Selesai"] as const;
const STATUS_OPTIONS: OrderStatus[] = ["Belum Dikerjakan", "Dipotong", "Dijahit", "Siap Diambil", "Selesai"];

// Helper Status Badges bergaya Atelier
const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case "Belum Dikerjakan":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/90 shadow-2xs">
          <Circle className="w-2 h-2 fill-slate-400 text-slate-400" />
          Belum Dikerjakan
        </span>
      );
    case "Dipotong":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/90 shadow-2xs">
          <ScissorsLineDashed className="w-3.5 h-3.5 text-amber-600" />
          Dipotong
        </span>
      );
    case "Dijahit":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200/90 shadow-2xs">
          <Scissors className="w-3.5 h-3.5 text-blue-600" />
          Dijahit
        </span>
      );
    case "Siap Diambil":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/90 shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Siap Diambil
        </span>
      );
    case "Selesai":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200/90 shadow-2xs">
          ✓ Selesai
        </span>
      );
  }
};

const formatRupiah = (angka?: number | null) => {
  const val = Number(angka) || 0;
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
};

// ============================================================================
// MAIN ORDERS COMPONENT
// ============================================================================

export default function OrdersPage() {
  const pathname = usePathname(); 
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // States Utama
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("Semua");
  
  // States Modals
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  // States Form Buat Pesanan Baru
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    phone: "",
    itemName: "",
    dueDate: "",
    price: "",
    paid: "",
  });

  // State Form Edit Pesanan
  const [editForm, setEditForm] = useState<OrderItem | null>(null);

  // Toast Notification Trigger
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // User Profile State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await api.orders.getAll();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal memuat pesanan:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      setCurrentUser(user);
      if (user.avatar) setUserAvatar(user.avatar);
    }
    if (typeof window !== "undefined") {
      const savedAvatar = localStorage.getItem("jahitflow_avatar");
      if (savedAvatar) setUserAvatar(savedAvatar);
    }
    loadOrders();
  }, []);

  // Logika Filter (Tab & Search Query)
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.itemName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "Semua" || order.status === activeTab;
    return matchesSearch && matchesTab;
  });

  // Hitung jumlah per status untuk badge di setiap tab
  const getTabCount = (tabName: string) => {
    if (tabName === "Semua") return orders.length;
    return orders.filter(o => o.status === tabName).length;
  };

  // --- FUNGSI AKSI ---

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.customerName || !orderForm.itemName) return;

    try {
      const created = await api.orders.create({
        customerName: orderForm.customerName.trim(),
        phone: orderForm.phone.trim() || "-",
        itemName: orderForm.itemName.trim(),
        dueDate: orderForm.dueDate || "Belum ditentukan",
        price: Number(orderForm.price) || 0,
        paid: Number(orderForm.paid) || 0,
      });

      await loadOrders();
      setIsNewOrderModalOpen(false);
      setOrderForm({ customerName: "", phone: "", itemName: "", dueDate: "", price: "", paid: "" });
      showToast(`Pesanan ${created.code} berhasil disimpan ke database!`);
    } catch (err: any) {
      showToast(`Gagal membuat pesanan: ${err.message}`);
    }
  };

  const handleOpenView = (order: OrderItem) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleOpenEdit = (order: OrderItem) => {
    setEditForm({ ...order });
    setIsEditModalOpen(true);
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    try {
      const target = orders.find(o => o.code === editForm.code);
      const idOrCode = (target as any)?.id || editForm.code;
      await api.orders.update(idOrCode, {
        customerName: editForm.customerName,
        phone: editForm.phone,
        itemName: editForm.itemName,
        dueDate: editForm.dueDate,
        status: editForm.status,
        price: Number(editForm.price) || 0,
        paid: Number(editForm.paid) || 0,
      });

      await loadOrders();
      setIsEditModalOpen(false);
      showToast(`Pesanan ${editForm.code} berhasil diperbarui di database!`);
    } catch (err: any) {
      showToast(`Gagal memperbarui pesanan: ${err.message}`);
    }
  };

  const handleDeleteOrder = async (code: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pesanan ${code}?`)) {
      try {
        const target = orders.find(o => o.code === code);
        const idOrCode = (target as any)?.id || code;
        await api.orders.delete(idOrCode);
        setOrders(orders.filter((o) => o.code !== code));
        showToast(`Pesanan ${code} berhasil dihapus dari database!`);
      } catch (err: any) {
        showToast(`Gagal menghapus pesanan: ${err.message}`);
      }
    }
  };

  const navigationMenu = [
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

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-slate-800 flex font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Toast Notifikasi */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 right-4 z-50 max-w-[calc(100vw-2rem)] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-xs border border-indigo-700"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* =====================================================================
          1. SIDEBAR (Atelier Modern Workspace - Persis Dashboard)
          ===================================================================== */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-stone-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-atelier ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
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
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 lg:hidden rounded-lg hover:bg-stone-100"
              aria-label="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigasi Links */}
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
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? "bg-indigo-700 text-white shadow-md shadow-indigo-700/20"
                            : "text-slate-600 hover:bg-stone-100/80 hover:text-slate-900"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
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
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-xs shrink-0 overflow-hidden">
                  {userAvatar ? (
                    <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "S"
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                    {currentUser?.name ? currentUser.name.split(" ")[0] : "Satria"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium truncate">
                    {currentUser?.business?.businessType || "Pemilik Usaha"}
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

      {/* =====================================================================
          2. MAIN CONTENT AREA
          ===================================================================== */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Floating Glass Header Bar */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="sticky top-0 z-30 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-stone-200/80 px-3 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-2.5 sm:gap-3 shadow-2xs"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-slate-600 hover:bg-stone-100 rounded-xl lg:hidden focus:outline-none shrink-0"
              aria-label="Buka Menu Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight truncate">
                Daftar Pesanan Jahitan
              </h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block truncate">
                Kelola dan pantau progres pengerjaan jahitan serta status pelunasan.
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Tombol Kembali ke Beranda */}
            <Link
              href="/"
              title="Kembali ke Beranda"
              aria-label="Kembali ke Beranda"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-indigo-700 bg-white hover:bg-indigo-50 border border-stone-200 rounded-xl transition shadow-2xs"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kembali ke Beranda</span>
            </Link>

            <NotificationBell
              orders={orders}
              onOrderUpdated={loadOrders}
            />

            <div className="flex items-center gap-2 pl-1.5 sm:pl-2 border-l border-stone-200 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-indigo-700 text-white font-extrabold flex items-center justify-center text-xs shadow-xs overflow-hidden">
                {userAvatar ? (
                  <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "S"
                )}
              </div>
              <span className="text-xs font-extrabold text-slate-800 hidden md:inline-block">
                {currentUser?.business?.name || "Satria Tailor"}
              </span>
            </div>
          </div>
        </motion.header>

        {/* Content Body */}
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="p-3.5 sm:p-8 space-y-5 sm:space-y-6 max-w-7xl w-full mx-auto"
        >
          
          {/* Top Search & Primary CTA Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kode nota, nama pelanggan, jenis pakaian..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={() => setIsNewOrderModalOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 active:scale-95 text-white rounded-2xl text-xs sm:text-sm font-extrabold shadow-md shadow-indigo-700/20 transition-all flex-1 sm:flex-none hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Pesanan Baru</span>
              </button>
            </div>
          </div>

          {/* Status Tabs Filter */}
          <div className="bg-white p-1.5 rounded-2xl border border-stone-200/90 shadow-atelier flex items-center gap-1 overflow-x-auto hide-scrollbar">
            {ORDER_TABS.map((tab) => {
              const count = getTabCount(tab);
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 ${
                    isActive
                      ? "bg-indigo-700 text-white shadow-sm shadow-indigo-700/25"
                      : "text-slate-500 hover:text-slate-900 hover:bg-stone-50"
                  }`}
                >
                  <span>{tab}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-stone-100 text-slate-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Desktop Table View */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-atelier overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF9F6] border-b border-stone-200/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 px-6">Kode & Pelanggan</th>
                    <th className="py-4 px-6">Detail Busana</th>
                    <th className="py-4 px-6">Target Ambil</th>
                    <th className="py-4 px-6">Biaya & Status Bayar</th>
                    <th className="py-4 px-6">Status Pengerjaan</th>
                    <th className="py-4 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => {
                      const isPaidOff = (order.paid || 0) >= (order.price || 0) && (order.price || 0) > 0;
                      const hasDP = (order.paid || 0) > 0 && !isPaidOff;
                      
                      return (
                        <tr key={order.code} className="hover:bg-stone-50/70 transition-colors group">
                          {/* Kode & Pelanggan */}
                          <td className="py-4 px-6">
                            <span className="font-extrabold text-indigo-700 font-mono text-xs bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100/80 inline-block">
                              {order.code}
                            </span>
                            <p className="font-bold text-slate-900 mt-1.5 text-xs">{order.customerName}</p>
                            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-slate-400" /> {order.phone}
                            </p>
                          </td>

                          {/* Detail Busana */}
                          <td className="py-4 px-6 font-bold text-slate-800">
                            {order.itemName}
                          </td>

                          {/* Target Ambil */}
                          <td className="py-4 px-6">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-100/80 text-slate-700 font-semibold text-xs border border-stone-200">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" /> {order.dueDate}
                            </div>
                          </td>

                          {/* Biaya & Status Bayar */}
                          <td className="py-4 px-6">
                            <p className="font-black text-slate-900 text-xs">{formatRupiah(order.price)}</p>
                            {isPaidOff ? (
                              <span className="text-[10px] font-extrabold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 mt-1 inline-block">
                                ✓ Lunas
                              </span>
                            ) : hasDP ? (
                              <span className="text-[10px] font-extrabold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80 mt-1 inline-block">
                                DP: {formatRupiah(order.paid)}
                              </span>
                            ) : (
                              <span className="text-[10px] font-extrabold text-rose-600 uppercase bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/80 mt-1 inline-block">
                                Belum Bayar
                              </span>
                            )}
                          </td>

                          {/* Status Pengerjaan */}
                          <td className="py-4 px-6">
                            {getStatusBadge(order.status)}
                          </td>

                          {/* Aksi Cepat */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Lihat Detail */}
                              <button
                                type="button"
                                onClick={() => handleOpenView(order)}
                                className="p-2 text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors border border-transparent hover:border-indigo-100"
                                title="Lihat Resi Detail"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {/* Edit Status */}
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(order)}
                                className="p-2 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-colors border border-transparent hover:border-amber-100"
                                title="Ubah Status & Data"
                              >
                                <FileEdit className="w-4 h-4" />
                              </button>
                              {/* Hapus */}
                              <button
                                type="button"
                                onClick={() => handleDeleteOrder(order.code)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100"
                                title="Hapus Pesanan"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-16 text-center">
                        <div className="max-w-md mx-auto space-y-3">
                          <div className="w-14 h-14 mx-auto rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 shadow-2xs">
                            <Scissors className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                              {searchQuery ? "Tidak ada pesanan yang sesuai pencarian" : "Belum Ada Pesanan Tersimpan"}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                              {searchQuery 
                                ? `Hasil untuk "${searchQuery}" tidak ditemukan pada tab ${activeTab}.`
                                : "Daftar pesanan jahit masih kosong. Mulai catat pesanan baru untuk memantau status pengerjaan."}
                            </p>
                          </div>
                          {!searchQuery && (
                            <button
                              type="button"
                              onClick={() => setIsNewOrderModalOpen(true)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-700/20 active:scale-95 transition"
                            >
                              <Plus className="w-3.5 h-3.5" /> Catat Pesanan Baru
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card List View */}
          <div className="space-y-3 md:hidden">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div key={order.code} className="bg-white p-4 rounded-3xl border border-stone-200/90 shadow-atelier space-y-3 relative">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                    <span className="font-extrabold text-indigo-700 font-mono text-xs bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                      {order.code}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {getStatusBadge(order.status)}
                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(order.code)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{order.customerName}</h4>
                    <p className="text-xs text-slate-400 font-mono">{order.phone}</p>
                    <p className="text-xs font-semibold text-slate-700 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-100 mt-2 inline-block">
                      {order.itemName}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs font-semibold">
                    <div className="space-y-0.5">
                      <span className="text-slate-400 text-[10px] font-bold uppercase">Tgl Ambil</span>
                      <p className="flex items-center gap-1 text-slate-700 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {order.dueDate}
                      </p>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <span className="text-slate-400 text-[10px] font-bold uppercase">Total Biaya</span>
                      <p className="text-slate-900 font-black">{formatRupiah(order.price)}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-100">
                    <div>
                      {order.paid >= order.price && order.price > 0 ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Lunas</span>
                      ) : order.paid > 0 ? (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">DP: {formatRupiah(order.paid)}</span>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Belum Bayar</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenView(order)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition"
                      >
                        Resi
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(order)}
                        className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-stone-200/90 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-stone-100 flex items-center justify-center text-slate-400">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Belum Ada Pesanan</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Mulai catat pesanan jahit baru.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(true)}
                  className="px-4 py-2 bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-700/20"
                >
                  + Pesanan Baru
                </button>
              </div>
            )}
          </div>

        </motion.main>
      </div>

      {/* =========================================================================
          MODALS
      ========================================================================= */}

      {/* 1. MODAL TAMBAH PESANAN BARU */}
      <AnimatePresence>
        {isNewOrderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewOrderModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-100 z-10 max-h-[92vh] flex flex-col"
            >
              {/* Luxury Obsidian-Indigo Modal Header */}
              <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-sm text-white">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg">Buat Pesanan Baru</h3>
                    <p className="text-xs text-indigo-200">Catat pemesanan jahitan pakaian baru</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="p-1.5 text-indigo-200 hover:text-white rounded-lg hover:bg-white/10 transition"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateOrder} className="p-6 space-y-5 overflow-y-auto flex-1">
                {/* 1. Data Pemesan */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider flex items-center gap-2 border-b border-stone-200 pb-2">
                    <Users className="w-4 h-4" /> 1. Data Pelanggan
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Nama Pelanggan <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Budi Santoso"
                        value={orderForm.customerName}
                        onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-xs sm:text-sm font-bold text-slate-900 shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Nomor WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="081234567890"
                        value={orderForm.phone}
                        onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-xs sm:text-sm font-bold text-slate-900 shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Detail Busana */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-extrabold text-amber-700 uppercase tracking-wider flex items-center gap-2 border-b border-stone-200 pb-2">
                    <Scissors className="w-4 h-4" /> 2. Spesifikasi Busana
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Jenis Pakaian / Model Jahitan <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Kemeja Batik Sutra Lengan Panjang"
                        value={orderForm.itemName}
                        onChange={(e) => setOrderForm({ ...orderForm, itemName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-xs sm:text-sm font-bold text-slate-900 shadow-2xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Target Tanggal Pengambilan
                      </label>
                      <input
                        type="date"
                        value={orderForm.dueDate}
                        onChange={(e) => setOrderForm({ ...orderForm, dueDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-xs sm:text-sm font-bold text-slate-900 shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Biaya & DP */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider flex items-center gap-2 border-b border-stone-200 pb-2">
                    <CreditCard className="w-4 h-4" /> 3. Biaya & Pembayaran
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Total Biaya Ongkos Jahit (Rp)
                      </label>
                      <input
                        type="number"
                        placeholder="250000"
                        value={orderForm.price}
                        onChange={(e) => setOrderForm({ ...orderForm, price: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-xs sm:text-sm font-bold text-slate-900 shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Sudah Dibayar / Titipan DP (Rp)
                      </label>
                      <input
                        type="number"
                        placeholder="100000"
                        value={orderForm.paid}
                        onChange={(e) => setOrderForm({ ...orderForm, paid: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-xs sm:text-sm font-bold text-slate-900 shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsNewOrderModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-stone-100 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-indigo-700 hover:bg-indigo-800 active:scale-95 text-white shadow-md shadow-indigo-700/20 transition"
                  >
                    Simpan Pesanan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. MODAL LIHAT DETAIL (DIGITAL ATELIER RECEIPT) */}
      <AnimatePresence>
        {isViewModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsViewModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-100 z-10 max-h-[92vh] flex flex-col"
            >
              {/* Resi Header */}
              <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 to-indigo-950 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/10 rounded-2xl text-amber-300">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg">Resi Nota Jahitan</h3>
                    <p className="text-xs text-indigo-200 font-mono font-bold">{selectedOrder.code}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-1.5 text-indigo-200 hover:text-white rounded-lg hover:bg-white/10 transition"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto">
                {/* Status Badge */}
                <div className="flex items-center justify-between bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200/90">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Status Pengerjaan</p>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">{selectedOrder.status}</p>
                  </div>
                  <div>{getStatusBadge(selectedOrder.status)}</div>
                </div>

                {/* Grid Rincian */}
                <div className="grid grid-cols-2 gap-4 border-t border-stone-100 pt-4 text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-extrabold">Nama Pelanggan</p>
                    <p className="font-extrabold text-slate-900 text-sm mt-0.5">{selectedOrder.customerName}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedOrder.phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-extrabold">Tenggat Selesai</p>
                    <p className="font-extrabold text-slate-900 text-sm flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {selectedOrder.dueDate}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-slate-400 uppercase font-extrabold">Spesifikasi Jahitan</p>
                    <p className="font-bold text-slate-900 bg-stone-50 p-3 rounded-2xl border border-stone-200/90 mt-1">
                      {selectedOrder.itemName}
                    </p>
                  </div>
                </div>

                {/* Breakdown Biaya */}
                <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200/90 space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-slate-600">
                    <span>Total Biaya Jahit:</span>
                    <span className="font-black text-slate-900">{formatRupiah(selectedOrder.price)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-700">
                    <span>Sudah Dibayar (DP/Lunas):</span>
                    <span className="font-black">{formatRupiah(selectedOrder.paid)}</span>
                  </div>
                  <div className="flex justify-between font-black text-slate-900 border-t border-stone-200 pt-2 text-sm">
                    <span>Sisa Tagihan:</span>
                    <span className="text-indigo-700">
                      {formatRupiah(Math.max(0, (Number(selectedOrder.price) || 0) - (Number(selectedOrder.paid) || 0)))}
                    </span>
                  </div>
                </div>

                {/* Quick Share Links */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {selectedOrder.phone && (
                    <a
                      href={`https://wa.me/${selectedOrder.phone.replace(/^0/, "62")}?text=${encodeURIComponent(
                        `Halo ${selectedOrder.customerName}, ini informasi pesanan jahitan Anda di ${currentUser?.business?.name || "JahitFlow"}:\nKode Nota: ${selectedOrder.code}\nPakaian: ${selectedOrder.itemName}\nStatus: ${selectedOrder.status}\nTarget Ambil: ${selectedOrder.dueDate}\nTotal: ${formatRupiah(selectedOrder.price)}\n\nLacak status jahitan Anda di:\n${typeof window !== "undefined" ? window.location.origin : ""}/tracking?code=${selectedOrder.code}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" /> Kirim ke WA
                    </a>
                  )}
                  <Link
                    href={`/tracking?code=${selectedOrder.code}`}
                    className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Buka Tracking
                  </Link>
                </div>
              </div>
              
              <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleOpenEdit(selectedOrder);
                  }}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition"
                >
                  Ubah Status
                </button>
                <button
                  type="button"
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-5 py-2 bg-white border border-stone-300 text-slate-700 rounded-xl font-bold text-xs hover:bg-stone-100 transition shadow-2xs"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. MODAL UBAH / EDIT PESANAN */}
      <AnimatePresence>
        {isEditModalOpen && editForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-100 z-10 max-h-[92vh] flex flex-col"
            >
              {/* Header Amber-Obsidian */}
              <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 to-amber-950 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-600 rounded-2xl text-white shadow-sm">
                    <FileEdit className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg">Ubah Data Pesanan</h3>
                    <p className="text-xs text-amber-200 font-mono">Kode: {editForm.code}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 text-amber-200 hover:text-white rounded-lg hover:bg-white/10 transition"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateOrder} className="p-6 space-y-5 overflow-y-auto flex-1">
                
                {/* Selektor Status Pengerjaan (Highlight) */}
                <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl">
                  <label className="block text-xs font-extrabold text-amber-900 uppercase mb-2">
                    Update Status Pengerjaan Jahitan
                  </label>
                  <select 
                    value={editForm.status} 
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as OrderStatus })}
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-slate-900 font-extrabold text-xs sm:text-sm focus:ring-4 focus:ring-amber-500/20 outline-none shadow-2xs"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <p className="text-[11px] text-amber-700 mt-2 font-medium">
                    *Mengubah status di atas otomatis memindahkan pesanan ke tab status yang sesuai.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Nama Pelanggan
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.customerName}
                      onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-xs sm:text-sm font-bold text-slate-900 shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Nomor WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-xs sm:text-sm font-bold text-slate-900 shadow-2xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Jenis Pakaian / Model
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.itemName}
                      onChange={(e) => setEditForm({ ...editForm, itemName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-xs sm:text-sm font-bold text-slate-900 shadow-2xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Tanggal Target Ambil
                    </label>
                    <input
                      type="date"
                      value={editForm.dueDate}
                      onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-xs sm:text-sm font-bold text-slate-900 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-stone-100 pt-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Total Biaya (Rp)
                    </label>
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-xs sm:text-sm font-bold text-slate-900 shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Sudah Dibayar (Rp)
                    </label>
                    <input
                      type="number"
                      value={editForm.paid}
                      onChange={(e) => setEditForm({ ...editForm, paid: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-xs sm:text-sm font-bold text-slate-900 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-stone-100 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-amber-600 hover:bg-amber-700 active:scale-95 text-white shadow-md shadow-amber-600/20 transition"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}