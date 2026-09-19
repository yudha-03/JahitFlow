"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { api } from "@/lib/api";
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
  Home,
  LucideIcon,
  ShieldCheck,
  ArrowRight
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
    const timer = setTimeout(() => setShowIntro(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const executeSearch = useCallback(async (code: string) => {
    const cleanCode = code.toUpperCase().trim();
    if (!cleanCode) return;

    setSearchQuery(cleanCode);
    setSearchState("loading");

    try {
      // 1. Coba request data pelacakan dari Backend API
      const liveData = await api.orders.track(cleanCode);
      if (liveData && (liveData.code || liveData.order)) {
        const orderInfo = liveData.order || liveData;
        const totalAmount = Number(orderInfo.totalAmount ?? orderInfo.price) || 0;
        const paidAmount = Number(orderInfo.paidAmount ?? orderInfo.paid) || 0;
        const remaining = Math.max(0, totalAmount - paidAmount);
        const dpText =
          remaining === 0
            ? `Rp ${paidAmount.toLocaleString("id-ID")} (LUNAS)`
            : `Rp ${paidAmount.toLocaleString("id-ID")} (Sisa Rp ${remaining.toLocaleString("id-ID")})`;

        const statusMap: Record<string, number> = {
          "Belum Dikerjakan": 0,
          "Dipotong": 2,
          "Dijahit": 3,
          "Siap Diambil": 5,
          "Selesai": 5,
        };

        const currentStep =
          typeof liveData.currentStep === "number"
            ? liveData.currentStep
            : statusMap[orderInfo.status] ?? 2;

        const stepHistory: Record<number, StepHistory> = {};
        if (Array.isArray(liveData.timeline)) {
          liveData.timeline.forEach((t: any, idx: number) => {
            const stepIdx = typeof t.step === "number" ? t.step - 1 : idx;
            if (t.isCompleted || t.isActive || t.isDone) {
              stepHistory[stepIdx] = {
                date: t.date || (t.isCompleted ? "Selesai" : "Sedang diproses"),
                note: t.desc || t.note,
              };
            }
          });
        }

        const result: Order = {
          id: orderInfo.code || orderInfo.orderNumber || cleanCode,
          customerName: orderInfo.customerName || "Pelanggan",
          itemType: orderInfo.itemName || orderInfo.garmentType || "Busana Jahitan",
          currentStep: Math.min(5, Math.max(0, currentStep)),
          statusText: orderInfo.status || liveData.statusLabel || "Sedang Dikerjakan",
          estimateDate:
            orderInfo.dueDate ||
            (orderInfo.deadline
              ? new Date(orderInfo.deadline).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Sesuai Jadwal"),
          daysRemaining:
            orderInfo.status === "READY" ||
            orderInfo.status === "Siap Diambil" ||
            orderInfo.status === "Selesai"
              ? "Siap Diambil"
              : "Sedang Dikerjakan",
          tailorPhone: liveData.business?.whatsapp || orderInfo.phone || "6281234567890",
          details:
            [
              orderInfo.notes,
              orderInfo.measurements ? `Ukuran: ${orderInfo.measurements}` : "",
            ]
              .filter(Boolean)
              .join(" • ") || "Pesanan aktif dalam antrean pengerjaan bengkel jahit.",
          priceTotal: `Rp ${totalAmount.toLocaleString("id-ID")}`,
          dpAmount: dpText,
          stepHistory:
            Object.keys(stepHistory).length > 0
              ? stepHistory
              : {
                  0: {
                    date: orderInfo.createdAt
                      ? new Date(orderInfo.createdAt).toLocaleDateString("id-ID")
                      : "Pesanan Masuk",
                    note: "Pesanan terdaftar di sistem bengkel jahit.",
                  },
                  [currentStep]: {
                    date: "Status saat ini",
                    note: `Status pengerjaan: ${orderInfo.status}`,
                  },
                },
        };

        setOrderData(result);
        setSearchState("success");
        return;
      }
    } catch {
      // Backend order not found or network offline, fallback to local/dummy
    }

    // 2. Cek dari DUMMY_ORDERS
    let result = DUMMY_ORDERS[cleanCode];

    // 3. Jika tidak ada di dummy, cek di data pesanan lokal (localStorage)
    if (!result && typeof window !== "undefined") {
      try {
        const localStr = localStorage.getItem("jahitflow_orders");
        if (localStr) {
          const list = JSON.parse(localStr);
          const found = list.find((o: any) => (o.code || "").toUpperCase() === cleanCode);
          if (found) {
            const stepMap: Record<string, number> = {
              "Belum Dikerjakan": 0,
              "Dipotong": 2,
              "Dijahit": 3,
              "Siap Diambil": 5,
              "Selesai": 5,
            };
            const stepNum = stepMap[found.status] ?? 3;
            result = {
              id: found.code,
              customerName: found.customerName,
              itemType: found.itemName,
              currentStep: stepNum,
              statusText: found.status,
              estimateDate: found.dueDate || "Sesuai Jadwal",
              daysRemaining: "Sedang Diproses",
              tailorPhone: found.phone || "6281234567890",
              details: found.notes || "Pesanan aktif dalam antrean pengerjaan bengkel jahit.",
              priceTotal: `Rp ${(Number(found.price) || 0).toLocaleString("id-ID")}`,
              dpAmount: `Rp ${(Number(found.paid) || 0).toLocaleString("id-ID")}`,
              stepHistory: {
                0: { date: "Pesanan masuk", note: "Pencatatan nota jahitan pelanggan." },
                [stepNum]: { date: "Status saat ini", note: `Status pengerjaan: ${found.status}` },
              },
            };
          }
        }
      } catch {
        // fallback
      }
    }

    if (result) {
      setOrderData(result);
      setSearchState("success");
    } else {
      setOrderData(null);
      setSearchState("error");
    }
  }, []);

  // Otomatis baca parameter URL ?code=... atau ?id=... saat halaman dimuat
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const codeFromUrl = params.get("code") || params.get("id");
      if (codeFromUrl) {
        setSearchQuery(codeFromUrl.toUpperCase());
        executeSearch(codeFromUrl);
      }
    }
  }, [executeSearch]);

  const handleSearchForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    executeSearch(searchQuery);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/tracking?code=${encodeURIComponent(orderData?.id || searchQuery)}`;
      navigator.clipboard.writeText(shareUrl);
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
    <div className="min-h-screen bg-[#FBF9F5] text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900 relative overflow-x-hidden">
      
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-gradient-to-b from-indigo-200/35 via-amber-100/20 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[500px] right-0 w-[450px] h-[450px] bg-indigo-100/20 blur-3xl pointer-events-none -z-10" />

      {/* OPENING INTRO ANIMATION */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white backdrop-blur-xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center gap-3.5"
            >
              <div className="w-16 h-16 bg-indigo-600/30 border border-indigo-400/40 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <Scissors className="w-8 h-8 text-indigo-300 transform -rotate-45" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-white font-extrabold text-2xl tracking-tight">
                  Jahit<span className="text-indigo-400">Flow</span>
                </span>
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest mt-0.5">
                  Portal Pelacakan Pesanan
                </span>
              </div>
              <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full animate-pulse" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          1. NAVBAR (Floating Glass Capsule)
      ========================================== */}
      <header className="sticky top-0 z-40 py-3.5 transition-all">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-[#FBF9F5]/85 backdrop-blur-xl border border-stone-200/90 rounded-2xl px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-atelier">
            
            {/* Left: Home Link & Logo */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link 
                href="/" 
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition border border-stone-200 hover:border-indigo-200 shadow-2xs group"
              >
                <Home className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Beranda</span>
              </Link>

              <div className="w-px h-5 bg-stone-300/80 hidden sm:block" />

              <Link href="/" className="flex items-center gap-2 text-indigo-700 font-extrabold text-base tracking-tight">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center shadow-xs">
                  <Scissors className="w-3.5 h-3.5 transform -rotate-45" />
                </div>
                <span className="text-slate-900">Jahit<span className="text-indigo-700">Flow</span></span>
              </Link>
            </div>

            {/* Right: Reset Action Button */}
            <div className="flex items-center gap-2">
              {searchState === "success" && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100/80 px-3.5 py-1.5 rounded-xl transition border border-indigo-100 shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Cari Nota Lain</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ==========================================
          2. MAIN CONTENT
      ========================================== */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-4xl mx-auto px-4 py-6 md:py-10"
      >
        {/* HERO HEADER */}
        <div className="text-center mb-8 md:mb-12 space-y-3">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-indigo-200 text-indigo-800 text-xs font-bold shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" />
            </span>
            <Tag className="w-3 h-3 text-amber-600" />
            <span>Portal Mandiri Pelanggan JahitFlow</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Lacak Progress <span className="text-indigo-700">Jahitan Anda</span>
          </h1>

          <p className="text-sm md:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
            Pantau setiap tahapan pengerjaan pakaian Anda secara real-time, transparan, dan akurat.
          </p>

          {/* SEARCH INPUT FORM */}
          <form onSubmit={handleSearchForm} className="mt-7 max-w-xl mx-auto">
            <div className="relative flex flex-col sm:flex-row gap-2.5 p-2 bg-white rounded-3xl shadow-atelier-lg border border-stone-200/90 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
              <div className="relative flex-1 flex items-center pl-3.5">
                <Search className="w-5 h-5 text-indigo-600 mr-2.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Masukkan Nomor Nota (Contoh: OR001)"
                  className="w-full h-11 bg-transparent text-slate-900 placeholder:text-stone-400 font-bold uppercase text-sm sm:text-base outline-none tracking-wider"
                />
              </div>

              <button
                type="submit"
                disabled={searchState === "loading"}
                className="h-12 px-7 bg-indigo-700 hover:bg-indigo-800 active:bg-indigo-900 text-white font-bold rounded-2xl transition shadow-md shadow-indigo-700/25 flex items-center justify-center gap-2 disabled:bg-indigo-400 shrink-0 text-sm active:scale-95"
              >
                {searchState === "loading" ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <RefreshCw className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <>
                    <span>Lacak Sekarang</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>

            {/* QUICK SAMPLE BADGES */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500">
              <span className="font-medium">Coba sampel nota:</span>
              {[
                { code: "OR001", label: "Kebaya Brukat" },
                { code: "OR002", label: "Jas Pria" },
                { code: "OR003", label: "Gaun Pesta" },
              ].map((sample) => (
                <button
                  key={sample.code}
                  type="button"
                  onClick={() => executeSearch(sample.code)}
                  className="px-3 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 border border-stone-200 rounded-xl font-mono font-bold text-xs transition shadow-2xs flex items-center gap-1.5 group"
                >
                  <span className="text-indigo-700 group-hover:underline">{sample.code}</span>
                  <span className="text-[10px] text-stone-400 font-sans font-normal">({sample.label})</span>
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* RESULTS CONTAINER */}
        <div className="min-h-[350px]">
          <AnimatePresence mode="wait">
            
            {/* ==========================================
                ERROR STATE
            ========================================== */}
            {searchState === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="bg-white rounded-3xl border border-rose-200/90 p-8 md:p-12 text-center shadow-atelier max-w-xl mx-auto space-y-4"
              >
                <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-1.5">
                    Nomor Nota Tidak Ditemukan
                  </h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-md mx-auto">
                    Kode <strong className="font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">"{searchQuery}"</strong> belum terdaftar di sistem.
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Pastikan tidak ada salah ketik atau hubungi penjahit jika nomor nota baru saja dibuat.
                  </p>
                </div>
                
                <div className="pt-3 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-4 py-2.5 rounded-xl transition border border-indigo-200"
                  >
                    <ArrowLeft className="w-4 h-4" /> Kembali & Coba Lagi
                  </button>
                  <button
                    type="button"
                    onClick={() => executeSearch("OR001")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-stone-100 hover:bg-stone-200 px-4 py-2.5 rounded-xl transition"
                  >
                    Coba OR001
                  </button>
                </div>
              </motion.div>
            )}

            {/* ==========================================
                SUCCESS STATE (DIGITAL ATELIER RECEIPT)
            ========================================== */}
            {searchState === "success" && orderData && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-6"
              >
                {/* SUMMARY HEADER CARD (DIGITAL RECEIPT TAG) */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/90 shadow-atelier relative overflow-hidden">
                  
                  {/* Subtle Perforated Stitch Accent on Top */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-amber-400 to-indigo-600" />
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-100">
                    <div>
                      {/* Tags Bar */}
                      <div className="flex flex-wrap items-center gap-2 mb-2.5">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-800 font-mono font-extrabold rounded-lg text-xs tracking-wider border border-indigo-200/80">
                          {orderData.id}
                        </span>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-lg text-xs flex items-center gap-1.5 border border-emerald-200/80">
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> {orderData.dpAmount}
                        </span>
                        <span className="px-2.5 py-1 bg-stone-100 text-stone-600 font-semibold rounded-lg text-xs">
                          Total: {orderData.priceTotal}
                        </span>
                      </div>

                      <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                        {orderData.itemType}
                      </h2>

                      <p className="text-slate-500 font-medium text-sm mt-1.5 flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-600" /> Pemilik Pesanan: <strong className="text-slate-800 font-bold">{orderData.customerName}</strong>
                      </p>
                    </div>

                    {/* Estimate Box */}
                    <div className="bg-gradient-to-br from-[#FAF9F6] to-indigo-50/40 p-4 sm:p-5 rounded-2xl border border-stone-200/90 min-w-[210px] text-left md:text-right shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Estimasi Selesai
                      </span>
                      <p className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 md:justify-end">
                        <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                        {orderData.estimateDate}
                      </p>
                      {orderData.daysRemaining && (
                        <span className="inline-block text-xs font-bold text-indigo-700 bg-indigo-100/80 px-2.5 py-0.5 rounded-full mt-1.5 border border-indigo-200">
                          {orderData.daysRemaining}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CURRENT STATUS HIGHLIGHT & ACTIONS */}
                  <div className="pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                        Status Pengerjaan Saat Ini
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="relative flex h-3.5 w-3.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-indigo-600" />
                        </span>
                        <h3 className="text-xl md:text-2xl font-black text-indigo-700">
                          {orderData.statusText}
                        </h3>
                      </div>
                    </div>

                    {/* SHARE & ACTION BUTTONS */}
                    <div className="flex items-center gap-2.5 w-full md:w-auto">
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="flex-1 md:flex-initial px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-2xs active:scale-95"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
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
                        className="flex-1 md:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-95 group"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Hubungi Penjahit</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* ==========================================
                    TIMELINE PROGRESS SECTION
                ========================================== */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/90 shadow-atelier">
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-stone-100">
                    <h4 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
                      <Clock className="w-5 h-5 text-indigo-600" /> 
                      <span>Tahapan Pengerjaan Pakaian</span>
                    </h4>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                      Langkah {orderData.currentStep + 1} dari {TIMELINE_STEPS.length}
                    </span>
                  </div>

                  {/* DESKTOP HORIZONTAL TIMELINE */}
                  <div className="hidden md:block relative my-9 px-2">
                    {/* Background Track Line */}
                    <div className="absolute top-6 left-8 right-8 h-1 bg-stone-200/80 -z-0 rounded-full" />
                    
                    {/* Active Progress Stitched Line */}
                    <div
                      className="absolute top-6 left-8 h-1 bg-indigo-600 -z-0 transition-all duration-700 rounded-full shadow-sm"
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
                          <div key={step.title} className="flex flex-col items-center w-32 text-center group">
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 mb-2.5 transition-all duration-300 ${
                                isDone
                                  ? "bg-indigo-700 border-indigo-700 text-white shadow-md shadow-indigo-700/25"
                                  : isActive
                                  ? "bg-white border-indigo-600 text-indigo-700 ring-4 ring-indigo-100 scale-110 shadow-md"
                                  : "bg-white border-stone-200 text-stone-300"
                              }`}
                            >
                              {isDone ? <CheckCircle2 className="w-6 h-6" /> : <StepIcon className="w-5 h-5" />}
                            </div>

                            <span
                              className={`text-xs font-extrabold block leading-tight ${
                                isDone || isActive ? "text-slate-900" : "text-slate-400"
                              }`}
                            >
                              {step.title}
                            </span>

                            {history?.date && (
                              <span className="text-[10px] font-mono text-slate-400 mt-1 block">
                                {history.date.split(",")[0]}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* MOBILE & DETAILED VERTICAL TIMELINE */}
                  <div className="space-y-4 md:mt-10 relative">
                    <div className="absolute top-4 bottom-4 left-6 w-0.5 bg-stone-200 md:hidden" />

                    {TIMELINE_STEPS.map((step, index) => {
                      const isDone = index < orderData.currentStep;
                      const isActive = index === orderData.currentStep;
                      const isUpcoming = index > orderData.currentStep;
                      const StepIcon = step.icon;
                      const history = orderData.stepHistory[index];

                      return (
                        <div
                          key={step.title}
                          className={`relative flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 border ${
                            isActive
                              ? "bg-indigo-50/50 border-indigo-200 shadow-2xs"
                              : isDone
                              ? "bg-[#FAF9F6]/60 border-stone-100"
                              : "bg-transparent border-transparent opacity-60"
                          }`}
                        >
                          {/* Step Icon */}
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 z-10 border transition ${
                              isDone
                                ? "bg-indigo-700 border-indigo-700 text-white shadow-xs"
                                : isActive
                                ? "bg-white border-indigo-600 text-indigo-700 font-bold ring-4 ring-indigo-100 shadow-xs"
                                : "bg-white border-stone-200 text-stone-300"
                            }`}
                          >
                            {isDone ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                          </div>

                          {/* Step Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <div className="flex items-center gap-2">
                                <h5
                                  className={`text-sm font-bold ${
                                    isUpcoming ? "text-slate-400" : "text-slate-900"
                                  }`}
                                >
                                  {step.title}
                                </h5>
                                {isActive && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow-2xs">
                                    Berlangsung
                                  </span>
                                )}
                              </div>
                              {history?.date && (
                                <span className="text-xs text-slate-400 font-mono">
                                  {history.date}
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>

                            {/* Workshop Note */}
                            {history?.note && (
                              <div className="mt-2.5 p-3 bg-white rounded-xl border border-stone-200/80 text-xs text-slate-700 flex items-start gap-2 shadow-2xs">
                                <MessageSquareText className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                                <span>{history.note}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ==========================================
                    SPECIFICATIONS & MODEL NOTES
                ========================================== */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/90 shadow-atelier space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
                    <Scissors className="w-4 h-4 text-indigo-600" />
                    <span>Detail Pakaian & Catatan Model Busana</span>
                  </div>
                  <div className="bg-[#FAF9F6] p-4 sm:p-5 rounded-2xl border border-stone-200/80 text-slate-700 text-xs sm:text-sm leading-relaxed">
                    <p>{orderData.details}</p>
                    <div className="mt-3 pt-3 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                      <span>Metode: Jahit Halus Butik (Fine Stitching)</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={13} /> Sesuai Rekomendasi Fiting
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ==========================================
                IDLE GUIDE STATE (WHEN NO SEARCH YET)
            ========================================== */}
            {searchState === "idle" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4"
              >
                <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-atelier text-center hover:border-indigo-300 transition group">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center font-black text-lg mx-auto mb-4 border border-indigo-100 group-hover:bg-indigo-700 group-hover:text-white transition shadow-2xs">
                    01
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1.5 text-sm sm:text-base">Cek Nota Pembayaran</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Lihat kode nota yang tertera pada bagian atas struk pembayaran atau pesan WhatsApp dari penjahit.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-atelier text-center hover:border-indigo-300 transition group">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center font-black text-lg mx-auto mb-4 border border-indigo-100 group-hover:bg-indigo-700 group-hover:text-white transition shadow-2xs">
                    02
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1.5 text-sm sm:text-base">Masukkan Kode</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Ketik kode nota (misal: <strong>OR001</strong>) ke kolom di atas dan tekan tombol pelacakan.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-atelier text-center hover:border-indigo-300 transition group">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center font-black text-lg mx-auto mb-4 border border-indigo-100 group-hover:bg-indigo-700 group-hover:text-white transition shadow-2xs">
                    03
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1.5 text-sm sm:text-base">Pantau Real-Time</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Dapatkan pembaruan langsung mulai dari pengukuran, penjahitan, hingga pakaian siap diambil.
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </motion.main>

      {/* FOOTER */}
      <footer className="mt-16 py-8 border-t border-stone-200/80 text-center text-xs text-slate-400">
        <p>© 2026 JahitFlow • Sistem Manajemen Operasional Usaha Jahit</p>
      </footer>

    </div>
  );
}