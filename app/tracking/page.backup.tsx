"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link"; // Tambahan import Link
import {
  Search,
  CheckCircle2,
  Clock,
  Phone,
  Scissors,
  ClipboardList,
  Ruler,
  Shirt,
  Sparkles,
  PackageCheck,
  AlertCircle,
  Copy,
  Check,
  ArrowLeft,
  Calendar,
  User,
  Tag,
  MessageSquareText,
  RefreshCw,
  Home, // Tambahan icon Home
  LucideIcon,
} from "lucide-react";

// --- TYPE DEFINITIONS ---
interface StepHistory {
  date: string;
  note?: string;
}

interface Order {
  id: string;
  customerName: string;
  itemType: string;
  currentStep: number;
  statusText: string;
  estimateDate: string;
  daysRemaining?: string;
  tailorPhone: string;
  details: string;
  priceTotal: string;
  dpAmount: string;
  stepHistory: Record<number, StepHistory>;
}

interface TimelineStep {
  title: string;
  description: string;
  icon: LucideIcon;
}

type SearchState = "idle" | "loading" | "success" | "error";

// --- DUMMY DATA ---
const DUMMY_ORDERS: Record<string, Order> = {
  OR001: {
    id: "OR001",
    customerName: "Ibu Ratna",
    itemType: "Kebaya Brukat Hijau Emerald",
    currentStep: 3,
    statusText: "Sedang Dijahit",
    estimateDate: "28 Agustus 2026",
    daysRemaining: "4 Hari Lagi",
    tailorPhone: "6281234567890",
    details: "Model kerah V-neck, lengan panjang 3/4, furing katun hero, payet bagian dada.",
    priceTotal: "Rp 450.000",
    dpAmount: "Rp 200.000 (Lunas DP)",
    stepHistory: {
      0: { date: "15 Aug 2026, 10:30", note: "Pesanan masuk & kain diterima." },
      1: { date: "16 Aug 2026, 14:00", note: "Ukuran badan sudah dicatat lengkap." },
      2: { date: "18 Aug 2026, 09:15", note: "Pola dipotong sesuai model V-neck." },
      3: { date: "20 Aug 2026, 11:00", note: "Proses jahit utama & pemasangan furing." },
    },
  },
  OR002: {
    id: "OR002",
    customerName: "Bapak Budi",
    itemType: "Setelan Jas Pria Formal",
    currentStep: 1,
    statusText: "Pengukuran & Fiting",
    estimateDate: "5 September 2026",
    daysRemaining: "12 Hari Lagi",
    tailorPhone: "6281234567890",
    details: "Bahan Semi Wool Italian Black, model slim fit 2 tombol, celana pipa lurus.",
    priceTotal: "Rp 1.200.000",
    dpAmount: "Rp 500.000 (Lunas DP)",
    stepHistory: {
      0: { date: "22 Aug 2026, 16:45", note: "Pesanan terdaftar di sistem." },
      1: { date: "24 Aug 2026, 09:00", note: "Jadwal fitting pertama disepakati." },
    },
  },
  OR003: {
    id: "OR003",
    customerName: "Mbak Siti",
    itemType: "Gaun Pesta Silk Satin",
    currentStep: 5,
    statusText: "Siap Diambil",
    estimateDate: "Selesai",
    daysRemaining: "Siap Ambil",
    tailorPhone: "6281234567890",
    details: "Gaun satin silk moca, A-line cut, resleting jepang belakang.",
    priceTotal: "Rp 650.000",
    dpAmount: "Rp 650.000 (LUNAS)",
    stepHistory: {
      0: { date: "01 Aug 2026, 11:00", note: "Pesanan diterima." },
      1: { date: "02 Aug 2026, 13:20", note: "Pengukuran selesai." },
      2: { date: "05 Aug 2026, 10:00", note: "Pemotongan kain selesai." },
      3: { date: "12 Aug 2026, 16:00", note: "Penjahitan & jelujur selesai." },
      4: { date: "18 Aug 2026, 15:30", note: "Finishing & pembersihan sisa benang." },
      5: { date: "23 Aug 2026, 09:00", note: "Sudah di-steam & siap diambil pelanggan." },
    },
  },
};

const TIMELINE_STEPS: TimelineStep[] = [
  { title: "Pesanan Masuk", description: "Kain & sampel diterima", icon: ClipboardList },
  { title: "Pengukuran", description: "Pencatatan ukuran & model", icon: Ruler },
  { title: "Pemotongan", description: "Potong kain sesuai pola", icon: Scissors },
  { title: "Penjahitan", description: "Proses jahit & perakitan", icon: Shirt },
  { title: "Finishing", description: "Payet, steam & quality control", icon: Sparkles },
  { title: "Siap Diambil", description: "Siap diserahterimakan", icon: PackageCheck },
];

export default function TrackingPage(): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [showIntro, setShowIntro] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  const executeSearch = useCallback((code: string) => {
    const cleanCode = code.toUpperCase().trim();
    if (!cleanCode) return;

    setSearchQuery(cleanCode);
    setSearchState("loading");

    setTimeout(() => {
      const result = DUMMY_ORDERS[cleanCode];
      if (result) {
        setOrderData(result);
        setSearchState("success");
      } else {
        setOrderData(null);
        setSearchState("error");
      }
    }, 500);
  }, []);

  const handleSearchForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    executeSearch(searchQuery);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setOrderData(null);
    setSearchState("idle");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* OPENING ANIMATION / SPLASH SCREEN */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-indigo-600"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center gap-3"
            >
              <motion.div
                initial={{ rotate: -15, scale: 0.7 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center"
              >
                <Scissors className="w-8 h-8 text-white" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-white font-bold text-xl tracking-tight"
              >
                JahitFlow
              </motion.span>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.35, duration: 0.9, ease: "easeInOut" }}
                className="h-0.5 w-24 bg-white/60 rounded-full origin-left"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* BAGIAN KIRI: Tombol Beranda & Logo */}
          <div className="flex items-center gap-3 md:gap-4">
            <Link 
              href="/" 
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Beranda</span>
            </Link>

            <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>

            <div className="flex items-center gap-2.5 text-indigo-600 font-bold text-xl tracking-tight">
              <div className="p-1.5 sm:p-2 bg-indigo-50 rounded-xl text-indigo-600">
                <Scissors className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="hidden xs:inline">JahitFlow</span>
            </div>
          </div>

          {/* BAGIAN KANAN: Tombol Aksi */}
          <div className="flex items-center gap-3">
            {searchState === "success" && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Cari Lain</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-4xl mx-auto px-4 py-8 md:py-12"
      >
        {/* HERO HEADER */}
        <div className="text-center mb-8 md:mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Tag className="w-3.5 h-3.5" /> Portal Pelanggan
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            Lacak Progress Jahitan
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-lg mx-auto">
            Pantau setiap tahapan pengerjaan pakaian Anda secara real-time dan transparan.
          </p>

          {/* INPUT FORM */}
          <form onSubmit={handleSearchForm} className="mt-8 max-w-xl mx-auto">
            <div className="relative flex flex-col sm:flex-row gap-2.5 p-2 bg-white rounded-2xl shadow-lg shadow-indigo-100/50 border border-slate-200/80 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
              <div className="relative flex-1 flex items-center pl-3">
                <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Masukkan Nomor Nota (Contoh: OR001)"
                  className="w-full h-11 bg-transparent text-slate-900 placeholder:text-slate-400 font-semibold uppercase text-base outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={searchState === "loading"}
                className="h-12 px-7 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:bg-indigo-400 shrink-0"
              >
                {searchState === "loading" ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <RefreshCw className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <span>Lacak Sekarang</span>
                )}
              </button>
            </div>

            {/* QUICK DEMO BADGES */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500">
              <span>Atau coba sampel nota:</span>
              {["OR001", "OR002", "OR003"].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => executeSearch(code)}
                  className="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-md font-mono font-bold transition-colors"
                >
                  {code}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* RESULTS CONTAINER */}
        <div className="min-h-[350px]">
          <AnimatePresence mode="wait">
            {/* ERROR STATE */}
            {searchState === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border border-red-100 p-8 md:p-12 text-center shadow-sm max-w-xl mx-auto"
              >
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Nomor Nota Tidak Ditemukan
                </h3>
                <p className="text-slate-600 mb-6 text-sm md:text-base leading-relaxed">
                  Kode <strong>"{searchQuery}"</strong> belum terdaftar. Pastikan tidak ada salah ketik atau hubungi penjahit jika nomor nota belum masuk ke sistem.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" /> Kembali & Coba Lagi
                </button>
              </motion.div>
            )}

            {/* SUCCESS STATE */}
            {searchState === "success" && orderData && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-6"
              >
                {/* SUMMARY HEADER CARD */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-mono font-bold rounded-lg text-xs tracking-wider">
                          {orderData.id}
                        </span>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-medium rounded-lg text-xs flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> {orderData.dpAmount}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                        {orderData.itemType}
                      </h2>
                      <p className="text-slate-500 font-medium text-sm mt-1 flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" /> Pemilik: <strong className="text-slate-800">{orderData.customerName}</strong>
                      </p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 min-w-[200px] text-left md:text-right">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Estimasi Selesai
                      </span>
                      <p className="text-lg font-bold text-slate-900 flex items-center gap-2 md:justify-end">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        {orderData.estimateDate}
                      </p>
                      {orderData.daysRemaining && (
                        <span className="inline-block text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md mt-1">
                          {orderData.daysRemaining}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CURRENT STATUS HIGHLIGHT */}
                  <div className="pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                        Status Pengerjaan Saat Ini
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600" />
                        </span>
                        <h3 className="text-xl md:text-2xl font-bold text-indigo-600">
                          {orderData.statusText}
                        </h3>
                      </div>
                    </div>

                    {/* SHARE & ACTION BUTTONS */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="flex-1 md:flex-initial px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        <span>{copied ? "Tersalin!" : "Salin Link"}</span>
                      </button>

                      <a
                        href={`https://wa.me/${orderData.tailorPhone}?text=Halo%20Admin,%20saya%20${encodeURIComponent(
                          orderData.customerName
                        )}%20ingin%20bertanya%20mengenai%20status%20pesanan%20${orderData.id}%20(${encodeURIComponent(
                          orderData.itemType
                        )}).`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 md:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Hubungi Penjahit</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* TIMELINE PROGRESS SECTION */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm">
                  <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-600" /> Tahapan Pengerjaan
                  </h4>

                  {/* DESKTOP HORIZONTAL TIMELINE */}
                  <div className="hidden md:block relative my-8">
                    <div className="absolute top-6 left-8 right-8 h-1 bg-slate-100 -z-0 rounded-full" />
                    <div
                      className="absolute top-6 left-8 h-1 bg-indigo-600 -z-0 transition-all duration-700 rounded-full"
                      style={{
                        width: `${(orderData.currentStep / (TIMELINE_STEPS.length - 1)) * 88}%`,
                      }}
                    />

                    <div className="flex justify-between items-start relative z-10">
                      {TIMELINE_STEPS.map((step, index) => {
                        const isDone = index < orderData.currentStep;
                        const isActive = index === orderData.currentStep;
                        const StepIcon = step.icon;
                        const history = orderData.stepHistory[index];

                        return (
                          <div key={step.title} className="flex flex-col items-center w-32 text-center">
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 mb-3 transition-all ${
                                isDone
                                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200"
                                  : isActive
                                  ? "bg-white border-indigo-600 text-indigo-600 ring-4 ring-indigo-100"
                                  : "bg-white border-slate-200 text-slate-300"
                              }`}
                            >
                              {isDone ? <CheckCircle2 className="w-6 h-6" /> : <StepIcon className="w-5 h-5" />}
                            </div>

                            <span
                              className={`text-sm font-bold block ${
                                isDone || isActive ? "text-slate-900" : "text-slate-400"
                              }`}
                            >
                              {step.title}
                            </span>

                            {history?.date && (
                              <span className="text-[11px] font-medium text-slate-400 mt-1 block">
                                {history.date.split(",")[0]}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* MOBILE & DETAILED VERTICAL TIMELINE */}
                  <div className="space-y-6 md:mt-10 relative">
                    <div className="absolute top-4 bottom-4 left-6 w-0.5 bg-slate-200 md:hidden" />

                    {TIMELINE_STEPS.map((step, index) => {
                      const isDone = index < orderData.currentStep;
                      const isActive = index === orderData.currentStep;
                      const isUpcoming = index > orderData.currentStep;
                      const StepIcon = step.icon;
                      const history = orderData.stepHistory[index];

                      return (
                        <div
                          key={step.title}
                          className={`relative flex items-start gap-4 p-4 rounded-2xl transition-all ${
                            isActive
                              ? "bg-indigo-50/60 border border-indigo-100"
                              : "bg-transparent"
                          }`}
                        >
                          {/* Step Icon */}
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 z-10 border ${
                              isDone
                                ? "bg-indigo-600 border-indigo-600 text-white"
                                : isActive
                                ? "bg-white border-indigo-600 text-indigo-600 font-bold ring-2 ring-indigo-200"
                                : "bg-white border-slate-200 text-slate-300"
                            }`}
                          >
                            {isDone ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                          </div>

                          {/* Step Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <h5
                                className={`text-base font-bold ${
                                  isUpcoming ? "text-slate-400" : "text-slate-900"
                                }`}
                              >
                                {step.title}
                              </h5>
                              {history?.date && (
                                <span className="text-xs text-slate-400 font-mono">
                                  {history.date}
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>

                            {history?.note && (
                              <div className="mt-2.5 p-3 bg-white rounded-xl border border-slate-200/60 text-xs text-slate-700 flex items-start gap-2">
                                <MessageSquareText className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                                <span>{history.note}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ADDITIONAL SPECIFICATIONS CARD */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm">
                  <h4 className="text-lg font-bold text-slate-900 mb-4">Detail Pakaian & Catatan Model</h4>
                  <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {orderData.details}
                  </p>
                </div>
              </motion.div>
            )}

            {/* IDLE GUIDE STATE */}
            {searchState === "idle" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6"
              >
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-extrabold text-lg mx-auto mb-4">
                    1
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">Cek Nota Pembayaran</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Lihat kode nota yang tertera pada bagian atas struk pembayaran atau pesan WhatsApp penjahit.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-extrabold text-lg mx-auto mb-4">
                    2
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">Masukkan Kode</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Ketik kode nota tersebut ke dalam kolom di atas dan tekan tombol pelacakan.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-extrabold text-lg mx-auto mb-4">
                    3
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">Pantau Real-Time</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Dapatkan pembaruan langsung mulai dari pengukuran, penjahitan, hingga pakaian siap diambil.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
}