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
  Home // <-- Tambahan icon Home
} from "lucide-react"; //[cite: 8]

// ============================================================================
// DUMMY DATA UNTUK LAPORAN
// ============================================================================

const REPORT_PERIODS = ["Agustus 2026", "Juli 2026", "Tahun Ini", "Semua Waktu"]; //[cite: 8]

// Data Grafik Pendapatan Bulanan (Contoh mock data)
const REVENUE_DATA: { month: string; amount: number; height: string }[] = []; //[cite: 8]

// Data Jahitan Terlaris
const TOP_ITEMS: { name: string; count: number; percentage: number; color: string }[] = []; //[cite: 8]

const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(angka);
}; //[cite: 8]

// ============================================================================
// MAIN REPORTS COMPONENT
// ============================================================================

export default function ReportsPage() {
  const pathname = "/reports";
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePeriod, setActivePeriod] = useState(REPORT_PERIODS[0]);
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }; //[cite: 8]

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
  ]; //[cite: 8]

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Toast Notification */}
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

      {/* Sidebar Desktop & Mobile Drawer */}
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
        
        {/* Header Bar */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-4 flex items-center justify-between gap-2 sm:gap-4 overflow-hidden"
        >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden focus:outline-none shrink-0">
              <Menu className="w-6 h-6" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight truncate">
                <span className="sm:hidden">Laporan</span>
                <span className="hidden sm:inline">Laporan & Analitik</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium hidden sm:block truncate">Pantau performa bisnis dan statistik pesanan jahitan.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* DITAMBAHKAN: Tombol Kembali ke Beranda */}
            <Link
              href="/"
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 hover:border-indigo-200 transition-all text-xs sm:text-sm font-bold shadow-sm shrink-0"
            >
              <Home className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Kembali ke Beranda</span>
              <span className="sm:hidden">Beranda</span>
            </Link>

            <button type="button" className="relative p-2 sm:p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors focus:outline-none shrink-0">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 sm:gap-2.5 pl-2 border-l border-slate-200 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">S</div>
              <span className="text-sm font-bold text-slate-800 hidden md:inline-block">Satria Tailor</span>
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="relative">
              <button 
                onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors w-full sm:w-auto"
              >
                <CalendarDays className="w-4 h-4 text-indigo-600" />
                Periode: {activePeriod}
                <ChevronDown className="w-4 h-4 text-slate-400 ml-2" />
              </button>
              
              {/* Dropdown Menu */}
              {isPeriodDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-10 overflow-hidden">
                  {REPORT_PERIODS.map((period) => (
                    <button
                      key={period}
                      onClick={() => { setActivePeriod(period); setIsPeriodDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors ${
                        activePeriod === period ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={() => showToast("Laporan sedang diunduh (PDF)...")}
              className="flex items-center justify-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/20 transition-all w-full sm:w-auto"
            >
              <Download className="w-4 h-4" /> Unduh PDF
            </button>
          </div>

          {/* Key Performance Indicators (KPIs) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity className="w-16 h-16 text-indigo-600" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Pendapatan</p>
              <p className="text-2xl font-extrabold text-slate-900 mb-2">Rp 0</p>
              <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Belum ada data pemasukan
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Scissors className="w-16 h-16 text-amber-600" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Pesanan Selesai</p>
              <p className="text-2xl font-extrabold text-slate-900 mb-2">0 <span className="text-sm font-medium text-slate-500">Jahitan</span></p>
              <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Belum ada data pesanan
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <CreditCard className="w-16 h-16 text-rose-600" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Piutang (Belum Lunas)</p>
              <p className="text-2xl font-extrabold text-slate-900 mb-2">Rp 0</p>
              <p className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                Belum ada piutang
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users className="w-16 h-16 text-emerald-600" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Pelanggan Baru</p>
              <p className="text-2xl font-extrabold text-slate-900 mb-2">0 <span className="text-sm font-medium text-slate-500">Orang</span></p>
              <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Belum ada pelanggan baru
              </p>
            </div>
          </div>

          {/* Charts & Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Grafik Bar Pendapatan */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-2 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Grafik Pendapatan</h3>
                  <p className="text-xs font-medium text-slate-500">Tren pemasukan kas selama 8 bulan terakhir</p>
                </div>
              </div>
              
              {/* CSS-based Mock Bar Chart */}
              <div className="relative flex-1 min-h-[250px] mt-4 flex items-end justify-between gap-2 sm:gap-4 border-b border-slate-200 pb-2 pt-10">
                {/* Horizontal Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pb-2 pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-full border-t border-slate-100 border-dashed flex-1"></div>
                  ))}
                </div>

                {/* Bars */}
                {REVENUE_DATA.length > 0 ? REVENUE_DATA.map((data, index) => (
                  <div key={index} className="relative flex flex-col items-center justify-end h-full w-full group z-10">
                    {/* Tooltip on Hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-lg whitespace-nowrap pointer-events-none">
                      {formatRupiah(data.amount)}
                    </div>
                    {/* The Bar */}
                    <div 
                      className={`w-full max-w-[40px] rounded-t-md transition-all duration-500 hover:opacity-80 ${index === REVENUE_DATA.length - 1 ? 'bg-indigo-600' : 'bg-indigo-200'}`}
                      style={{ height: data.height }}
                    ></div>
                    {/* Label */}
                    <span className="text-[10px] sm:text-xs font-bold text-slate-500 mt-3">{data.month}</span>
                  </div>
                )) : (
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-slate-400">Belum ada data pendapatan</div>
                )}
              </div>
            </div>

            {/* Statistik Layanan / Jahitan Terlaris */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col">
              <h3 className="text-base font-extrabold text-slate-900 mb-1">Layanan Terlaris</h3>
              <p className="text-xs font-medium text-slate-500 mb-6">Persentase jenis jahitan yang paling sering dipesan.</p>
              
              <div className="space-y-5 flex-1">
                {TOP_ITEMS.length > 0 ? TOP_ITEMS.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-800">{item.name}</span>
                      <span className="text-xs font-extrabold text-slate-500">{item.count} order</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-2.5 rounded-full ${item.color}`} 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )) : (
                  <div className="flex-1 flex items-center justify-center text-sm font-medium text-slate-400 py-10">Belum ada data layanan</div>
                )}
              </div>

              <button className="mt-6 w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-bold border border-slate-200 transition-colors">
                Lihat Detail Layanan
              </button>
            </div>
          </div>

        </motion.main>

        <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 px-4 sm:px-8 text-center text-xs font-medium text-slate-400">
          &copy; {new Date().getFullYear()} JahitFlow. Hak Cipta Dilindungi.
        </footer>
      </div>
    </div>
  );
}