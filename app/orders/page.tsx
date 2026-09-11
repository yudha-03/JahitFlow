"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  MoreVertical,
  Calendar,
  Eye,
  FileEdit,
  Trash2,
  Info,
  Home // <-- DITAMBAHKAN: Import Home icon
} from "lucide-react";

// ============================================================================
// TYPES & DUMMY DATA
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

const INITIAL_ORDERS: OrderItem[] = [];
const ORDER_TABS = ["Semua", "Belum Dikerjakan", "Dipotong", "Dijahit", "Siap Diambil", "Selesai"];
const STATUS_OPTIONS: OrderStatus[] = ["Belum Dikerjakan", "Dipotong", "Dijahit", "Siap Diambil", "Selesai"];

// Helper Badge Status
const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case "Belum Dikerjakan":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <Circle className="w-2.5 h-2.5 fill-slate-400 text-slate-400" /> Belum Dikerjakan
        </span>
      );
    case "Dipotong":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <ScissorsLineDashed className="w-3.5 h-3.5 text-amber-600" /> Dipotong
        </span>
      );
    case "Dijahit":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
          <Scissors className="w-3.5 h-3.5 text-blue-600" /> Dijahit
        </span>
      );
    case "Siap Diambil":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Siap Diambil
        </span>
      );
    case "Selesai":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
          ✓ Selesai
        </span>
      );
  }
};

const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(angka);
};

// ============================================================================
// MAIN ORDERS COMPONENT
// ============================================================================

export default function OrdersPage() {
  const pathname = "/orders"; 
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // States Utama
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("Semua");
  
  // States Modals
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  // States Form
  const [orderForm, setOrderForm] = useState({
    customerName: "", phone: "", itemName: "", dueDate: "", price: "", paid: "",
  });
  const [editForm, setEditForm] = useState<OrderItem | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Logika Filter (Otomatis pindah tab berdasarkan activeTab)
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "Semua" || order.status === activeTab;
    return matchesSearch && matchesTab;
  });

  // --- FUNGSI AKSI ---

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.customerName || !orderForm.itemName) return;

    const newOrder: OrderItem = {
      code: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      customerName: orderForm.customerName,
      phone: orderForm.phone || "-",
      itemName: orderForm.itemName,
      dueDate: orderForm.dueDate || "Belum ditentukan",
      status: "Belum Dikerjakan",
      price: Number(orderForm.price) || 0,
      paid: Number(orderForm.paid) || 0,
    };

    setOrders([newOrder, ...orders]);
    setIsNewOrderModalOpen(false);
    setOrderForm({ customerName: "", phone: "", itemName: "", dueDate: "", price: "", paid: "" });
    showToast(`Pesanan ${newOrder.code} berhasil dibuat!`);
  };

  const handleOpenView = (order: OrderItem) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleOpenEdit = (order: OrderItem) => {
    setEditForm({ ...order }); // Clone data untuk diedit
    setIsEditModalOpen(true);
  };

  const handleUpdateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    setOrders(orders.map((o) => (o.code === editForm.code ? editForm : o)));
    setIsEditModalOpen(false);
    showToast(`Pesanan ${editForm.code} berhasil diperbarui!`);
  };

  const handleDeleteOrder = (code: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pesanan ${code}?`)) {
      setOrders(orders.filter((o) => o.code !== code));
      showToast(`Pesanan ${code} berhasil dihapus!`);
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
      group: "LAINNYA",
      items: [
        { name: "Pengaturan", href: "/settings", icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Toast Notifikasi */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-semibold text-sm border border-emerald-700"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Desktop & Mobile */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-sm">
                <Scissors className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-indigo-950 tracking-tight leading-none">JahitFlow</span>
                <span className="text-xs text-slate-500 font-medium mt-1">Satria Tailor</span>
              </div>
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 lg:hidden rounded-lg hover:bg-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-6">
            {navigationMenu.map((group, groupIdx) => (
              <div key={groupIdx}>
                <p className="px-3 text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">{group.group}</p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                          isActive ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20" : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 shadow-sm">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">S</div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate leading-tight">Satria</p>
                  <p className="text-xs text-slate-500 font-medium truncate">Pemilik Usaha</p>
                </div>
              </div>
              <button type="button" title="Keluar" onClick={() => router.push("/login")} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-2 sm:gap-4 min-w-0 overflow-hidden"
        >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden focus:outline-none">
              <Menu className="w-6 h-6" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight truncate">Daftar Pesanan</h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium hidden sm:block">Kelola dan pantau progres pengerjaan jahitan.</p>
            </div>
          </div>

          {/* Bagian Kanan Header (Icon Lonceng & Profil User) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* DITAMBAHKAN: Tombol Kembali ke Beranda */}
            <Link
              href="/"
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 hover:border-indigo-200 transition-all text-xs sm:text-sm font-bold shadow-sm shrink-0"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali ke Beranda</span>
              <span className="sm:hidden">Beranda</span>
            </Link>

            <button type="button" className="relative p-2 sm:p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors focus:outline-none">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <div className="flex items-center gap-2 sm:gap-2.5 pl-1.5 sm:pl-2 border-l border-slate-200 shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">S</div>
              <span className="text-sm font-bold text-slate-800 hidden md:inline-block">Satria Tailor</span>
            </div>
          </div>
        </motion.header>

        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto"
        >
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kode atau nama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-bold text-slate-900 placeholder:text-slate-400 transition-all shadow-sm"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button 
                onClick={() => setIsNewOrderModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/20 transition-all flex-1 sm:flex-none justify-center"
              >
                <Plus className="w-4 h-4" /> Buat Pesanan
              </button>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="bg-white p-1 rounded-2xl border border-slate-200/80 shadow-sm inline-flex overflow-x-auto w-full hide-scrollbar">
            {ORDER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-none ${
                  activeTab === tab
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 px-6">Kode & Pelanggan</th>
                    <th className="py-4 px-6">Detail Jahitan</th>
                    <th className="py-4 px-6">Tgl Ambil</th>
                    <th className="py-4 px-6">Biaya & Pembayaran</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order.code} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="py-4 px-6">
                          <p className="font-extrabold text-indigo-700 text-sm">{order.code}</p>
                          <p className="font-bold text-slate-900 mt-1">{order.customerName}</p>
                          <p className="text-xs text-slate-500">{order.phone}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-bold text-slate-800">{order.itemName}</p>
                        </td>
                        <td className="py-4 px-6">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200">
                            <Calendar className="w-3.5 h-3.5" /> {order.dueDate}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-bold text-slate-900">{formatRupiah(order.price)}</p>
                          {order.paid >= order.price ? (
                            <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-block">Lunas</span>
                          ) : order.paid > 0 ? (
                            <span className="text-[10px] font-bold text-amber-600 uppercase bg-amber-50 px-2 py-0.5 rounded-md mt-1 inline-block">DP: {formatRupiah(order.paid)}</span>
                          ) : (
                            <span className="text-[10px] font-bold text-red-600 uppercase bg-red-50 px-2 py-0.5 rounded-md mt-1 inline-block">Belum Bayar</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Tombol Lihat Detail */}
                            <button onClick={() => handleOpenView(order)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Lihat Detail">
                              <Eye className="w-4 h-4" />
                            </button>
                            {/* Tombol Edit */}
                            <button onClick={() => handleOpenEdit(order)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Ubah Pesanan">
                              <FileEdit className="w-4 h-4" />
                            </button>
                            {/* Tombol Hapus */}
                            <button onClick={() => handleDeleteOrder(order.code)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Pesanan">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 font-medium">
                        <div className="flex flex-col items-center justify-center">
                          <Search className="w-10 h-10 text-slate-300 mb-3" />
                          <p>Tidak ada pesanan yang sesuai dengan filter atau pencarian.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="space-y-4 md:hidden">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div key={order.code} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 relative">
                  <button onClick={() => handleDeleteOrder(order.code)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 p-1 bg-white rounded-md">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 pr-8">
                    <span className="font-extrabold text-indigo-700 text-sm bg-indigo-50 px-2.5 py-1 rounded-lg">{order.code}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{order.customerName}</h4>
                      <p className="text-xs text-slate-500 mb-2">{order.phone}</p>
                      <p className="text-sm font-semibold text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100 inline-block">{order.itemName}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-semibold">
                    <div className="space-y-1">
                      <span className="text-slate-400 uppercase text-[10px]">Tgl Ambil</span>
                      <p className="flex items-center gap-1 text-slate-700"><Clock className="w-3.5 h-3.5" /> {order.dueDate}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="text-slate-400 uppercase text-[10px]">Total Biaya</span>
                      <p className="text-slate-900 font-bold">{formatRupiah(order.price)}</p>
                    </div>
                  </div>
                  <div className="pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                    <div>{getStatusBadge(order.status)}</div>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenView(order)} className="px-3 py-1.5 text-center text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Detail</button>
                      <button onClick={() => handleOpenEdit(order)} className="px-3 py-1.5 text-center text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">Update</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Pesanan tidak ditemukan.</p>
              </div>
            )}
          </div>

        </motion.main>
      </div>

      {/* =========================================================================
          MODALS
      ========================================================================= */}

      {/* 1. MODAL TAMBAH PESANAN */}
      <AnimatePresence>
        {isNewOrderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsNewOrderModalOpen(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 max-h-[90vh] flex flex-col">
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 rounded-xl"><Plus className="w-5 h-5 text-white" /></div>
                  <div>
                    <h3 className="font-extrabold text-lg">Buat Pesanan Baru</h3>
                    <p className="text-xs text-slate-400">Masukkan data jahitan dan pelanggan</p>
                  </div>
                </div>
                <button onClick={() => setIsNewOrderModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreateOrder} className="p-6 space-y-5 overflow-y-auto flex-1">
                {/* Info Pelanggan */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2"><Users className="w-4 h-4" /> Info Pelanggan</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Pelanggan <span className="text-red-500">*</span></label>
                      <input type="text" required placeholder="Contoh: Budi Santoso" value={orderForm.customerName} onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nomor WhatsApp</label>
                      <input type="tel" placeholder="081234567890" value={orderForm.phone} onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-900" />
                    </div>
                  </div>
                </div>

                {/* Detail Jahitan */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-extrabold text-amber-600 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2"><Scissors className="w-4 h-4" /> Detail Jahitan</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Pakaian / Jahitan <span className="text-red-500">*</span></label>
                      <input type="text" required placeholder="Contoh: Kemeja Batik Lengan Panjang" value={orderForm.itemName} onChange={(e) => setOrderForm({ ...orderForm, itemName: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tanggal Diambil</label>
                      <input type="date" value={orderForm.dueDate} onChange={(e) => setOrderForm({ ...orderForm, dueDate: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-900" />
                    </div>
                  </div>
                </div>

                {/* Biaya */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2"><CreditCard className="w-4 h-4" /> Biaya & Pembayaran</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Total Biaya (Rp)</label>
                      <input type="number" placeholder="150000" value={orderForm.price} onChange={(e) => setOrderForm({ ...orderForm, price: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Sudah Dibayar / DP (Rp)</label>
                      <input type="number" placeholder="50000" value={orderForm.paid} onChange={(e) => setOrderForm({ ...orderForm, paid: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-900" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setIsNewOrderModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100">Batal</button>
                  <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20">Simpan Pesanan</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. MODAL LIHAT DETAIL */}
      <AnimatePresence>
        {isViewModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsViewModalOpen(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 max-h-[90vh] flex flex-col">
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><Info className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">Detail Pesanan</h3>
                    <p className="text-xs font-bold text-indigo-600">{selectedOrder.code}</p>
                  </div>
                </div>
                <button onClick={() => setIsViewModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">Status Saat Ini</p>
                  <div>{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Pelanggan</p>
                    <p className="font-bold text-slate-900">{selectedOrder.customerName}</p>
                    <p className="text-sm text-slate-500">{selectedOrder.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Tenggat Waktu</p>
                    <p className="font-bold text-slate-900 flex items-center gap-1"><Calendar className="w-4 h-4 text-slate-400" /> {selectedOrder.dueDate}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-400 uppercase font-bold">Detail Jahitan</p>
                    <p className="font-bold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-100 mt-1">{selectedOrder.itemName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Total Biaya</p>
                    <p className="font-extrabold text-slate-900 text-lg">{formatRupiah(selectedOrder.price)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Sudah Dibayar</p>
                    <p className="font-extrabold text-emerald-600 text-lg">{formatRupiah(selectedOrder.paid)}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
                <button onClick={() => setIsViewModalOpen(false)} className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-100">Tutup</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. MODAL UBAH / EDIT PESANAN */}
      <AnimatePresence>
        {isEditModalOpen && editForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 max-h-[90vh] flex flex-col">
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500 rounded-xl"><FileEdit className="w-5 h-5 text-white" /></div>
                  <div>
                    <h3 className="font-extrabold text-lg">Ubah Data Pesanan</h3>
                    <p className="text-xs text-amber-200">ID: {editForm.code}</p>
                  </div>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleUpdateOrder} className="p-6 space-y-5 overflow-y-auto flex-1">
                
                {/* --- UPDATE STATUS (Ini yang bikin pindah tab) --- */}
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl mb-4">
                  <label className="block text-xs font-extrabold text-amber-800 uppercase mb-2">Update Status Pengerjaan</label>
                  <select 
                    value={editForm.status} 
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as OrderStatus })}
                    className="w-full px-4 py-3 rounded-xl border border-amber-200 bg-white text-slate-900 font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <p className="text-xs text-amber-600 mt-2 font-medium">*Mengubah status akan memindahkan pesanan ke tab yang sesuai.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Pelanggan</label>
                    <input type="text" required value={editForm.customerName} onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nomor WhatsApp</label>
                    <input type="tel" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-900" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Detail Jahitan</label>
                    <input type="text" required value={editForm.itemName} onChange={(e) => setEditForm({ ...editForm, itemName: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tanggal Diambil</label>
                    <input type="date" value={editForm.dueDate} onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-900" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Total Biaya (Rp)</label>
                    <input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Sudah Dibayar (Rp)</label>
                    <input type="number" value={editForm.paid} onChange={(e) => setEditForm({ ...editForm, paid: Number(e.target.value) })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-900" />
                  </div>
                </div>

                <div className="pt-6 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100">Batal</button>
                  <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20">Simpan Perubahan</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}