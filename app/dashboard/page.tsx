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
  ChevronRight,
  Menu,
  X,
  LogOut,
  UserPlus,
  Receipt,
  Circle,
  ScissorsLineDashed,
  Sparkles,
  ShoppingBag,
  Ruler,
  Phone,
  ArrowLeft
} from "lucide-react";
import SewingMachineAnimation from "@/components/SewingMachineAnimation";

// ============================================================================
// TYPES & DUMMY DATA
// ============================================================================

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  lastMeasurementDate: string;
  measurements: {
    lingkarDada: number;
    lingkarPinggang: number;
    lebarBahu: number;
    panjangBaju: number;
    panjangLengan: number;
    panjangCelana: number;
    lingkarPinggul: number;
  };
}

const INITIAL_CUSTOMERS: Customer[] = [];

type OrderStatus = "Belum Dikerjakan" | "Dipotong" | "Dijahit" | "Siap Diambil" | "Selesai";

interface OrderItem {
  code: string;
  customerName: string;
  phone: string;
  itemName: string;
  dueDate: string;
  status: OrderStatus;
  price?: number;
  paid?: number;
}

const INITIAL_ORDERS: OrderItem[] = [];

// Helper Badge Status
const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case "Belum Dikerjakan":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <Circle className="w-2 h-2 fill-slate-400 text-slate-400" />
          Belum Dikerjakan
        </span>
      );
    case "Dipotong":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <ScissorsLineDashed className="w-3.5 h-3.5 text-amber-600" />
          Dipotong
        </span>
      );
    case "Dijahit":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
          <Scissors className="w-3.5 h-3.5 text-blue-600" />
          Dijahit
        </span>
      );
    case "Siap Diambil":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Siap Diambil
        </span>
      );
    case "Selesai":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
          ✓ Selesai
        </span>
      );
  }
};

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

export default function DashboardPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Modal Popup States
  const [activeModal, setActiveModal] = useState<"new-order" | "new-customer" | "search-size" | "payment" | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data States
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);

  // State Form Pesanan Baru
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    itemName: "",
    dueDate: "",
    totalPrice: "",
    downPayment: "",
    notes: "",
  });

  // State Form Pelanggan Baru
  const [customerForm, setCustomerForm] = useState({
    name: "",
    phone: "",
    address: "",
    lingkarDada: "",
    lingkarPinggang: "",
    lebarBahu: "",
    panjangBaju: "",
    panjangLengan: "",
    panjangCelana: "",
    lingkarPinggul: "",
  });

  // State Search Ukuran
  const [sizeSearchQuery, setSizeSearchQuery] = useState("");
  const [selectedCustomerForSize, setSelectedCustomerForSize] = useState<Customer | null>(INITIAL_CUSTOMERS[0] || null);

  // State Payment Form
  const [paymentForm, setPaymentForm] = useState({
    orderCode: "",
    amount: "",
    paymentType: "DP / Titipan",
    notes: "",
  });

  // Show Toast Notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handlers
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.customerName || !orderForm.itemName) return;

    const newOrder: OrderItem = {
      code: `OR00${orders.length + 1}`,
      customerName: orderForm.customerName,
      phone: "0812" + Math.floor(10000000 + Math.random() * 90000000),
      itemName: orderForm.itemName,
      dueDate: orderForm.dueDate || "Belum diatur",
      status: "Belum Dikerjakan",
      price: Number(orderForm.totalPrice) || 0,
      paid: Number(orderForm.downPayment) || 0,
    };

    setOrders([newOrder, ...orders]);
    setActiveModal(null);
    setOrderForm({ customerName: "", itemName: "", dueDate: "", totalPrice: "", downPayment: "", notes: "" });
    showToast(`Pesanan ${newOrder.code} berhasil ditambahkan!`);
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerForm.name || !customerForm.phone) return;

    const newCust: Customer = {
      id: `CUST-00${customers.length + 1}`,
      name: customerForm.name,
      phone: customerForm.phone,
      address: customerForm.address || "Belum ada alamat",
      lastMeasurementDate: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      measurements: {
        lingkarDada: Number(customerForm.lingkarDada) || 0,
        lingkarPinggang: Number(customerForm.lingkarPinggang) || 0,
        lebarBahu: Number(customerForm.lebarBahu) || 0,
        panjangBaju: Number(customerForm.panjangBaju) || 0,
        panjangLengan: Number(customerForm.panjangLengan) || 0,
        panjangCelana: Number(customerForm.panjangCelana) || 0,
        lingkarPinggul: Number(customerForm.lingkarPinggul) || 0,
      },
    };

    setCustomers([newCust, ...customers]);
    setActiveModal(null);
    setCustomerForm({
      name: "", phone: "", address: "", lingkarDada: "", lingkarPinggang: "",
      lebarBahu: "", panjangBaju: "", panjangLengan: "", panjangCelana: "", lingkarPinggul: ""
    });
    showToast(`Pelanggan ${newCust.name} berhasil disimpan!`);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveModal(null);
    showToast(`Pembayaran untuk ${paymentForm.orderCode} berhasil dicatat!`);
  };

  const filteredCustomersForSize = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(sizeSearchQuery.toLowerCase()) ||
      c.phone.includes(sizeSearchQuery)
  );

  // Dynamic calculations
  const activeOrdersCount = orders.filter(o => o.status !== "Selesai").length;
  const sewingOrdersCount = orders.filter(o => o.status === "Dijahit").length;
  const readyOrdersCount = orders.filter(o => o.status === "Siap Diambil").length;
  const finishedOrdersCount = orders.filter(o => o.status === "Selesai").length;

  const totalIncome = orders.reduce((acc, curr) => acc + (curr.paid || 0), 0);
  const totalPending = orders.reduce((acc, curr) => acc + Math.max(0, (curr.price || 0) - (curr.paid || 0)), 0);

  const DYNAMIC_SUMMARY_CARDS = [
    { title: "Pesanan Aktif", count: activeOrdersCount, subtitle: activeOrdersCount > 0 ? "Pesanan sedang diproses" : "Belum ada pesanan", icon: ShoppingBag, color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
    { title: "Sedang Dijahit", count: sewingOrdersCount, subtitle: sewingOrdersCount > 0 ? "Dalam proses jahit" : "Belum ada pesanan", icon: Scissors, color: "bg-blue-50 text-blue-700 border-blue-100" },
    { title: "Siap Diambil", count: readyOrdersCount, subtitle: readyOrdersCount > 0 ? "Menunggu diambil" : "Belum ada pesanan", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    { title: "Pesanan Selesai", count: finishedOrdersCount, subtitle: finishedOrdersCount > 0 ? "Sudah diserahkan" : "Belum ada data", icon: Sparkles, color: "bg-purple-50 text-purple-700 border-purple-100" },
  ];

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
          1. SIDEBAR (Atelier Modern Workspace)
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-slate-600 hover:bg-stone-100 rounded-xl lg:hidden focus:outline-none"
              aria-label="Buka Menu Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Meja Kerja Dashboard
              </h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Pantau kondisi antrean dan operasional harian usaha jahit Anda.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-indigo-700 bg-white hover:bg-indigo-50 border border-stone-200 rounded-xl transition shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
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

            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <div className="w-8 h-8 rounded-xl bg-indigo-700 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                S
              </div>
              <span className="text-xs font-bold text-slate-800 hidden md:inline-block">
                Satria Tailor
              </span>
            </div>
          </div>
        </motion.header>

        {/* Dashboard Main View */}
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="p-4 sm:p-8 space-y-6 sm:space-y-8 max-w-7xl w-full mx-auto"
        >
          
          {/* ================================================================
              EXECUTIVE GREETING BANNER WITH SEWING MACHINE ANIMATION
              ================================================================ */}
          <div className="bg-gradient-to-br from-indigo-950 via-slate-950 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-atelier-lg border border-indigo-800/40 relative overflow-hidden">
            {/* Ambient Lighting Orbs */}
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Left Column: Workshop Greeting */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
                  <span>Workshop Aktif • Meja Kerja Digital Penjahit</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Selamat datang kembali, Satria 👋
                </h2>

                <p className="text-indigo-200 text-sm sm:text-base leading-relaxed max-w-xl">
                  Hari ini terdapat <span className="text-white font-black underline decoration-amber-400">{activeOrdersCount} pesanan aktif</span> yang sedang berjalan di bengkel jahit Anda.
                </p>

                {/* Status Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="px-3 py-1 rounded-full bg-indigo-900/80 border border-indigo-700/60 text-indigo-200 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Bengkel Aktif
                  </span>
                  <span className="px-3 py-1 rounded-full bg-indigo-900/80 border border-indigo-700/60 text-amber-300 font-bold">
                    {sewingOrdersCount} Sedang Dijahit
                  </span>
                  <span className="px-3 py-1 rounded-full bg-indigo-900/80 border border-indigo-700/60 text-emerald-300 font-bold">
                    {readyOrdersCount} Siap Diambil
                  </span>
                </div>
              </div>

              {/* Right Column: Mini Sewing Machine Live Animation */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="w-full max-w-sm">
                  <SewingMachineAnimation compact={true} className="border-indigo-600/50 shadow-2xl" />
                </div>
              </div>

            </div>
          </div>

          {/* ================================================================
              AKSI CEPAT (4 QUICK ACTIONS)
              ================================================================ */}
          <section className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-400 tracking-widest uppercase">
              Aksi Cepat Operasional
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              
              {/* Button 1: Pesanan Baru */}
              <button
                type="button"
                onClick={() => setActiveModal("new-order")}
                className="flex items-center gap-3 p-4 bg-indigo-700 hover:bg-indigo-800 active:scale-95 text-white rounded-2xl font-bold shadow-md shadow-indigo-700/20 transition-all text-left group hover:-translate-y-0.5"
              >
                <div className="p-2 bg-white/20 rounded-xl group-hover:scale-110 transition-transform shrink-0">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs sm:text-sm block leading-tight truncate font-extrabold">Pesanan Baru</span>
                  <span className="text-[10px] font-normal text-indigo-200 hidden sm:block mt-0.5">Buat orderan</span>
                </div>
              </button>

              {/* Button 2: Pelanggan Baru */}
              <button
                type="button"
                onClick={() => setActiveModal("new-customer")}
                className="flex items-center gap-3 p-4 bg-white hover:bg-stone-50 active:scale-95 border border-stone-200/90 text-slate-800 rounded-2xl font-bold shadow-atelier transition-all text-left group hover:-translate-y-0.5"
              >
                <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl group-hover:scale-110 transition-transform shrink-0 border border-indigo-100">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs sm:text-sm block leading-tight truncate font-extrabold">Pelanggan Baru</span>
                  <span className="text-[10px] font-normal text-slate-400 hidden sm:block mt-0.5">+ Ukuran badan</span>
                </div>
              </button>

              {/* Button 3: Cari Ukuran */}
              <button
                type="button"
                onClick={() => setActiveModal("search-size")}
                className="flex items-center gap-3 p-4 bg-white hover:bg-stone-50 active:scale-95 border border-stone-200/90 text-slate-800 rounded-2xl font-bold shadow-atelier transition-all text-left group hover:-translate-y-0.5"
              >
                <div className="p-2 bg-amber-50 text-amber-700 rounded-xl group-hover:scale-110 transition-transform shrink-0 border border-amber-100">
                  <Ruler className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs sm:text-sm block leading-tight truncate font-extrabold">Cari Ukuran</span>
                  <span className="text-[10px] font-normal text-slate-400 hidden sm:block mt-0.5">Lihat ukuran cepat</span>
                </div>
              </button>

              {/* Button 4: Catat Pembayaran */}
              <button
                type="button"
                onClick={() => setActiveModal("payment")}
                className="flex items-center gap-3 p-4 bg-white hover:bg-stone-50 active:scale-95 border border-stone-200/90 text-slate-800 rounded-2xl font-bold shadow-atelier transition-all text-left group hover:-translate-y-0.5"
              >
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl group-hover:scale-110 transition-transform shrink-0 border border-emerald-100">
                  <Receipt className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs sm:text-sm block leading-tight truncate font-extrabold">Catat Bayar</span>
                  <span className="text-[10px] font-normal text-slate-400 hidden sm:block mt-0.5">Input DP / Lunas</span>
                </div>
              </button>

            </div>
          </section>

          {/* ================================================================
              RINGKASAN METRIK PESANAN
              ================================================================ */}
          <section className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-400 tracking-widest uppercase">
              Status Pengerjaan Jahitan
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {DYNAMIC_SUMMARY_CARDS.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-atelier hover:border-indigo-300 transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {card.title}
                      </span>
                      <div className={`p-2 rounded-xl border ${card.color} shadow-2xs`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <span className="text-3xl font-black text-slate-900 tracking-tight">
                        {card.count}
                      </span>
                      <p className="text-xs text-slate-400 font-medium mt-1">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ================================================================
              TABEL PESANAN BERJALAN TERBARU
              ================================================================ */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h3 className="text-xs font-extrabold text-slate-400 tracking-widest uppercase">
                Pesanan Berjalan Terbaru
              </h3>
              <Link
                href="/orders"
                className="text-xs font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 transition"
              >
                Lihat Semua Pesanan <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Desktop Table */}
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-atelier overflow-hidden hidden sm:block">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF9F6] border-b border-stone-200/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-5">Kode Nota</th>
                      <th className="py-3.5 px-5">Pelanggan</th>
                      <th className="py-3.5 px-5">Jenis Pakaian</th>
                      <th className="py-3.5 px-5">Target Ambil</th>
                      <th className="py-3.5 px-5">Status Pengerjaan</th>
                      <th className="py-3.5 px-5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-slate-400 font-medium">
                          Belum ada pesanan tersimpan. Klik <strong>+ Pesanan Baru</strong> untuk mulai mencatat.
                        </td>
                      </tr>
                    ) : (
                      orders.slice(0, 5).map((order) => (
                        <tr key={order.code} className="hover:bg-stone-50/70 transition-colors group">
                          <td className="py-4 px-5">
                            <span className="font-extrabold text-indigo-700 font-mono bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                              {order.code}
                            </span>
                          </td>
                          <td className="py-4 px-5">
                            <p className="font-bold text-slate-900 text-xs">{order.customerName}</p>
                            <p className="text-[11px] text-slate-400 font-mono">{order.phone}</p>
                          </td>
                          <td className="py-4 px-5 font-semibold text-slate-800">{order.itemName}</td>
                          <td className="py-4 px-5 text-slate-600 font-medium">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {order.dueDate}
                            </span>
                          </td>
                          <td className="py-4 px-5">{getStatusBadge(order.status)}</td>
                          <td className="py-4 px-5 text-right">
                            <Link
                              href="/orders"
                              className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-indigo-700 bg-stone-100 hover:bg-indigo-50 px-3 py-1.5 rounded-xl transition shadow-2xs"
                            >
                              Detail <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 sm:hidden">
              {orders.length === 0 ? (
                <div className="bg-white p-6 rounded-3xl border border-stone-200 text-center text-xs text-slate-400">
                  Belum ada pesanan tersimpan.
                </div>
              ) : (
                orders.slice(0, 5).map((order) => (
                  <div key={order.code} className="bg-white p-4 rounded-3xl border border-stone-200/90 shadow-atelier space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                      <span className="font-extrabold text-indigo-700 font-mono text-xs bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {order.code}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{order.customerName}</h4>
                      <p className="text-xs text-slate-500">{order.itemName}</p>
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-2 pt-2 text-xs font-semibold text-slate-600">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> Ambil: {order.dueDate}
                      </span>
                      <Link href="/orders" className="text-indigo-700 font-bold flex items-center gap-0.5">
                        Detail &rarr;
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* ================================================================
              RINGKASAN KEUANGAN
              ================================================================ */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h3 className="text-xs font-extrabold text-slate-400 tracking-widest uppercase">
                Ringkasan Keuangan Usaha
              </h3>
              <Link href="/reports" className="text-xs font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 transition">
                Lihat Laporan Lengkap <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white p-5 sm:p-7 rounded-3xl border border-stone-200/90 shadow-atelier grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-indigo-600" /> Total Nilai Pesanan
                </span>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Rp {(totalIncome + totalPending).toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-slate-400 font-medium">Dari {orders.length} pesanan tercatat</p>
              </div>

              <div className="space-y-1 md:border-l md:border-stone-100 md:pl-6">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Sudah Diterima (DP / Lunas)
                </span>
                <p className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
                  Rp {totalIncome.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-emerald-600 font-medium">Dana masuk kas usaha</p>
              </div>

              <div className="space-y-1 md:border-l md:border-stone-100 md:pl-6">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" /> Belum Dibayar (Pelunasan)
                </span>
                <p className="text-2xl sm:text-3xl font-black text-amber-700 tracking-tight">
                  Rp {totalPending.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-amber-600 font-medium">Sisa tagihan saat baju diambil</p>
              </div>
            </div>
          </section>

        </motion.main>

        {/* Footer */}
        <footer className="mt-auto border-t border-stone-200/80 bg-white py-6 px-4 sm:px-8 text-center text-xs font-medium text-slate-400">
          &copy; {new Date().getFullYear()} JahitFlow • Sistem Operasional Usaha Jahit & Tailor
        </footer>

      </div>

      {/* =====================================================================
          3. POPUP MODALS SECTION (ATELIER FORMS)
          ===================================================================== */}

      {/* MODAL 1: PESANAN BARU */}
      <AnimatePresence>
        {activeModal === "new-order" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-100 z-10 max-h-[90vh] flex flex-col"
            >
              <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-950 to-slate-900 text-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-700 rounded-xl text-white shadow-xs">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg">Tambah Pesanan Baru</h3>
                    <p className="text-xs text-indigo-200">Input detail pakaian & target waktu selesai</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 text-indigo-300 hover:text-white rounded-lg hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateOrder} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nama Pelanggan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ibu Ratna"
                    value={orderForm.customerName}
                    onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-xs sm:text-sm font-medium text-slate-900 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Jenis Pakaian / Pesanan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kebaya Brukat Hijau Emerald"
                    value={orderForm.itemName}
                    onChange={(e) => setOrderForm({ ...orderForm, itemName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-xs sm:text-sm font-medium text-slate-900 shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Target Pengambilan
                    </label>
                    <input
                      type="date"
                      value={orderForm.dueDate}
                      onChange={(e) => setOrderForm({ ...orderForm, dueDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-xs font-medium text-slate-900 shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Estimasi Biaya (Rp)
                    </label>
                    <input
                      type="number"
                      placeholder="450000"
                      value={orderForm.totalPrice}
                      onChange={(e) => setOrderForm({ ...orderForm, totalPrice: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-xs font-bold text-slate-900 shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Catatan Khusus Model / Kain
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Misal: Model kerah V-neck, furing katun, payet bagian dada"
                    value={orderForm.notes}
                    onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-xs font-medium text-slate-900 resize-none shadow-2xs"
                  />
                </div>

                <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-stone-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-700 hover:bg-indigo-800 text-white shadow-md shadow-indigo-700/25 active:scale-95 transition"
                  >
                    Simpan Pesanan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: PELANGGAN BARU + UKURAN BADAN */}
      <AnimatePresence>
        {activeModal === "new-customer" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-100 z-10 max-h-[90vh] flex flex-col"
            >
              <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-950 to-slate-900 text-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-700 rounded-xl text-white shadow-xs">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg">Tambah Pelanggan Baru</h3>
                    <p className="text-xs text-indigo-200">Simpan kontak dan 7 parameter ukuran badan</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 text-indigo-300 hover:text-white rounded-lg hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCustomer} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4" /> Informasi Kontak Pelanggan
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Nama Lengkap <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Ibu Ratna"
                        value={customerForm.name}
                        onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-xs sm:text-sm font-medium text-slate-900 shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Nomor WhatsApp <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="081234567890"
                        value={customerForm.phone}
                        onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-xs sm:text-sm font-medium text-slate-900 shadow-2xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Alamat Lengkap
                    </label>
                    <input
                      type="text"
                      placeholder="Jl. Melati No. 12, Bandung"
                      value={customerForm.address}
                      onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-xs sm:text-sm font-medium text-slate-900 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-stone-100">
                  <h4 className="text-xs font-extrabold text-amber-700 uppercase tracking-wider flex items-center gap-2">
                    <Ruler className="w-4 h-4" /> 7 Parameter Ukuran Badan (cm)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { label: "Lingkar Dada", key: "lingkarDada", placeholder: "96" },
                      { label: "Lingkar Pinggang", key: "lingkarPinggang", placeholder: "78" },
                      { label: "Lebar Bahu", key: "lebarBahu", placeholder: "39" },
                      { label: "Panjang Baju", key: "panjangBaju", placeholder: "65" },
                      { label: "Panjang Lengan", key: "panjangLengan", placeholder: "54" },
                      { label: "Panjang Celana", key: "panjangCelana", placeholder: "92" },
                      { label: "Lingkar Pinggul", key: "lingkarPinggul", placeholder: "98" },
                    ].map((field) => (
                      <div key={field.key} className="bg-[#FAF9F6] p-2.5 rounded-xl border border-stone-200">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 truncate">
                          {field.label}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder={field.placeholder}
                            value={(customerForm as any)[field.key]}
                            onChange={(e) => setCustomerForm({ ...customerForm, [field.key]: e.target.value })}
                            className="w-full pl-2 pr-6 py-1 bg-white rounded-lg border border-stone-200 focus:border-indigo-600 outline-none text-xs font-black text-slate-900"
                          />
                          <span className="absolute right-2 top-1 text-[10px] font-bold text-slate-400">cm</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-stone-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-700 hover:bg-indigo-800 text-white shadow-md shadow-indigo-700/25 active:scale-95 transition"
                  >
                    Simpan Pelanggan & Ukuran
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: CARI UKURAN */}
      <AnimatePresence>
        {activeModal === "search-size" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-100 z-10 max-h-[90vh] flex flex-col"
            >
              <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-800/80 rounded-xl text-white shadow-xs">
                    <Ruler className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg">Cari Ukuran Pelanggan</h3>
                    <p className="text-xs text-amber-100">Temukan ukuran badan instan tanpa bongkar buku catatan</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 text-amber-200 hover:text-white rounded-lg hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={sizeSearchQuery}
                    onChange={(e) => setSizeSearchQuery(e.target.value)}
                    placeholder="Ketik nama pelanggan atau nomor WhatsApp..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none text-slate-900 text-xs sm:text-sm font-bold placeholder:font-normal placeholder:text-slate-400 shadow-2xs"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2 max-h-64 md:max-h-80 overflow-y-auto pr-1">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                      Daftar Pelanggan ({filteredCustomersForSize.length})
                    </p>
                    {filteredCustomersForSize.length === 0 ? (
                      <div className="p-4 bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-center text-xs text-slate-400">
                        Belum ada pelanggan tersimpan.
                      </div>
                    ) : (
                      filteredCustomersForSize.map((cust) => (
                        <button
                          key={cust.id}
                          type="button"
                          onClick={() => setSelectedCustomerForSize(cust)}
                          className={`w-full p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                            selectedCustomerForSize?.id === cust.id
                              ? "bg-amber-50 border-amber-300 ring-2 ring-amber-400/30"
                              : "bg-white border-stone-200 hover:border-stone-300"
                          }`}
                        >
                          <span className="font-bold text-slate-900 text-xs">{cust.name}</span>
                          <span className="text-[11px] text-slate-400 font-mono mt-0.5">{cust.phone}</span>
                        </button>
                      ))
                    )}
                  </div>

                  <div className="md:col-span-2 bg-[#FAF9F6] p-5 rounded-3xl border border-stone-200 space-y-4">
                    {selectedCustomerForSize ? (
                      <>
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-2 border-b border-stone-200 pb-3">
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-base">
                              {selectedCustomerForSize.name}
                            </h4>
                            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 font-mono">
                              <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedCustomerForSize.phone}
                            </p>
                          </div>
                          <span className="self-start px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-[11px] font-bold border border-amber-200">
                            Diukur: {selectedCustomerForSize.lastMeasurementDate}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                          {[
                            { name: "Lingkar Dada", val: selectedCustomerForSize.measurements.lingkarDada },
                            { name: "Lingkar Pinggang", val: selectedCustomerForSize.measurements.lingkarPinggang },
                            { name: "Lebar Bahu", val: selectedCustomerForSize.measurements.lebarBahu },
                            { name: "Panjang Baju", val: selectedCustomerForSize.measurements.panjangBaju },
                            { name: "Panjang Lengan", val: selectedCustomerForSize.measurements.panjangLengan },
                            { name: "Panjang Celana", val: selectedCustomerForSize.measurements.panjangCelana },
                            { name: "Lingkar Pinggul", val: selectedCustomerForSize.measurements.lingkarPinggul },
                          ].map((item, idx) => (
                            <div key={idx} className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs">
                              <p className="text-[10px] font-bold text-slate-400 uppercase truncate">
                                {item.name}
                              </p>
                              <p className="text-sm font-black text-slate-900 mt-0.5">
                                {item.val} <span className="text-[10px] font-medium text-slate-400">cm</span>
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 flex items-center justify-between">
                          <Link
                            href={`/customers`}
                            className="text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1"
                          >
                            Lihat Profil Lengkap &rarr;
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setOrderForm({ ...orderForm, customerName: selectedCustomerForSize.name });
                              setActiveModal("new-order");
                            }}
                            className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition"
                          >
                            + Buat Pesanan
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8 text-slate-400 text-xs">
                        Pilih pelanggan di samping untuk melihat ukuran.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: CATAT PEMBAYARAN */}
      <AnimatePresence>
        {activeModal === "payment" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-100 z-10"
            >
              <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-800 to-slate-900 text-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-xs">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg">Catat Pembayaran</h3>
                    <p className="text-xs text-emerald-200">Input transaksi DP atau Pelunasan</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Pilih Kode Pesanan
                  </label>
                  <select
                    value={paymentForm.orderCode}
                    onChange={(e) => setPaymentForm({ ...paymentForm, orderCode: e.target.value })}
                    disabled={orders.length === 0}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none text-xs font-bold text-slate-800 bg-white shadow-2xs disabled:bg-stone-50 disabled:text-slate-400"
                  >
                    {orders.length === 0 ? (
                      <option value="">Belum ada pesanan tersimpan</option>
                    ) : (
                      orders.map((o) => (
                        <option key={o.code} value={o.code}>
                          {o.code} — {o.customerName} ({o.itemName})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nominal Pembayaran (Rp) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="200000"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none text-sm font-black text-slate-900 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Jenis Pembayaran
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["DP / Titipan", "Pelunasan"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPaymentForm({ ...paymentForm, paymentType: type })}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                          paymentForm.paymentType === type
                            ? "bg-emerald-50 border-emerald-400 text-emerald-800 ring-2 ring-emerald-400/20 shadow-2xs"
                            : "bg-white border-stone-200 text-slate-600 hover:bg-stone-50"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-stone-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 active:scale-95 transition"
                  >
                    Simpan Pembayaran
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