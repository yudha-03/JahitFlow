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
  CheckCircle2,
  Menu,
  X,
  LogOut,
  Wallet,
  Receipt,
  Banknote,
  Calendar,
  Eye,
  Filter,
  Download,
  MoreVertical,
  Check,
  Printer,
  Home // <-- Tambahan icon Home
} from "lucide-react"; //[cite: 7]

// ============================================================================
// TYPES & INITIAL DATA
// ============================================================================

type PaymentStatus = "Lunas" | "DP" | "Belum Bayar";
type PaymentMethod = "Cash" | "Transfer Bank" | "E-Wallet" | "-";

interface Transaction {
  id: string;
  date: string;
  orderCode: string;
  customerName: string;
  totalAmount: number;
  paidAmount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  notes?: string;
} //[cite: 7]

// Data awal dikosongkan
const INITIAL_TRANSACTIONS: Transaction[] = []; //[cite: 7]

const STATUS_TABS = ["Semua", "Lunas", "DP", "Belum Bayar"]; //[cite: 7]

const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(angka);
}; //[cite: 7]

// Helper Badge Status
const getStatusBadge = (status: PaymentStatus) => {
  switch (status) {
    case "Lunas":
      return <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">Lunas</span>;
    case "DP":
      return <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-amber-50 text-amber-700 border border-amber-200">Bayar DP</span>;
    case "Belum Bayar":
      return <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-rose-50 text-rose-700 border border-rose-200">Belum Bayar</span>;
  }
}; //[cite: 7]

// ============================================================================
// MAIN PAYMENTS COMPONENT
// ============================================================================

export default function PaymentsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // States
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("Semua");
  
  // Modals State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);

  // Form State untuk Tambah Transaksi
  const [formData, setFormData] = useState({
    orderCode: "",
    customerName: "",
    totalAmount: "",
    paidAmount: "",
    paymentMethod: "Cash" as PaymentMethod,
    notes: "",
  }); //[cite: 7]

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }; //[cite: 7]

  // Filter & Search Logic
  const filteredTransactions = transactions.filter((trx) => {
    const matchesSearch = 
      trx.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      trx.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trx.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "Semua" || trx.status === activeTab;
    return matchesSearch && matchesTab;
  }); //[cite: 7]

  // Kalkulasi Statistik
  const totalPendapatan = transactions.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalPiutang = transactions.reduce((acc, curr) => acc + (curr.totalAmount - curr.paidAmount), 0);
  const totalTransaksiLunas = transactions.filter(t => t.status === "Lunas").length; //[cite: 7]

  // Handler Submit Transaksi Baru
  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.orderCode || !formData.customerName || !formData.totalAmount) {
      showToast("Harap isi semua bidang wajib!");
      return;
    }

    const total = parseFloat(formData.totalAmount) || 0;
    const paid = parseFloat(formData.paidAmount) || 0;
    let status: PaymentStatus = "Belum Bayar";

    if (paid >= total && total > 0) {
      status = "Lunas";
    } else if (paid > 0) {
      status = "DP";
    }

    const newTrx: Transaction = {
      id: `TRX-${new Date().getFullYear()}-${String(transactions.length + 1).padStart(3, '0')}`,
      date: new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }),
      orderCode: formData.orderCode.toUpperCase(),
      customerName: formData.customerName,
      totalAmount: total,
      paidAmount: paid,
      paymentMethod: formData.paymentMethod,
      status: status,
      notes: formData.notes,
    };

    setTransactions([newTrx, ...transactions]);
    setIsPaymentModalOpen(false);
    
    // Reset Form
    setFormData({
      orderCode: "",
      customerName: "",
      totalAmount: "",
      paidAmount: "",
      paymentMethod: "Cash",
      notes: "",
    });
    
    showToast("Transaksi pembayaran berhasil dicatat!");
  }; //[cite: 7]

  // Handler Lunasi Instan
  const handleLunasi = (id: string) => {
    setTransactions((prev) =>
      prev.map((trx) => {
        if (trx.id === id) {
          return {
            ...trx,
            paidAmount: trx.totalAmount,
            status: "Lunas",
            paymentMethod: trx.paymentMethod === "-" ? "Cash" : trx.paymentMethod,
          };
        }
        return trx;
      })
    );
    showToast("Pembayaran berhasil dilunasi!");
  }; //[cite: 7]

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
  ]; //[cite: 7]

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-slate-800 flex font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      
      {/* Toast Feedback Notification */}
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
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 lg:hidden rounded-lg hover:bg-stone-100"
              aria-label="Tutup Menu"
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

      {/* =====================================================================
          2. MAIN CONTENT AREA
          ===================================================================== */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Floating Glass Header Bar */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="sticky top-0 z-30 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-3 shadow-2xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-slate-600 hover:bg-stone-100 rounded-xl lg:hidden focus:outline-none"
              aria-label="Buka Menu Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight truncate">Pembayaran</h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">Kelola tagihan, DP, dan riwayat transaksi pelunasan.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Tombol Kembali ke Beranda */}
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-indigo-700 bg-white hover:bg-indigo-50 border border-stone-200 rounded-xl transition shadow-2xs"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kembali ke Beranda</span>
              <span className="sm:hidden">Beranda</span>
            </Link>

            <button
              type="button"
              className="relative p-2 text-slate-600 hover:bg-stone-100 rounded-xl border border-stone-200 transition focus:outline-none shadow-2xs"
              aria-label="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-stone-200 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-indigo-700 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                S
              </div>
              <span className="text-xs font-extrabold text-slate-800 hidden md:inline-block">Satria Tailor</span>
            </div>
          </div>
        </motion.header>

        {/* Payments Page Content */}
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto"
        >
          
          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Wallet size={20} />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Uang Diterima</p>
                <p className="text-2xl font-extrabold text-slate-900">{formatRupiah(totalPendapatan)}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <Banknote size={20} />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Tagihan (Piutang)</p>
                <p className="text-2xl font-extrabold text-slate-900">{formatRupiah(totalPiutang)}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Receipt size={20} />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Transaksi Lunas</p>
                <p className="text-2xl font-extrabold text-slate-900">{totalTransaksiLunas} <span className="text-xs font-bold text-slate-400">Pesanan</span></p>
              </div>
            </motion.div>
          </div>

          {/* Search, Filter & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari ID, Kode Pesanan, atau Nama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 text-xs font-bold text-slate-900 placeholder:text-slate-400 transition-all shadow-2xs"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button 
                onClick={() => showToast("Data diexport!")}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 text-slate-700 rounded-xl hover:bg-stone-50 text-xs font-bold shadow-2xs transition-all flex-1 sm:flex-none justify-center"
              >
                <Download className="w-4 h-4" /> Export
              </button>
              <button 
                onClick={() => setIsPaymentModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-700/20 transition-all flex-1 sm:flex-none justify-center"
              >
                <Plus className="w-4 h-4" /> Catat Bayar
              </button>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="bg-white p-1 rounded-2xl border border-stone-200/80 shadow-2xs inline-flex overflow-x-auto w-full hide-scrollbar">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all flex-1 sm:flex-none ${
                  activeTab === tab
                    ? "bg-indigo-700 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-stone-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF9F6] border-b border-stone-200/80 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    <th className="py-4 px-6">ID Transaksi & Pesanan</th>
                    <th className="py-4 px-6">Pelanggan</th>
                    <th className="py-4 px-6">Total Biaya</th>
                    <th className="py-4 px-6">Telah Dibayar</th>
                    <th className="py-4 px-6">Sisa Tagihan</th>
                    <th className="py-4 px-6">Status & Metode</th>
                    <th className="py-4 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((trx) => {
                      const sisaTagihan = trx.totalAmount - trx.paidAmount;
                      return (
                        <tr key={trx.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-4 px-6">
                            <p className="font-extrabold text-indigo-700 text-xs">{trx.id}</p>
                            <p className="text-[10px] font-bold text-slate-500 mt-1 flex items-center gap-1">
                              <Scissors className="w-3 h-3" /> {trx.orderCode}
                            </p>
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-900">{trx.customerName}</td>
                          <td className="py-4 px-6 font-bold text-slate-700">{formatRupiah(trx.totalAmount)}</td>
                          <td className="py-4 px-6 font-bold text-emerald-600">{formatRupiah(trx.paidAmount)}</td>
                          <td className="py-4 px-6 font-bold text-rose-600">{sisaTagihan > 0 ? formatRupiah(sisaTagihan) : "-"}</td>
                          <td className="py-4 px-6">
                            <div className="flex flex-col gap-1.5 items-start">
                              {getStatusBadge(trx.status)}
                              <span className="text-[10px] text-slate-500 font-bold">{trx.paymentMethod}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {trx.status !== "Lunas" && (
                                <button 
                                  onClick={() => handleLunasi(trx.id)}
                                  className="px-3 py-1.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors"
                                >
                                  Lunasi
                                </button>
                              )}
                              <button 
                                onClick={() => setSelectedReceipt(trx)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-stone-100 rounded-lg transition-colors" 
                                title="Lihat Kwitansi"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
                            <CreditCard size={28} />
                          </div>
                          <p className="font-extrabold text-sm text-slate-900 mb-1">Belum Ada Data Pembayaran</p>
                          <p className="text-xs text-slate-500 font-medium">Silakan catat pembayaran baru dengan tombol "Catat Bayar" di atas.</p>
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
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((trx) => {
                const sisaTagihan = trx.totalAmount - trx.paidAmount;
                return (
                  <motion.div
                    key={trx.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                      <div>
                        <span className="font-extrabold text-indigo-700 text-xs block">{trx.id}</span>
                        <span className="text-[10px] font-bold text-slate-500">Pesanan: {trx.orderCode}</span>
                      </div>
                      {getStatusBadge(trx.status)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{trx.customerName}</h4>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="bg-stone-50 p-2 rounded-xl border border-stone-100">
                          <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Total</p>
                          <p className="text-xs font-bold text-slate-700">{formatRupiah(trx.totalAmount)}</p>
                        </div>
                        <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                          <p className="text-[10px] text-emerald-600/70 font-bold uppercase mb-0.5">Dibayar</p>
                          <p className="text-xs font-bold text-emerald-700">{formatRupiah(trx.paidAmount)}</p>
                        </div>
                      </div>
                      {sisaTagihan > 0 && (
                        <p className="text-[10px] font-bold text-rose-600 mt-2 text-right">Sisa: {formatRupiah(sisaTagihan)}</p>
                      )}
                    </div>
                    <div className="pt-3 flex gap-2 border-t border-stone-100">
                      <button 
                        onClick={() => setSelectedReceipt(trx)}
                        className="flex-1 py-2 text-center text-[10px] font-bold text-slate-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
                      >
                        Kwitansi
                      </button>
                      {trx.status !== "Lunas" && (
                        <button 
                          onClick={() => handleLunasi(trx.id)}
                          className="flex-1 py-2 text-center text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                        >
                          Lunasi
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-16 rounded-2xl border border-stone-200/80 text-center shadow-2xs"
              >
                <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
                  <CreditCard size={28} />
                </div>
                <p className="font-extrabold text-sm text-slate-900 mb-1">Belum Ada Data Pembayaran</p>
                <p className="text-xs text-slate-500 font-medium">Silakan catat pembayaran baru.</p>
              </motion.div>
            )}
          </div>

        </motion.main>

        <footer className="mt-auto border-t border-stone-200/80 bg-[#FAF9F6] py-6 px-4 sm:px-8 text-center text-[10px] font-bold text-slate-400 tracking-wider uppercase">
          &copy; {new Date().getFullYear()} JahitFlow &mdash; Crafted for Artisan Tailors
        </footer>
      </div>

      {/* =====================================================================
          MODAL: CATAT PEMBAYARAN BARU
          ===================================================================== */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsPaymentModalOpen(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 flex flex-col"
            >
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600 rounded-xl">
                    <Banknote className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg">Catat Pembayaran</h3>
                    <p className="text-xs text-slate-400">Input DP atau Pelunasan Pesanan</p>
                  </div>
                </div>
                <button onClick={() => setIsPaymentModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePayment}>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Kode Pesanan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: OR004"
                        value={formData.orderCode}
                        onChange={(e) => setFormData({ ...formData, orderCode: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold uppercase text-slate-900 placeholder:text-slate-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Pelanggan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Nama Pemesan"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold text-slate-900 placeholder:text-slate-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Total Biaya (Rp) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        placeholder="0"
                        value={formData.totalAmount}
                        onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-900 placeholder:text-slate-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dibayar (Rp)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={formData.paidAmount}
                        onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-emerald-700 placeholder:text-emerald-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Metode</label>
                    <select 
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold text-slate-900 bg-white"
                    >
                      <option value="Cash">Cash (Tunai)</option>
                      <option value="Transfer Bank">Transfer Bank</option>
                      <option value="E-Wallet">E-Wallet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Catatan Tambahan</label>
                    <textarea
                      rows={2}
                      placeholder="Catatan..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium text-slate-900 placeholder:text-slate-400 resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-end gap-3 border-t border-stone-100 bg-[#FAF9F6]">
                  <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-stone-100 transition">
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-700 hover:bg-indigo-800 text-white shadow-md shadow-indigo-700/20 transition"
                  >
                    Simpan Transaksi
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          MODAL: LIHAT KWITANSI
          ===================================================================== */}
      <AnimatePresence>
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedReceipt(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 flex flex-col"
            >
              <div className="p-6 bg-indigo-700 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  <span className="font-extrabold text-sm">Kwitansi Pembayaran</span>
                </div>
                <button onClick={() => setSelectedReceipt(null)} className="p-1 text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="text-center border-b border-dashed border-slate-200 pb-4">
                  <h4 className="font-extrabold text-xl text-slate-900">JahitFlow Tailor</h4>
                  <p className="text-xs text-slate-500">Bukti Pembayaran Resmi</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">No. Kwitansi</span>
                    <span className="font-mono font-bold text-slate-900">{selectedReceipt.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Tanggal</span>
                    <span className="font-medium text-slate-900">{selectedReceipt.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Kode Pesanan</span>
                    <span className="font-mono font-bold text-indigo-600">{selectedReceipt.orderCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Nama Pelanggan</span>
                    <span className="font-bold text-slate-900">{selectedReceipt.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Metode</span>
                    <span className="font-semibold text-slate-900">{selectedReceipt.paymentMethod}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl space-y-2 border border-slate-100">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Total Biaya</span>
                    <span className="font-bold text-slate-900">{formatRupiah(selectedReceipt.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Telah Dibayar</span>
                    <span className="font-bold text-emerald-600">{formatRupiah(selectedReceipt.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xs pt-1 border-t border-slate-200">
                    <span className="text-slate-600 font-bold">Sisa Tagihan</span>
                    <span className="font-extrabold text-rose-600">
                      {selectedReceipt.totalAmount - selectedReceipt.paidAmount > 0 
                        ? formatRupiah(selectedReceipt.totalAmount - selectedReceipt.paidAmount)
                        : "LUNAS"}
                    </span>
                  </div>
                </div>

                {selectedReceipt.notes && (
                  <p className="text-[11px] text-slate-500 italic text-center">"{selectedReceipt.notes}"</p>
                )}
              </div>

              <div className="p-4 bg-[#FAF9F6] border-t border-stone-100 flex gap-2">
                <button 
                  onClick={() => { setSelectedReceipt(null); showToast("Mencetak kwitansi..."); }}
                  className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Printer className="w-4 h-4" /> Cetak Kwitansi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}