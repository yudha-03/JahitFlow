"use client";

import React, { useState, useEffect } from "react";
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
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
  LogOut,
  UserPlus,
  Receipt,
  ArrowUpRight,
  Wallet,
  Circle,
  ScissorsLineDashed,
  Sparkles,
  ShoppingBag,
  Ruler,
  Phone,
  MapPin,
  Check,
  Calendar,
  DollarSign,
  Home,        
  ArrowLeft    
} from "lucide-react";

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
}

const INITIAL_ORDERS: OrderItem[] = [];

const ATTENTION_ITEMS: any[] = [];

// Helper Badge Status
const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case "Belum Dikerjakan":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <Circle className="w-2.5 h-2.5 fill-slate-400 text-slate-400" />
          Belum Dikerjakan
        </span>
      );
    case "Dipotong":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <ScissorsLineDashed className="w-3.5 h-3.5 text-amber-600" />
          Dipotong
        </span>
      );
    case "Dijahit":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
          <Scissors className="w-3.5 h-3.5 text-blue-600" />
          Dijahit
        </span>
      );
    case "Siap Diambil":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Siap Diambil
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

  // --- MEMBACA LOCALSTORAGE SAAT HALAMAN DIMUAT ---
  useEffect(() => {
    const savedOrders = localStorage.getItem("jahitflow_orders");
    const savedCustomers = localStorage.getItem("jahitflow_customers");

    if (savedOrders) {
      try { setOrders(JSON.parse(savedOrders)); } catch (e) { console.error(e); }
    }
    if (savedCustomers) {
      try { setCustomers(JSON.parse(savedCustomers)); } catch (e) { console.error(e); }
    }
  }, []);
  // -------------------------------------------------

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
  const [selectedCustomerForSize, setSelectedCustomerForSize] = useState<Customer | null>(null);

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

  // Handlers yang sudah terintegrasi localStorage
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.customerName || !orderForm.itemName) return;
    
    // Ambil data yang sudah ada agar ID berlanjut dengan benar
    const existingOrders: OrderItem[] = JSON.parse(localStorage.getItem("jahitflow_orders") || "[]");

    const newOrder: OrderItem = {
      code: `OR00${existingOrders.length + 1}`,
      customerName: orderForm.customerName,
      phone: "0812" + Math.floor(10000000 + Math.random() * 90000000),
      itemName: orderForm.itemName,
      dueDate: orderForm.dueDate || "Belum diatur",
      status: "Belum Dikerjakan",
    };

    // Gabungkan dan simpan ke state & localStorage
    const updatedOrders = [newOrder, ...existingOrders];
    setOrders(updatedOrders);
    localStorage.setItem("jahitflow_orders", JSON.stringify(updatedOrders));

    setActiveModal(null);
    setOrderForm({ customerName: "", itemName: "", dueDate: "", totalPrice: "", downPayment: "", notes: "" });
    showToast(`Pesanan ${newOrder.code} berhasil ditambahkan!`);
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerForm.name || !customerForm.phone) return;

    // Ambil data pelanggan yang sudah ada
    const existingCustomers: Customer[] = JSON.parse(localStorage.getItem("jahitflow_customers") || "[]");

    const newCust: Customer = {
      id: `CUST-00${existingCustomers.length + 1}`,
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

    // Gabungkan dan simpan ke state & localStorage
    const updatedCustomers = [newCust, ...existingCustomers];
    setCustomers(updatedCustomers);
    localStorage.setItem("jahitflow_customers", JSON.stringify(updatedCustomers));

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

  // --- RINGKASAN DATA DINAMIS BERDASARKAN PESANAN ---
  const activeOrdersCount = orders.filter(o => o.status !== "Selesai").length;
  const sewingOrdersCount = orders.filter(o => o.status === "Dijahit").length;
  const readyOrdersCount = orders.filter(o => o.status === "Siap Diambil").length;
  const finishedOrdersCount = orders.filter(o => o.status === "Selesai").length;

  const DYNAMIC_SUMMARY_CARDS = [
    { title: "Pesanan Aktif", count: activeOrdersCount, subtitle: activeOrdersCount > 0 ? "Pesanan sedang diproses" : "Belum ada pesanan", icon: ShoppingBag, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    { title: "Sedang Dijahit", count: sewingOrdersCount, subtitle: sewingOrdersCount > 0 ? "Dalam proses jahit" : "Belum ada pesanan", icon: Scissors, color: "bg-blue-50 text-blue-600 border-blue-100" },
    { title: "Siap Diambil", count: readyOrdersCount, subtitle: readyOrdersCount > 0 ? "Menunggu diambil" : "Belum ada pesanan", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { title: "Pesanan Selesai", count: finishedOrdersCount, subtitle: finishedOrdersCount > 0 ? "Sudah diserahkan" : "Belum ada data", icon: Sparkles, color: "bg-purple-50 text-purple-600 border-purple-100" },
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
        { name: "Kembali ke Beranda", href: "/", icon: Home }, 
        { name: "Pengaturan", href: "/settings", icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Toast Feedback Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
                <span className="font-extrabold text-xl text-indigo-950 tracking-tight leading-none">
                  JahitFlow
                </span>
                <span className="text-xs text-slate-500 font-medium mt-1">
                  Satria Tailor
                </span>
              </div>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 lg:hidden rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-6">
            {navigationMenu.map((group, groupIdx) => (
              <div key={groupIdx}>
                <p className="px-3 text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">
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
                        className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                            : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
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
                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                  S
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate leading-tight">
                    Satria
                  </p>
                  <p className="text-xs text-slate-500 font-medium truncate">
                    Pemilik Usaha
                  </p>
                </div>
              </div>
              <button
                type="button"
                title="Keluar"
                onClick={() => router.push("/login")}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Header Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden focus:outline-none"
              aria-label="Buka Menu Sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium hidden sm:block">
                Berikut kondisi operasional usaha Anda hari ini.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            
            <Link
              href="/"
              className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200 rounded-xl transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali ke Beranda</span>
              <span className="sm:hidden">Beranda</span>
            </Link>

            <button
              type="button"
              className="relative p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors focus:outline-none"
              aria-label="Notifikasi"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>

            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                S
              </div>
              <span className="text-sm font-bold text-slate-800 hidden md:inline-block">
                Satria Tailor
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Main View */}
        <main className="p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* Greeting Banner */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-850 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/10 relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Meja Kerja Digital Penjahit
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                Selamat datang kembali, Satria 👋
              </h2>
              <p className="text-indigo-200 text-sm sm:text-base leading-relaxed">
                Ada <span className="text-white font-bold underline decoration-amber-400">{activeOrdersCount} pesanan aktif</span> saat ini.
              </p>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-8 translate-y-8">
              <Scissors className="w-72 h-72 text-white" />
            </div>
          </div>

          {/* QUICK ACTIONS WITH MODAL TRIGGERS */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-500 tracking-wider uppercase">
              Aksi Cepat
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              
              {/* Button 1: Pesanan Baru (Opens Modal) */}
              <button
                type="button"
                onClick={() => setActiveModal("new-order")}
                className="flex items-center gap-3 p-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-2xl font-bold shadow-md shadow-indigo-600/15 transition-all text-left group"
              >
                <div className="p-2 bg-white/20 rounded-xl group-hover:scale-105 transition-transform shrink-0">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-sm sm:text-base block leading-tight truncate">Pesanan Baru</span>
                  <span className="text-[11px] font-normal text-indigo-200 hidden sm:block">Buat orderan</span>
                </div>
              </button>

              {/* Button 2: Pelanggan Baru (Opens Modal) */}
              <button
                type="button"
                onClick={() => setActiveModal("new-customer")}
                className="flex items-center gap-3 p-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl font-bold shadow-sm transition-all text-left group"
              >
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-105 transition-transform shrink-0">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-sm sm:text-base block leading-tight truncate">Pelanggan Baru</span>
                  <span className="text-[11px] font-normal text-slate-500 hidden sm:block">+ Ukuran badan</span>
                </div>
              </button>

              {/* Button 3: Cari Ukuran (Opens Popup Modal) */}
              <button
                type="button"
                onClick={() => setActiveModal("search-size")}
                className="flex items-center gap-3 p-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl font-bold shadow-sm transition-all text-left group"
              >
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-105 transition-transform shrink-0">
                  <Ruler className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-sm sm:text-base block leading-tight truncate">Cari Ukuran</span>
                  <span className="text-[11px] font-normal text-slate-500 hidden sm:block">Lihat ukuran cepat</span>
                </div>
              </button>

              {/* Button 4: Catat Pembayaran (Opens Modal) */}
              <button
                type="button"
                onClick={() => setActiveModal("payment")}
                className="flex items-center gap-3 p-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl font-bold shadow-sm transition-all text-left group"
              >
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform shrink-0">
                  <Receipt className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-sm sm:text-base block leading-tight truncate">Catat Bayar</span>
                  <span className="text-[11px] font-normal text-slate-500 hidden sm:block">Input DP / Lunas</span>
                </div>
              </button>

            </div>
          </section>

          {/* Ringkasan Pesanan (Dinamis dari state orders) */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-500 tracking-wider uppercase">
              Ringkasan Pesanan
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {DYNAMIC_SUMMARY_CARDS.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                        {card.title}
                      </span>
                      <div className={`p-2 rounded-xl border ${card.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        {card.count}
                      </span>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Pesanan Berjalan */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-500 tracking-wider uppercase">
                Pesanan Berjalan Terbaru
              </h3>
              <Link
                href="/orders"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
              >
                Lihat Semua Pesanan <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Desktop Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hidden sm:block">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-5">Kode</th>
                      <th className="py-3.5 px-5">Pelanggan</th>
                      <th className="py-3.5 px-5">Jenis Pesanan</th>
                      <th className="py-3.5 px-5">Pengambilan</th>
                      <th className="py-3.5 px-5">Status</th>
                      <th className="py-3.5 px-5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">Belum ada pesanan tersimpan.</td>
                      </tr>
                    ) : (
                      orders.slice(0, 5).map((order) => (
                        <tr key={order.code} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="py-4 px-5 font-bold text-indigo-700">{order.code}</td>
                          <td className="py-4 px-5">
                            <p className="font-bold text-slate-900">{order.customerName}</p>
                            <p className="text-xs text-slate-500">{order.phone}</p>
                          </td>
                          <td className="py-4 px-5 font-medium text-slate-800">{order.itemName}</td>
                          <td className="py-4 px-5 font-semibold text-slate-700 flex items-center gap-1.5 mt-2">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {order.dueDate}
                          </td>
                          <td className="py-4 px-5">{getStatusBadge(order.status)}</td>
                          <td className="py-4 px-5 text-right">
                            <Link
                              href="/orders"
                              className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
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
                <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-sm text-slate-500">
                  Belum ada pesanan tersimpan.
                </div>
              ) : (
                orders.slice(0, 5).map((order) => (
                  <div key={order.code} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-extrabold text-indigo-700 text-sm">{order.code}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{order.customerName}</h4>
                      <p className="text-xs text-slate-500">{order.itemName}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 text-xs font-semibold text-slate-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> Ambil: {order.dueDate}
                      </span>
                      <Link href="/orders" className="text-indigo-600 font-bold flex items-center gap-0.5">
                        Detail &rarr;
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Ringkasan Keuangan */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-500 tracking-wider uppercase">
                Ringkasan Keuangan Bulan Ini
              </h3>
              <Link href="/reports" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
                Lihat Laporan Lengkap <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-slate-400" /> Pendapatan Bulan Ini
                </span>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Rp 0</p>
                <p className="text-xs text-slate-500 font-medium">Belum ada data transaksi</p>
              </div>

              <div className="space-y-1 md:border-l md:border-slate-100 md:pl-6">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Sudah Dibayar (DP / Lunas)
                </span>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">Rp 0</p>
                <p className="text-xs text-slate-500 font-medium">Belum ada pembayaran</p>
              </div>

              <div className="space-y-1 md:border-l md:border-slate-100 md:pl-6">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" /> Belum Dibayar (Pelunasan)
                </span>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 tracking-tight">Rp 0</p>
                <p className="text-xs text-slate-500 font-medium">Belum ada tagihan</p>
              </div>
            </div>
          </section>

        </main>

        <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 px-4 sm:px-8 text-center text-xs font-medium text-slate-400">
          &copy; {new Date().getFullYear()} JahitFlow. Hak Cipta Dilindungi.
        </footer>

      </div>

      {/* =====================================================================
          3. POPUP MODALS SECTION (Framer Motion Animated)
          ===================================================================== */}

      {/* MODAL 1: PESANAN BARU */}
      <AnimatePresence>
        {activeModal === "new-order" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 max-h-[90vh] flex flex-col"
            >
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 rounded-xl">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg">Tambah Pesanan Baru</h3>
                    <p className="text-xs text-slate-400">Input detail pakaian & tanggal pengambilannya</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateOrder} className="p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nama Pelanggan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={orderForm.customerName}
                    onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Jenis Pakaian / Pesanan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kemeja Batik + Furing"
                    value={orderForm.itemName}
                    onChange={(e) => setOrderForm({ ...orderForm, itemName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-medium text-slate-900"
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
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Estimasi Biaya (Rp)
                    </label>
                    <input
                      type="number"
                      placeholder="350000"
                      value={orderForm.totalPrice}
                      onChange={(e) => setOrderForm({ ...orderForm, totalPrice: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Catatan Khusus Model / Kain
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Misal: Kerah kemeja kaku, kantong saku 1 di dada kiri"
                    value={orderForm.notes}
                    onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium text-slate-900"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 max-h-[90vh] flex flex-col"
            >
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 rounded-xl">
                    <UserPlus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg">Tambah Pelanggan Baru</h3>
                    <p className="text-xs text-slate-400">Simpan kontak dan catatan ukuran badan langsung</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCustomer} className="p-6 space-y-6 overflow-y-auto flex-1">
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4" /> Informasi Pelanggan
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Budi Santoso"
                        value={customerForm.name}
                        onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Nomor WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="081234567890"
                        value={customerForm.phone}
                        onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium text-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Alamat Lengkap
                    </label>
                    <input
                      type="text"
                      placeholder="Jl. Merdeka No. 45"
                      value={customerForm.address}
                      onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-extrabold text-amber-600 uppercase tracking-wider flex items-center gap-2">
                    <Ruler className="w-4 h-4" /> Ukuran Badan (cm)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Lingkar Dada", key: "lingkarDada", placeholder: "98" },
                      { label: "Lingkar Pinggang", key: "lingkarPinggang", placeholder: "88" },
                      { label: "Lebar Bahu", key: "lebarBahu", placeholder: "44" },
                      { label: "Panjang Baju", key: "panjangBaju", placeholder: "72" },
                      { label: "Panjang Lengan", key: "panjangLengan", placeholder: "60" },
                      { label: "Panjang Celana", key: "panjangCelana", placeholder: "100" },
                      { label: "Lingkar Pinggul", key: "lingkarPinggul", placeholder: "102" },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 truncate">
                          {field.label}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder={field.placeholder}
                            value={(customerForm as any)[field.key]}
                            onChange={(e) => setCustomerForm({ ...customerForm, [field.key]: e.target.value })}
                            className="w-full pl-3 pr-7 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-800"
                          />
                          <span className="absolute right-2.5 top-2 text-xs font-semibold text-slate-400">cm</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 max-h-[90vh] flex flex-col"
            >
              <div className="p-6 bg-amber-500 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-600 rounded-xl">
                    <Ruler className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg">Cari Ukuran Pelanggan</h3>
                    <p className="text-xs text-amber-100">Temukan ukuran badan tanpa perlu membuka buku catatan</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 text-amber-100 hover:text-white rounded-lg hover:bg-amber-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={sizeSearchQuery}
                    onChange={(e) => setSizeSearchQuery(e.target.value)}
                    placeholder="Ketik nama pelanggan atau nomor WhatsApp..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none text-slate-900 text-base font-bold placeholder:font-normal placeholder:text-slate-400"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 max-h-64 md:max-h-80 overflow-y-auto pr-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Hasil Pencarian ({filteredCustomersForSize.length})
                    </p>
                    {filteredCustomersForSize.map((cust) => (
                      <button
                        key={cust.id}
                        type="button"
                        onClick={() => setSelectedCustomerForSize(cust)}
                        className={`w-full p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          selectedCustomerForSize?.id === cust.id
                            ? "bg-amber-50 border-amber-300 ring-2 ring-amber-400/30"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <span className="font-bold text-slate-900 text-sm">{cust.name}</span>
                        <span className="text-xs text-slate-500">{cust.phone}</span>
                      </button>
                    ))}
                  </div>

                  <div className="md:col-span-2 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                    {selectedCustomerForSize ? (
                      <>
                        <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-lg">
                              {selectedCustomerForSize.name}
                            </h4>
                            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <Phone className="w-3.5 h-3.5" /> {selectedCustomerForSize.phone}
                            </p>
                          </div>
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold border border-amber-200">
                            Diukur: {selectedCustomerForSize.lastMeasurementDate}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {[
                            { name: "Lingkar Dada", val: selectedCustomerForSize.measurements.lingkarDada },
                            { name: "Lingkar Pinggang", val: selectedCustomerForSize.measurements.lingkarPinggang },
                            { name: "Lebar Bahu", val: selectedCustomerForSize.measurements.lebarBahu },
                            { name: "Panjang Baju", val: selectedCustomerForSize.measurements.panjangBaju },
                            { name: "Panjang Lengan", val: selectedCustomerForSize.measurements.panjangLengan },
                            { name: "Panjang Celana", val: selectedCustomerForSize.measurements.panjangCelana },
                            { name: "Lingkar Pinggul", val: selectedCustomerForSize.measurements.lingkarPinggul },
                          ].map((item, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                              <p className="text-[11px] font-bold text-slate-400 uppercase truncate">
                                {item.name}
                              </p>
                              <p className="text-lg font-extrabold text-slate-900 mt-0.5">
                                {item.val} <span className="text-xs font-semibold text-slate-500">cm</span>
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 flex items-center justify-between">
                          <Link
                            href={`/customers`}
                            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                          >
                            Lihat Riwayat Lengkap &rarr;
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setOrderForm({ ...orderForm, customerName: selectedCustomerForSize.name });
                              setActiveModal("new-order");
                            }}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm"
                          >
                            + Buat Pesanan
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8 text-slate-400 text-sm">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10"
            >
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600 rounded-xl">
                    <Receipt className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg">Catat Pembayaran</h3>
                    <p className="text-xs text-slate-400">Input transaksi DP atau Pelunasan</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-800 bg-white"
                  >
                    {orders.map((o) => (
                      <option key={o.code} value={o.code}>
                        {o.code} — {o.customerName} ({o.itemName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nominal Pembayaran (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="150000"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none text-base font-extrabold text-slate-900"
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
                            ? "bg-emerald-50 border-emerald-400 text-emerald-800 ring-2 ring-emerald-400/20"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
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