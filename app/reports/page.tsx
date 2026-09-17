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
  Bell,
  Menu,
  X,
  LogOut,
  Download,
  CalendarDays,
  TrendingUp,
  Activity,
  CheckCircle2,
  ChevronDown,
  Home,
  Wallet,
  FileSpreadsheet,
  Layers,
  ArrowUpRight,
  Info
} from "lucide-react";

// ============================================================================
// DATA & KONFIGURASI PERIODE
// ============================================================================

const REPORT_PERIODS = ["Bulan Ini", "Bulan Lalu", "Tahun Ini", "Semua Waktu"];

// Data Grafik Pendapatan Bulanan (Dikosongkan sesuai preferensi tanpa dummy data)
const REVENUE_DATA: { month: string; amount: number; height: string }[] = [];

// Data Jahitan Terlaris (Dikosongkan)
const TOP_ITEMS: { name: string; count: number; percentage: number; color: string }[] = [];

const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(angka);
};

// ============================================================================
// MAIN REPORTS COMPONENT
// ============================================================================

export default function ReportsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePeriod, setActivePeriod] = useState(REPORT_PERIODS[0]);
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
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
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight truncate">
                Laporan & Analitik
              </h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block truncate">
                Pantau performa bisnis, statistik pesanan, dan tren pendapatan.
              </p>
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
              <span className="text-xs font-extrabold text-slate-800 hidden md:inline-block">
                Satria Tailor
              </span>
            </div>
          </div>
        </motion.header>

        {/* Reports Content */}
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto"
        >
          
          {/* Top Actions: Period Filter & Export */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="relative w-full sm:w-auto">
              <button 
                onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
                className="flex items-center justify-between gap-2.5 px-3.5 py-2 bg-[#FAF9F6] border border-stone-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-stone-100 transition-colors w-full sm:w-auto shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-3.5 h-3.5 text-indigo-700" />
                  <span>Periode: <span className="text-indigo-700">{activePeriod}</span></span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>
              
              {/* Dropdown Menu */}
              <AnimatePresence>
                {isPeriodDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white border border-stone-200 rounded-2xl shadow-xl z-20 overflow-hidden py-1"
                  >
                    {REPORT_PERIODS.map((period) => (
                      <button
                        key={period}
                        onClick={() => { setActivePeriod(period); setIsPeriodDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors ${
                          activePeriod === period 
                            ? "bg-indigo-50 text-indigo-700 font-extrabold" 
                            : "text-slate-600 hover:bg-stone-50"
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button 
                onClick={() => showToast("Mengekspor laporan ke format Excel...")}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-stone-50 text-slate-700 border border-stone-200 rounded-xl text-xs font-bold transition shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export Excel</span>
              </button>
              <button 
                onClick={() => showToast("Laporan sedang disiapkan dalam format PDF...")}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-700/20 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PDF</span>
              </button>
            </div>
          </div>

          {/* Key Performance Indicators (KPIs) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Pendapatan */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Total Pendapatan
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs">
                  <Wallet size={16} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 mb-1">Rp 0</p>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                <span className="inline-block w-2 h-2 rounded-full bg-slate-300" />
                <span>Belum ada data pemasukan</span>
              </div>
            </motion.div>

            {/* Pesanan Selesai */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Pesanan Selesai
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-2xs">
                  <Scissors size={16} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 mb-1">
                0 <span className="text-xs font-semibold text-slate-400">Jahitan</span>
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                <span className="inline-block w-2 h-2 rounded-full bg-slate-300" />
                <span>Belum ada pesanan</span>
              </div>
            </motion.div>

            {/* Total Piutang */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Total Piutang
                </span>
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shadow-2xs">
                  <CreditCard size={16} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 mb-1">Rp 0</p>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                <span className="inline-block w-2 h-2 rounded-full bg-slate-300" />
                <span>Belum ada piutang aktif</span>
              </div>
            </motion.div>

            {/* Pelanggan Baru */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Pelanggan Baru
                </span>
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-2xs">
                  <Users size={16} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 mb-1">
                0 <span className="text-xs font-semibold text-slate-400">Orang</span>
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                <span className="inline-block w-2 h-2 rounded-full bg-slate-300" />
                <span>Belum ada pelanggan baru</span>
              </div>
            </motion.div>
          </div>

          {/* Charts & Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Grafik Bar Pendapatan */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs lg:col-span-2 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                    Grafik Tren Pendapatan
                  </h2>
                  <p className="text-xs font-medium text-slate-400">
                    Visualisasi arus kas masuk berdasarkan periode waktu
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                  <Activity className="w-3.5 h-3.5" />
                  {activePeriod}
                </span>
              </div>
              
              {/* Chart Content / Empty State */}
              <div className="relative flex-1 min-h-[260px] flex items-end justify-between gap-2 sm:gap-4 border-b border-stone-200 pb-2 pt-10">
                {/* Horizontal Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pb-2 pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-full border-t border-stone-100 border-dashed flex-1" />
                  ))}
                </div>

                {/* Bars or Empty State */}
                {REVENUE_DATA.length > 0 ? (
                  REVENUE_DATA.map((data, index) => (
                    <div key={index} className="relative flex flex-col items-center justify-end h-full w-full group z-10">
                      {/* Tooltip on Hover */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-lg whitespace-nowrap pointer-events-none">
                        {formatRupiah(data.amount)}
                      </div>
                      {/* The Bar */}
                      <div 
                        className={`w-full max-w-[40px] rounded-t-md transition-all duration-500 hover:opacity-80 ${index === REVENUE_DATA.length - 1 ? 'bg-indigo-700' : 'bg-indigo-200'}`}
                        style={{ height: data.height }}
                      />
                      {/* Label */}
                      <span className="text-[10px] sm:text-xs font-bold text-slate-500 mt-3">{data.month}</span>
                    </div>
                  ))
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] border border-stone-200/80 flex items-center justify-center text-slate-400 mb-3 shadow-2xs">
                      <BarChart3 className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <p className="text-xs font-bold text-slate-700 mb-1">
                      Belum Ada Data Transaksi Pendapatan
                    </p>
                    <p className="text-[11px] text-slate-400 max-w-xs">
                      Data grafik akan terisi secara otomatis setelah pencatatan pesanan dan pembayaran mulai aktif.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  Statistik dihitung berdasarkan pembayaran aktual
                </span>
                <span className="font-bold text-slate-500">IDR (Rupiah)</span>
              </div>
            </div>

            {/* Statistik Layanan / Jahitan Terlaris */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                  Layanan Terlaris
                </h2>
                <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Scissors size={14} />
                </div>
              </div>
              <p className="text-xs font-medium text-slate-400 mb-6">
                Proporsi jenis jahitan yang paling diminati pelanggan
              </p>
              
              <div className="space-y-5 flex-1 flex flex-col justify-center">
                {TOP_ITEMS.length > 0 ? (
                  TOP_ITEMS.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold text-slate-800">{item.name}</span>
                        <span className="text-[11px] font-extrabold text-slate-500">{item.count} pesanan</span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full ${item.color}`} 
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-8">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] border border-stone-200/80 flex items-center justify-center text-slate-400 mb-3 shadow-2xs">
                      <Layers className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <p className="text-xs font-bold text-slate-700 mb-1">
                      Belum Ada Kategori Layanan
                    </p>
                    <p className="text-[11px] text-slate-400 max-w-[220px]">
                      Kategori busana dan reparasi populer akan ditampilkan di sini.
                    </p>
                  </div>
                )}
              </div>

              <Link
                href="/orders"
                className="mt-6 w-full py-2.5 bg-[#FAF9F6] hover:bg-stone-100 text-slate-700 rounded-xl text-xs font-bold border border-stone-200 transition-colors text-center shadow-2xs flex items-center justify-center gap-1.5"
              >
                <span>Kelola Pesanan</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>

        </motion.main>

        {/* Footer Atelier Style */}
        <footer className="mt-auto border-t border-stone-200/80 bg-white py-6 px-4 sm:px-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} JahitFlow Atelier &bull; Hak Cipta Dilindungi.
        </footer>
      </div>
    </div>
  );
}