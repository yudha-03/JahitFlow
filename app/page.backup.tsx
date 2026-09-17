"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Scissors, Users, Ruler, ClipboardList, CreditCard, BarChart3, 
  Search, CheckCircle2, ArrowRight, Clock, ShieldCheck, ChevronRight, 
  Menu, X, Shirt, PackageCheck, FileText, Check, Store, ArrowUpRight,
  LayoutDashboard, Settings, Plus, UserPlus, Receipt, ScissorsLineDashed,
  Sparkles, ShoppingBag, Wallet, Circle
} from "lucide-react";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/StatusBadge";

export default function RedesignedLandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State untuk Interactive Feature Showcase
  const [activeFeature, setActiveFeature] = useState<"pesanan" | "pelanggan" | "ukuran" | "pembayaran" | "laporan" | "tracking">("pesanan");

  // State untuk Live Tracking Interactive Preview
  const [trackingCode, setTrackingCode] = useState("OR001");
  const [isTrackingSearched, setIsTrackingSearched] = useState(true);

  // State untuk Filter Dashboard Preview
  const [dashboardFilter, setDashboardFilter] = useState<"semua" | "dijahit" | "siap">("semua");

  // Detect scroll untuk perbaikan visual navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      
      {/* ==========================================
          1. NAVBAR
      ========================================== */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-[#FBF9F6]/90 backdrop-blur-md border-b border-stone-200/80 shadow-sm py-3.5" 
          : "bg-transparent py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-200 group-hover:bg-indigo-800 transition">
                <Scissors size={20} className="transform -rotate-45" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-tight">
                  Jahit<span className="text-indigo-700">Flow</span>
                </span>
                <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                  Manajemen Usaha Jahit
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 font-semibold text-sm text-slate-600">
              <a href="#beranda" className="hover:text-indigo-700 transition">Beranda</a>
              <a href="#fitur" className="hover:text-indigo-700 transition">Fitur</a>
              <a href="#cara-kerja" className="hover:text-indigo-700 transition">Cara Kerja</a>
              <a href="#manfaat" className="hover:text-indigo-700 transition">Manfaat</a>
            </nav>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link 
                href="/tracking" 
                className="text-xs font-bold text-slate-700 hover:text-indigo-700 hover:bg-stone-100 px-3.5 py-2 rounded-lg transition"
              >
                Lacak Pesanan
              </Link>
              <Link 
                href="/login" 
                className="text-xs font-bold text-slate-700 hover:text-indigo-700 px-3.5 py-2 transition"
              >
                Masuk
              </Link>
              <Link 
                href="/register" 
                className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition active:scale-95 flex items-center gap-1.5"
              >
                <span>Daftar Sebagai Penjahit</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-slate-700 p-2 rounded-lg hover:bg-stone-100" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-4 pb-6 mt-3 space-y-3 shadow-xl animate-fadeIn">
            <a href="#beranda" onClick={() => setIsMobileMenuOpen(false)} className="block font-semibold text-slate-700 py-2">Beranda</a>
            <a href="#fitur" onClick={() => setIsMobileMenuOpen(false)} className="block font-semibold text-slate-700 py-2">Fitur</a>
            <a href="#cara-kerja" onClick={() => setIsMobileMenuOpen(false)} className="block font-semibold text-slate-700 py-2">Cara Kerja</a>
            <a href="#manfaat" onClick={() => setIsMobileMenuOpen(false)} className="block font-semibold text-slate-700 py-2">Manfaat</a>
            <div className="pt-3 border-t border-stone-100 flex flex-col gap-2.5">
              <Link href="/tracking" className="text-center font-bold text-slate-700 py-2.5 bg-stone-100 rounded-xl text-sm">Lacak Pesanan</Link>
              <Link href="/login" className="text-center font-bold text-slate-700 py-2.5 border border-stone-200 rounded-xl text-sm">Masuk</Link>
              <Link href="/register" className="text-center font-bold text-white py-2.5 bg-indigo-700 rounded-xl shadow-sm text-sm">Daftar Sebagai Penjahit</Link>
            </div>
          </div>
        )}
      </header>

      {/* ==========================================
          2. HERO SECTION
      ========================================== */}
      <section id="beranda" className="pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
        {/* Subtle Tailoring Stitches BG Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#4338ca_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Badge Indicator */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              Sistem Operasional Digital Usaha Jahit & Tailor
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Kelola Usaha Jahit <br className="hidden sm:block"/>
              <span className="text-indigo-700">Lebih Mudah.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Digitalisasi pelanggan, ukuran, pesanan, pembayaran, dan proses pengerjaan dalam satu sistem yang sederhana.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link 
                href="/register" 
                className="w-full sm:w-auto bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-7 py-3.5 rounded-xl shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2 active:scale-95 text-sm"
              >
                <span>Daftar Sebagai Penjahit</span>
                <ArrowRight size={16} />
              </Link>
              <Link 
                href="/tracking" 
                className="w-full sm:w-auto bg-white border border-stone-300 hover:border-indigo-300 hover:bg-stone-50 text-slate-700 font-bold px-6 py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-xs"
              >
                <Search size={16} className="text-slate-500" />
                <span>Lacak Pesanan</span>
              </Link>
            </div>

            {/* Supporting Text */}
            <p className="text-xs text-slate-500 pt-1 italic">
              "Dirancang untuk usaha jahit yang ingin mulai beralih dari pencatatan manual ke pengelolaan digital."
            </p>
          </div>

          {/* ==========================================
              HERO VISUAL: Interactive Dashboard Mockup
          ========================================== */}
          <div className="mt-12 md:mt-16 relative max-w-5xl mx-auto">
            
            {/* Subtle Stitch Border Wrap */}
            <div className="p-2 sm:p-3 bg-stone-200/50 rounded-2xl sm:rounded-3xl border border-dashed border-stone-300 relative shadow-xl">
              
              {/* Floating UI Elements */}
              <div className="hidden md:flex absolute -top-5 -left-5 bg-white border border-stone-200 p-3 rounded-2xl shadow-lg items-center gap-3 z-20 animate-bounce duration-1000">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Check size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Pesanan Siap Diambil</p>
                  <p className="text-[10px] text-slate-500">Kebaya Brukat — Ibu Ratna</p>
                </div>
              </div>

              <div className="hidden md:flex absolute -bottom-5 -right-5 bg-white border border-stone-200 p-3 rounded-2xl shadow-lg items-center gap-3 z-20">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Ruler size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Ukuran Tersimpan</p>
                  <p className="text-[10px] text-slate-500">7 Parameter Badan Standar</p>
                </div>
              </div>

              {/* Main Dashboard Window */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                
                {/* Window Header */}
                <div className="bg-stone-100/90 px-4 py-3 border-b border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold text-slate-500 ml-2 hidden sm:inline">JahitFlow — Meja Kerja Digital Penjahit</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-md border border-stone-200 text-[11px] text-slate-700 font-semibold shadow-2xs">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Satria Tailor (Aktif)
                  </div>
                </div>

                {/* Window Body Mockup (Sidebar + Main Content Area) */}
                <div className="flex bg-[#F8FAFC]">
                  {/* Mini Sidebar Mockup (Desktop) */}
                  <div className="hidden md:flex flex-col w-48 bg-white border-r border-slate-200/80 p-3 justify-between shrink-0">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2.5 px-2 py-1.5 border-b border-slate-100 pb-3">
                        <div className="p-1.5 bg-indigo-600 text-white rounded-lg">
                          <Scissors className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-xs text-indigo-950 leading-none">JahitFlow</span>
                          <span className="text-[9px] text-slate-400 font-medium">Satria Tailor</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-[11px] font-semibold">
                        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-indigo-600 text-white shadow-xs">
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          <span>Dashboard</span>
                        </div>
                        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-600 hover:bg-slate-50">
                          <Scissors className="w-3.5 h-3.5 text-slate-400" />
                          <span>Pesanan</span>
                        </div>
                        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-600 hover:bg-slate-50">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>Pelanggan</span>
                        </div>
                        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-600 hover:bg-slate-50">
                          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                          <span>Pembayaran</span>
                        </div>
                        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-600 hover:bg-slate-50">
                          <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                          <span>Laporan</span>
                        </div>
                        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-600 hover:bg-slate-50">
                          <Settings className="w-3.5 h-3.5 text-slate-400" />
                          <span>Pengaturan</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-[10px]">
                      <div className="w-6 h-6 rounded bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">S</div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate leading-none">Satria</p>
                        <p className="text-[9px] text-slate-400 truncate">Pemilik Usaha</p>
                      </div>
                    </div>
                  </div>

                  {/* Main Content Mockup */}
                  <div className="flex-1 p-3.5 sm:p-5 space-y-4 overflow-hidden">
                    
                    {/* Greeting Banner */}
                    <div className="bg-gradient-to-r from-indigo-900 via-indigo-850 to-slate-900 rounded-xl sm:rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-[10px] font-semibold mb-1.5">
                          <Sparkles className="w-3 h-3 text-amber-300" /> Meja Kerja Digital Penjahit
                        </div>
                        <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
                          Selamat datang kembali, Satria 👋
                        </h3>
                        <p className="text-indigo-200 text-xs mt-0.5">
                          Ada <span className="text-white font-bold underline decoration-amber-400">4 pesanan aktif</span> saat ini.
                        </p>
                      </div>
                    </div>

                    {/* Quick Actions Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
                      <div className="p-2.5 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-xs">
                        <div className="p-1 bg-white/20 rounded-lg shrink-0">
                          <Plus className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs leading-none truncate">Pesanan Baru</p>
                          <p className="text-[9px] font-normal text-indigo-200 hidden sm:block mt-0.5">Buat orderan</p>
                        </div>
                      </div>

                      <div className="p-2.5 bg-white border border-slate-200 text-slate-800 rounded-xl font-bold flex items-center gap-2 shadow-2xs">
                        <div className="p-1 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                          <UserPlus className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs leading-none truncate">Pelanggan Baru</p>
                          <p className="text-[9px] font-normal text-slate-400 hidden sm:block mt-0.5">+ Ukuran badan</p>
                        </div>
                      </div>

                      <div className="p-2.5 bg-white border border-slate-200 text-slate-800 rounded-xl font-bold flex items-center gap-2 shadow-2xs">
                        <div className="p-1 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                          <Ruler className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs leading-none truncate">Cari Ukuran</p>
                          <p className="text-[9px] font-normal text-slate-400 hidden sm:block mt-0.5">Cek data cepat</p>
                        </div>
                      </div>

                      <div className="p-2.5 bg-white border border-slate-200 text-slate-800 rounded-xl font-bold flex items-center gap-2 shadow-2xs">
                        <div className="p-1 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                          <Receipt className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs leading-none truncate">Catat Bayar</p>
                          <p className="text-[9px] font-normal text-slate-400 hidden sm:block mt-0.5">Input DP / Lunas</p>
                        </div>
                      </div>
                    </div>

                    {/* 4 Summary Cards Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Pesanan Aktif</span>
                          <div className="p-1 rounded-md bg-indigo-50 text-indigo-600"><ShoppingBag className="w-3 h-3" /></div>
                        </div>
                        <p className="text-lg font-black text-slate-900 leading-tight">4</p>
                        <p className="text-[9px] text-slate-400">Sedang diproses</p>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Sedang Dijahit</span>
                          <div className="p-1 rounded-md bg-blue-50 text-blue-600"><Scissors className="w-3 h-3" /></div>
                        </div>
                        <p className="text-lg font-black text-slate-900 leading-tight">2</p>
                        <p className="text-[9px] text-slate-400">Dalam pengerjaan</p>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Siap Diambil</span>
                          <div className="p-1 rounded-md bg-emerald-50 text-emerald-600"><CheckCircle2 className="w-3 h-3" /></div>
                        </div>
                        <p className="text-lg font-black text-slate-900 leading-tight">1</p>
                        <p className="text-[9px] text-slate-400">Menunggu diambil</p>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Pesanan Selesai</span>
                          <div className="p-1 rounded-md bg-purple-50 text-purple-600"><Sparkles className="w-3 h-3" /></div>
                        </div>
                        <p className="text-lg font-black text-slate-900 leading-tight">1</p>
                        <p className="text-[9px] text-slate-400">Sudah diserahkan</p>
                      </div>
                    </div>

                    {/* Orders Table Preview */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                      <div className="px-3.5 py-2.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/60">
                        <span className="text-xs font-bold text-slate-800">Pesanan Berjalan Terbaru</span>
                        <span className="text-[10px] text-indigo-700 font-bold hover:underline cursor-pointer">Lihat Semua →</span>
                      </div>
                      <div className="divide-y divide-slate-100 text-xs">
                        <div className="p-2.5 flex items-center justify-between hover:bg-slate-50 transition">
                          <div className="flex items-center gap-2.5">
                            <span className="font-extrabold text-indigo-700 text-xs">OR001</span>
                            <div>
                              <p className="font-bold text-slate-900 leading-tight">Ibu Ratna</p>
                              <p className="text-[11px] text-slate-500">Kebaya Brukat Hijau Emerald</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                              <Clock className="w-3 h-3 text-slate-400" /> 28 Ags 2026
                            </span>
                            <OrderStatusBadge status="Dijahit" />
                          </div>
                        </div>

                        <div className="p-2.5 flex items-center justify-between hover:bg-slate-50 transition">
                          <div className="flex items-center gap-2.5">
                            <span className="font-extrabold text-indigo-700 text-xs">OR002</span>
                            <div>
                              <p className="font-bold text-slate-900 leading-tight">Bapak Budi</p>
                              <p className="text-[11px] text-slate-500">Setelan Jas Pria Formal</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                              <Clock className="w-3 h-3 text-slate-400" /> 05 Sep 2026
                            </span>
                            <OrderStatusBadge status="Dipotong" />
                          </div>
                        </div>

                        <div className="p-2.5 flex items-center justify-between hover:bg-slate-50 transition">
                          <div className="flex items-center gap-2.5">
                            <span className="font-extrabold text-indigo-700 text-xs">OR003</span>
                            <div>
                              <p className="font-bold text-slate-900 leading-tight">Mbak Siti</p>
                              <p className="text-[11px] text-slate-500">Gaun Pesta Silk Satin</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                              <Clock className="w-3 h-3 text-slate-400" /> 22 Ags 2026
                            </span>
                            <OrderStatusBadge status="Siap Diambil" />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ==========================================
          3. SECTION MASALAH & TRANSFORMASI (Visual Storytelling)
      ========================================== */}
      <section className="py-20 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
              Masalah Nyata Penjahit
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              Masih Mengandalkan Buku Catatan?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Proses manual sering kali memicu kesalahan kecil yang merugikan waktu dan kepuasan pelanggan Anda.
            </p>
          </div>

          {/* Transformation Visual Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* MANUAL SIDE */}
            <div className="bg-stone-50 rounded-2xl p-6 sm:p-8 border border-stone-200 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 bg-rose-100 text-rose-700 font-bold text-[11px] px-4 py-1.5 rounded-bl-xl border-l border-b border-rose-200">
                Pencatatan Manual
              </div>

              <div>
                <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-xl flex items-center justify-center mb-6">
                  <FileText size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Buku Catatan Kertas</h3>
                
                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600">
                  <li className="flex items-start gap-3">
                    <span className="text-rose-500 font-bold shrink-0">✕</span>
                    <span>Ukuran pelanggan lama sulit ditemukan karena tertumpuk di halaman buku lama.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rose-500 font-bold shrink-0">✕</span>
                    <span>Riwayat pesanan harus dicari satu per satu secara manual.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rose-500 font-bold shrink-0">✕</span>
                    <span>Status pengerjaan baju sering lupa atau membingungkan penjahit.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rose-500 font-bold shrink-0">✕</span>
                    <span>Catatan DP dan pelunasan pembayaran rawan tercecer atau salah hitung.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-stone-200/80 text-xs text-stone-500 italic">
                Kerugian: Berisiko salah potong bahan & waktu terbuang hanya untuk mencari data.
              </div>
            </div>

            {/* DIGITAL SIDE (JahitFlow) */}
            <div className="bg-indigo-900 text-white rounded-2xl p-6 sm:p-8 border border-indigo-950 relative overflow-hidden flex flex-col justify-between shadow-lg">
              <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-bold text-[11px] px-4 py-1.5 rounded-bl-xl">
                Solusi JahitFlow
              </div>

              <div>
                <div className="w-12 h-12 bg-indigo-800 text-indigo-200 rounded-xl flex items-center justify-center mb-6 border border-indigo-700">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Sistem Digital JahitFlow</h3>
                
                <ul className="space-y-3.5 text-xs sm:text-sm text-indigo-100">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Data Pelanggan & Ukuran Tersimpan:</strong> Cari nama pelanggan dalam 2 detik.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Status Pesanan Transparan:</strong> Tahu persis mana yang dipotong & dijahit.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Pencatatan Keuangan Otomatis:</strong> Hitung DP dan sisa tagihan tanpa ribet.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Lacak Pesanan Mandiri:</strong> Pelanggan bisa cek status via HP.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-indigo-800/80 text-xs text-indigo-300">
                Keuntungan: Usaha terasa lebih rapi, profesional, dan hemat waktu setiap hari.
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ==========================================
          4. SECTION FITUR (Interactive Showcase)
      ========================================== */}
      <section id="fitur" className="py-20 bg-[#FBF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Semua yang Dibutuhkan Usaha Jahit
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Pilih fitur di bawah untuk melihat bagaimana JahitFlow mempermudah pekerjaan harian Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Tabs Menu */}
            <div className="lg:col-span-5 space-y-2">
              {[
                { id: "pesanan", label: "Pesanan Jahit", desc: "Pantau antrean dan tenggat waktu pengerjaan", icon: ClipboardList },
                { id: "pelanggan", label: "Data Pelanggan", desc: "Simpan riwayat dan detail kontak lengkap", icon: Users },
                { id: "ukuran", label: "Ukuran Badan", desc: "Parameter ukuran tersimpan rapi tanpa batas", icon: Ruler },
                { id: "pembayaran", label: "Pembayaran & DP", desc: "Kelola uang muka dan pelunasan dengan transparan", icon: CreditCard },
                { id: "laporan", label: "Laporan Usaha", desc: "Rekapitulasi omzet mingguan dan bulanan", icon: BarChart3 },
                { id: "tracking", label: "Tracking Pelanggan", desc: "Fitur lacak status pengerjaan untuk pelanggan", icon: Search },
              ].map((item) => {
                const IconComponent = item.icon;
                const isActive = activeFeature === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveFeature(item.id as any)}
                    className={`w-full text-left p-4 rounded-xl transition flex items-start gap-4 border ${
                      isActive 
                        ? "bg-white border-indigo-200 shadow-md text-slate-900" 
                        : "bg-stone-100/60 border-transparent hover:bg-stone-100 text-slate-600"
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg shrink-0 ${isActive ? "bg-indigo-700 text-white" : "bg-stone-200 text-slate-600"}`}>
                      <IconComponent size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{item.label}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Interactive Live Preview */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm min-h-[380px] flex flex-col justify-center">
              
              {/* Feature 1 Preview: Pesanan */}
              {activeFeature === "pesanan" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                    <h4 className="font-extrabold text-slate-900 text-base">Daftar Antrean Pesanan</h4>
                    <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md font-bold">4 Pesanan Aktif</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-indigo-700 text-xs">OR001</span>
                        <div>
                          <p className="font-bold text-sm text-slate-900">Ibu Ratna — Kebaya Brukat</p>
                          <p className="text-xs text-slate-500">Tenggat Ambil: 28 Ags 2026</p>
                        </div>
                      </div>
                      <OrderStatusBadge status="Dijahit" />
                    </div>

                    <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-indigo-700 text-xs">OR002</span>
                        <div>
                          <p className="font-bold text-sm text-slate-900">Bapak Budi — Jas Formal</p>
                          <p className="text-xs text-slate-500">Tenggat Ambil: 05 Sep 2026</p>
                        </div>
                      </div>
                      <OrderStatusBadge status="Dipotong" />
                    </div>

                    <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-indigo-700 text-xs">OR003</span>
                        <div>
                          <p className="font-bold text-sm text-slate-900">Mbak Siti — Gaun Pesta</p>
                          <p className="text-xs text-slate-500">Tenggat Ambil: 22 Ags 2026</p>
                        </div>
                      </div>
                      <OrderStatusBadge status="Siap Diambil" />
                    </div>
                  </div>
                </div>
              )}

              {/* Feature 2 Preview: Pelanggan */}
              {activeFeature === "pelanggan" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input type="text" readOnly value="Cari nama pelanggan... (Ibu Ratna)" className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-600 focus:outline-none" />
                  </div>
                  <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                          R
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm">Ibu Ratna</h4>
                          <p className="text-xs text-slate-500">WhatsApp: 0812-3456-7890</p>
                          <p className="text-[11px] text-slate-400">Jl. Melati No. 12, Bandung</p>
                        </div>
                      </div>
                      <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">3 Pesanan</span>
                    </div>
                    <div className="pt-2.5 border-t border-indigo-100/80 flex items-center justify-between text-xs">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 size={14} /> 7 Parameter Ukuran Tersimpan
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">Ukur Terakhir: 16 Ags 2026</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Feature 3 Preview: Ukuran (7 Parameter Standar JahitFlow) */}
              {activeFeature === "ukuran" && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                    <h4 className="font-bold text-sm text-slate-900">Parameter Ukuran Badan (Ibu Ratna)</h4>
                    <span className="text-[11px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
                      7 Parameter Standar
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                      <p className="text-[10px] text-slate-500">Lingkar Dada</p>
                      <p className="font-extrabold text-slate-900 text-sm">96 cm</p>
                    </div>
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                      <p className="text-[10px] text-slate-500">Lingkar Pinggang</p>
                      <p className="font-extrabold text-slate-900 text-sm">78 cm</p>
                    </div>
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                      <p className="text-[10px] text-slate-500">Lebar Bahu</p>
                      <p className="font-extrabold text-slate-900 text-sm">39 cm</p>
                    </div>
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                      <p className="text-[10px] text-slate-500">Panjang Baju</p>
                      <p className="font-extrabold text-slate-900 text-sm">65 cm</p>
                    </div>
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                      <p className="text-[10px] text-slate-500">Panjang Lengan</p>
                      <p className="font-extrabold text-slate-900 text-sm">54 cm</p>
                    </div>
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                      <p className="text-[10px] text-slate-500">Panjang Celana</p>
                      <p className="font-extrabold text-slate-900 text-sm">92 cm</p>
                    </div>
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                      <p className="text-[10px] text-slate-500">Lingkar Pinggul</p>
                      <p className="font-extrabold text-slate-900 text-sm">98 cm</p>
                    </div>
                    <div className="bg-indigo-50 p-2.5 rounded-xl border border-indigo-100 flex flex-col justify-center">
                      <p className="text-[10px] text-indigo-600 font-bold">Status Ukuran</p>
                      <p className="font-black text-indigo-900 text-xs">Lengkap ✓</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Feature 4 Preview: Pembayaran */}
              {activeFeature === "pembayaran" && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                    <h4 className="font-bold text-sm text-slate-900">Catatan Transaksi Pembayaran</h4>
                    <span className="text-[11px] font-mono text-slate-400">INV-2026-001</span>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Total Biaya Jahit (Kebaya Brukat):</span>
                      <span className="font-bold text-slate-900">Rp 450.000</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Uang Muka Diterima (DP):</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-700">Rp 200.000</span>
                        <PaymentStatusBadge status="DP" />
                      </div>
                    </div>
                    <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-sm font-bold">
                      <span className="text-slate-800">Sisa Pelunasan:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-rose-600">Rp 250.000</span>
                        <PaymentStatusBadge status="Belum Lunas" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Feature 5 Preview: Laporan */}
              {activeFeature === "laporan" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                    <h4 className="font-bold text-sm text-slate-900">Ringkasan Kinerja Usaha</h4>
                    <span className="text-[11px] font-bold text-indigo-700">Bulan Ini</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <p className="text-[10px] text-slate-500">Total Omzet</p>
                      <p className="font-extrabold text-slate-900 text-sm mt-0.5">Rp 4.5jt</p>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <p className="text-[10px] text-slate-500">Baju Selesai</p>
                      <p className="font-extrabold text-slate-900 text-sm mt-0.5">18 Pcs</p>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <p className="text-[10px] text-slate-500">Sedang Proses</p>
                      <p className="font-extrabold text-slate-900 text-sm mt-0.5">4 Pcs</p>
                    </div>
                  </div>
                  <div className="h-20 bg-stone-50 rounded-xl border border-stone-200 p-2.5 flex items-end justify-between gap-2">
                    <div className="bg-indigo-200 w-full h-[40%] rounded-t" title="Minggu 1" />
                    <div className="bg-indigo-300 w-full h-[65%] rounded-t" title="Minggu 2" />
                    <div className="bg-indigo-400 w-full h-[55%] rounded-t" title="Minggu 3" />
                    <div className="bg-indigo-600 w-full h-[90%] rounded-t" title="Minggu 4" />
                  </div>
                </div>
              )}

              {/* Feature 6 Preview: Tracking */}
              {activeFeature === "tracking" && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="flex justify-between items-center border-b border-stone-200 pb-2 mb-3">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400">Kode: OR001</span>
                        <p className="text-xs font-bold text-slate-900">Kebaya Brukat Hijau (Ibu Ratna)</p>
                      </div>
                      <OrderStatusBadge status="Dijahit" />
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-emerald-700 font-semibold"><CheckCircle2 size={14}/> 1. Pesanan Diterima & Dicatat</div>
                      <div className="flex items-center gap-2 text-emerald-700 font-semibold"><CheckCircle2 size={14}/> 2. Pengukuran & Pemotongan (Dipotong)</div>
                      <div className="flex items-center gap-2 text-blue-700 font-bold"><Scissors size={14}/> 3. Proses Penjahitan (Dijahit) — Berlangsung</div>
                      <div className="flex items-center gap-2 text-slate-400"><Clock size={14}/> 4. Pemeriksaan & Siap Diambil</div>
                      <div className="flex items-center gap-2 text-slate-400"><PackageCheck size={14}/> 5. Selesai & Diserahkan</div>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* ==========================================
          5. SECTION CARA KERJA (Visual Workflow)
      ========================================== */}
      <section id="cara-kerja" className="py-20 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Alur Operasional yang Sederhana
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              6 langkah praktis dari pelanggan datang hingga baju selesai diserahkan.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
            {[
              { step: "01", title: "Pelanggan", desc: "Datang & konsultasi", icon: Users },
              { step: "02", title: "Ukuran", desc: "Ukur & catat data", icon: Ruler },
              { step: "03", title: "Pesanan", desc: "Buat nota pesanan", icon: FileText },
              { step: "04", title: "Proses Jahit", desc: "Potong & jahit", icon: Shirt },
              { step: "05", title: "Pembayaran", desc: "Catat DP & pelunasan", icon: CreditCard },
              { step: "06", title: "Selesai", desc: "Baju diambil", icon: PackageCheck },
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="bg-[#FBF9F6] p-4 sm:p-5 rounded-2xl border border-stone-200 text-center relative group hover:border-indigo-300 transition">
                  <span className="text-[10px] font-extrabold font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 absolute top-3 left-3">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 bg-white text-indigo-700 rounded-xl border border-stone-200 flex items-center justify-center mx-auto mt-4 mb-3 group-hover:bg-indigo-700 group-hover:text-white transition">
                    <IconComp size={18} />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ==========================================
          6. DASHBOARD PREVIEW SECTION
      ========================================== */}
      <section className="py-20 bg-[#FBF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Pantau Seluruh Aktivitas dari Satu Tempat
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Tidak ada lagi cerita lupa status baju pelanggan atau bingung menghitung hasil jahitan mingguan.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-sm">
            
            {/* Filter Interactive Tabs */}
            <div className="flex items-center gap-2 border-b border-stone-100 pb-4 mb-4 overflow-x-auto">
              <span className="text-xs font-bold text-slate-500 mr-2">Filter View:</span>
              <button 
                onClick={() => setDashboardFilter("semua")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  dashboardFilter === "semua" ? "bg-indigo-700 text-white shadow-xs" : "bg-stone-100 text-slate-600 hover:bg-stone-200"
                }`}
              >
                Semua Pesanan (4)
              </button>
              <button 
                onClick={() => setDashboardFilter("dijahit")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  dashboardFilter === "dijahit" ? "bg-indigo-700 text-white shadow-xs" : "bg-stone-100 text-slate-600 hover:bg-stone-200"
                }`}
              >
                Sedang Dijahit (2)
              </button>
              <button 
                onClick={() => setDashboardFilter("siap")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  dashboardFilter === "siap" ? "bg-indigo-700 text-white shadow-xs" : "bg-stone-100 text-slate-600 hover:bg-stone-200"
                }`}
              >
                Siap Diambil (1)
              </button>
            </div>

            {/* Simulated Live Items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(dashboardFilter === "semua" || dashboardFilter === "dijahit") && (
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-indigo-700 text-xs">OR001</span>
                    <OrderStatusBadge status="Dijahit" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Ibu Ratna</h4>
                  <p className="text-xs text-slate-500">Kebaya Brukat Hijau Emerald</p>
                  <p className="text-xs text-indigo-700 font-semibold pt-1">Sisa Tagihan: Rp 250.000</p>
                </div>
              )}

              {(dashboardFilter === "semua" || dashboardFilter === "dijahit") && (
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-indigo-700 text-xs">OR002</span>
                    <OrderStatusBadge status="Dipotong" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Bapak Budi</h4>
                  <p className="text-xs text-slate-500">Setelan Jas Pria Formal Slim Fit</p>
                  <p className="text-xs text-indigo-700 font-semibold pt-1">Sisa Tagihan: Rp 700.000</p>
                </div>
              )}

              {(dashboardFilter === "semua" || dashboardFilter === "siap") && (
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-indigo-700 text-xs">OR003</span>
                    <OrderStatusBadge status="Siap Diambil" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Mbak Siti</h4>
                  <p className="text-xs text-slate-500">Gaun Pesta Silk Satin Elegan</p>
                  <p className="text-xs text-emerald-700 font-semibold pt-1">Lunas (Rp 650.000)</p>
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* ==========================================
          7. TRACKING SECTION FOR CUSTOMERS
      ========================================== */}
      <section className="py-20 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-100">
                Fitur Kemudahan Pelanggan
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                Pelanggan Bisa Mengecek Pesanannya Sendiri
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Pelanggan tidak perlu berulang kali mengirim WhatsApp hanya untuk bertanya <em>"Baju saya sudah selesai belum?"</em>. Cukup beri nomor pesanan, dan mereka bisa mengecek sendiri status pengerjaannya.
              </p>
              
              <div className="pt-2">
                <Link 
                  href="/tracking" 
                  className="inline-flex items-center gap-2 text-indigo-700 font-bold text-sm hover:underline"
                >
                  <span>Coba Fitur Tracking Pelanggan</span>
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>

            {/* Interactive Tracking Simulation Card */}
            <div className="lg:col-span-7 bg-[#FBF9F6] p-6 sm:p-8 rounded-2xl border border-stone-200">
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs mb-6">
                <label className="block text-xs font-bold text-slate-700 mb-2">Simulasi Cek Nomor Pesanan:</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={trackingCode} 
                    onChange={(e) => setTrackingCode(e.target.value)}
                    placeholder="Contoh: OR001"
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                  <button 
                    onClick={() => setIsTrackingSearched(true)}
                    className="bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                  >
                    Lacak
                  </button>
                </div>
              </div>

              {/* Status Timeline Result */}
              {isTrackingSearched && (
                <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-4 animate-fadeIn">
                  <div className="flex justify-between items-start border-b border-stone-100 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400">Kode Pesanan: {trackingCode}</span>
                      <h4 className="font-bold text-sm text-slate-900">Kebaya Brukat Hijau (Ibu Ratna)</h4>
                    </div>
                    <OrderStatusBadge status="Dijahit" />
                  </div>

                  {/* Progress Line */}
                  <div className="space-y-3 relative pl-6 border-l-2 border-stone-200 ml-2 py-1 text-xs">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</div>
                      <p className="font-bold text-slate-800">1. Pesanan Diterima & Bahan Masuk</p>
                      <p className="text-[10px] text-slate-400">15 Agustus 2026</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</div>
                      <p className="font-bold text-slate-800">2. Pengukuran & Pemotongan Pola (Dipotong)</p>
                      <p className="text-[10px] text-slate-400">18 Agustus 2026</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-100" />
                      <p className="font-bold text-blue-800">3. Proses Penjahitan Utama & Furing (Dijahit)</p>
                      <p className="text-[10px] text-blue-600 font-medium">Sedang Dikerjakan oleh Penjahit</p>
                    </div>
                    <div className="relative opacity-50">
                      <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-stone-300" />
                      <p className="font-semibold text-slate-500">4. Pemeriksaan Kualitas & Siap Diambil</p>
                    </div>
                    <div className="relative opacity-50">
                      <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-stone-300" />
                      <p className="font-semibold text-slate-500">5. Selesai & Diserahkan</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* ==========================================
          8. SECTION MANFAAT
      ========================================== */}
      <section id="manfaat" className="py-20 bg-[#FBF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Lebih Rapi. Lebih Mudah. Lebih Terorganisir.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Beralih ke digital memberikan kenyamanan kerja untuk usaha jahit Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center mb-4 font-bold">
                01
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">Data Mudah Ditemukan</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cari data pelanggan dan ukuran lama dalam hitungan detik tanpa harus membongkar lembaran buku tua.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center mb-4 font-bold">
                02
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">Riwayat Ukuran Tersimpan</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Simpan perubahan ukuran badan pelanggan dari waktu ke waktu secara rapi dan sistematis.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center mb-4 font-bold">
                03
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">Pesanan Lebih Terpantau</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ketahui pesanan mana yang harus diprioritaskan agar tidak ada baju yang terlambat diselesaikan.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center mb-4 font-bold">
                04
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">Pencatatan Keuangan Teratur</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pantau sisa tagihan DP dan hitung total pendapatan usaha tanpa pusing melakukan rekap manual.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ==========================================
          9. UNTUK SIAPA (Target Audience)
      ========================================== */}
      <section className="py-16 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Dibuat untuk Usaha Jahit yang Ingin Mulai Digital
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-[#FBF9F6] border border-stone-200">
              <h3 className="font-bold text-base text-slate-900 mb-1">Penjahit Rumahan</h3>
              <p className="text-xs text-slate-600">Cocok untuk usaha jahit perorangan yang ingin mencatat pesanan tetangga atau langganan secara rapi.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#FBF9F6] border border-stone-200">
              <h3 className="font-bold text-base text-slate-900 mb-1">Usaha Jahit Kecil</h3>
              <p className="text-xs text-slate-600">Sangat membantu vermak atau toko jahit yang memiliki 1–5 karyawan pembantu penjahit.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#FBF9F6] border border-stone-200">
              <h3 className="font-bold text-base text-slate-900 mb-1">Tailor & Butik Berkembang</h3>
              <p className="text-xs text-slate-600">Ideal untuk bisnis *fashion custom* yang membutuhkan standar pencatatan ukuran presisi.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ==========================================
          10. PILIH KEBUTUHAN (Clear Choice Section)
      ========================================== */}
      <section className="py-20 bg-[#FBF9F6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Apa yang Ingin Anda Lakukan?
            </h2>
            <p className="text-slate-600 text-sm mt-2">Pilih jalur yang sesuai dengan kebutuhan Anda saat ini.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: Owner */}
            <div className="bg-white p-8 rounded-2xl border-2 border-indigo-200 shadow-sm flex flex-col justify-between hover:border-indigo-600 transition">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold mb-4 text-xl">
                  🧵
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Saya Pemilik / Penjahit</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Kelola data pelanggan, ukuran badan, pesanan jahit, status pengerjaan, dan keuangan usaha Anda dalam satu dashboard.
                </p>
              </div>
              <Link 
                href="/register" 
                className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 px-4 rounded-xl text-xs text-center transition flex items-center justify-center gap-2"
              >
                <span>Daftar Sebagai Penjahit</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Card 2: Customer */}
            <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between hover:border-stone-400 transition">
              <div>
                <div className="w-12 h-12 rounded-xl bg-stone-100 text-slate-700 flex items-center justify-center font-bold mb-4 text-xl">
                  👤
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Saya Pelanggan</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Cek perkembangan proses penjahitan baju Anda secara langsung menggunakan nomor/kode pesanan yang telah diberikan.
                </p>
              </div>
              <Link 
                href="/tracking" 
                className="w-full bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs text-center transition flex items-center justify-center gap-2"
              >
                <span>Lacak Pesanan Saya</span>
                <Search size={14} />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ==========================================
          11. FINAL CLOSING CTA
      ========================================== */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Mulai Kelola Usaha Jahit Secara Digital.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Data lebih rapi. Pesanan lebih mudah dipantau. Pelanggan lebih mudah dilayani.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/register" 
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3.5 rounded-xl transition text-sm flex items-center justify-center gap-2"
            >
              <span>Daftar Sebagai Penjahit</span>
              <ArrowRight size={16} />
            </Link>
            <Link 
              href="/tracking" 
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-7 py-3.5 rounded-xl transition text-sm"
            >
              Lacak Pesanan Pelanggan
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          12. FOOTER
      ========================================== */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-1 items-center md:items-start">
            <div className="flex items-center gap-2 text-white font-extrabold text-base">
              <Scissors size={18} className="text-indigo-500 transform -rotate-45" />
              <span>JahitFlow</span>
            </div>
            <p className="text-slate-500 text-[11px]">Sistem manajemen operasional untuk usaha jahit Indonesia.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-semibold">
            <a href="#beranda" className="hover:text-white transition">Beranda</a>
            <a href="#fitur" className="hover:text-white transition">Fitur</a>
            <a href="#cara-kerja" className="hover:text-white transition">Cara Kerja</a>
            <Link href="/tracking" className="hover:text-white transition">Lacak Pesanan</Link>
            <Link href="/login" className="hover:text-white transition">Masuk</Link>
          </div>

          <p className="text-slate-600 text-[11px]">© 2026 JahitFlow. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}