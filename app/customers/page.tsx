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
  CheckCircle2,
  Menu,
  X,
  LogOut,
  UserPlus,
  Ruler,
  Phone,
  MapPin,
  Calendar,
  Eye,
  FileEdit,
  ShoppingBag,
  MoreVertical,
  ChevronRight,
  Trash2, // <-- Tambahan icon untuk hapus
  Home // <-- Tambahan icon Home
} from "lucide-react";

// ============================================================================
// TYPES & INITIAL DUMMY DATA
// ============================================================================

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  lastMeasurementDate: string;
  totalOrders: number;
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

// ============================================================================
// MAIN CUSTOMERS COMPONENT
// ============================================================================

export default function CustomersPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // States
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Form State untuk Tambah/Edit Pelanggan
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // User Profile State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      const data = await api.customers.getAll();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal memuat data pelanggan:", err);
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
    loadCustomers();
  }, []);

  // Filter Pelanggan (Aman dari properti undefined)
  const filteredCustomers = customers.filter(
    (c) =>
      (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone || "").includes(searchQuery) ||
      (c.address || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Menghitung pelanggan setia (misal: order lebih dari 1)
  const loyalCustomersCount = customers.filter(c => (c.totalOrders || 0) > 1).length;

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerForm.name || !customerForm.phone) return;

    try {
      const created = await api.customers.create({
        name: customerForm.name.trim(),
        phone: customerForm.phone.trim(),
        address: customerForm.address.trim() || undefined,
        measurements: {
          lingkarDada: Number(customerForm.lingkarDada) || 0,
          lingkarPinggang: Number(customerForm.lingkarPinggang) || 0,
          lebarBahu: Number(customerForm.lebarBahu) || 0,
          panjangBaju: Number(customerForm.panjangBaju) || 0,
          panjangLengan: Number(customerForm.panjangLengan) || 0,
          panjangCelana: Number(customerForm.panjangCelana) || 0,
          lingkarPinggul: Number(customerForm.lingkarPinggul) || 0,
        },
      });

      await loadCustomers();
      setIsAddModalOpen(false);
      setCustomerForm({
        name: "", phone: "", address: "", lingkarDada: "", lingkarPinggang: "",
        lebarBahu: "", panjangBaju: "", panjangLengan: "", panjangCelana: "", lingkarPinggul: ""
      });
      showToast(`Pelanggan ${created.name} berhasil disimpan ke database!`);
    } catch (err: any) {
      showToast(`Gagal menyimpan pelanggan: ${err.message}`);
    }
  };

  // Fungsi Hapus Pelanggan
  const handleDeleteCustomer = async (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data pelanggan "${name}"?`)) {
      try {
        await api.customers.delete(id);
        setCustomers(customers.filter((c) => c.id !== id));
        showToast(`Data ${name} berhasil dihapus dari database!`);
      } catch (err: any) {
        showToast(`Gagal menghapus pelanggan: ${err.message}`);
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
          className="sticky top-0 z-30 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-3 shadow-2xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-slate-600 hover:bg-stone-100 rounded-xl lg:hidden focus:outline-none shrink-0"
              aria-label="Buka Menu Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight truncate">Data Pelanggan</h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block truncate">Kelola kontak pelanggan dan riwayat ukuran badan.</p>
            </div>
          </div>

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

            <NotificationBell />

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

        {/* Customers Page Content */}
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="p-3.5 sm:p-8 space-y-5 sm:space-y-6 max-w-7xl w-full mx-auto"
        >
          
          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Pelanggan</p>
                <p className="text-2xl font-extrabold text-slate-900">{customers.length}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Ruler size={20} />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Ukuran Terdaftar</p>
                <p className="text-2xl font-extrabold text-slate-900">{customers.length} <span className="text-xs font-bold text-slate-400">Orang</span></p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <ShoppingBag size={20} />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Langganan Setia</p>
                <p className="text-2xl font-extrabold text-slate-900">{loyalCustomersCount} <span className="text-xs font-bold text-slate-400">Pelanggan</span></p>
              </div>
            </motion.div>
          </div>

          {/* Search & Add Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama, No. WA, atau alamat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 text-xs font-bold transition-all shadow-2xs text-slate-900 placeholder:text-slate-400"
              />
            </div>
            
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-700/20 transition-all w-full sm:w-auto justify-center"
            >
              <UserPlus className="w-4 h-4" /> Tambah Pelanggan
            </button>
          </div>

          {/* Customer Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((cust, idx) => (
                <motion.div
                  key={cust.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs p-5 hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-lg shrink-0 border border-indigo-200/50">
                          {cust.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-sm leading-tight">{cust.name}</h3>
                          <span className="text-[10px] font-bold text-indigo-600">{cust.id}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <button 
                          onClick={() => handleDeleteCustomer(cust.id, cust.name)}
                          className="text-slate-400 md:text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                          title="Hapus Pelanggan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="text-[10px] font-bold bg-stone-100 text-slate-600 px-2.5 py-1 rounded-lg">
                          {cust.totalOrders} Pesanan
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[11px] text-slate-600 font-medium pt-2 border-t border-stone-100">
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-800">{cust.phone}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate text-slate-800">{cust.address || "Alamat belum diatur"}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-800">Diukur: {cust.lastMeasurementDate || "-"}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setSelectedCustomer(cust);
                        setIsDetailModalOpen(true);
                      }}
                      className="flex-1 py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors border border-amber-200/60"
                    >
                      <Ruler className="w-3.5 h-3.5 text-amber-600" /> Lihat Ukuran
                    </button>
                    <Link
                      href="/orders"
                      className="py-2 px-3 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-colors shadow-sm"
                    >
                      + Pesanan
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-16 rounded-2xl border border-stone-200/80 text-center shadow-2xs"
                >
                  <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
                    <Users size={28} />
                  </div>
                  <p className="font-extrabold text-sm text-slate-900 mb-1">Belum Ada Data Pelanggan</p>
                  <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                    Mulai tambahkan pelanggan pertama Anda dengan klik tombol "Tambah Pelanggan" di atas.
                  </p>
                </motion.div>
              </div>
            )}
          </div>

        </motion.main>

        <footer className="mt-auto border-t border-stone-200/80 bg-[#FAF9F6] py-6 px-4 sm:px-8 text-center text-[10px] font-bold text-slate-400 tracking-wider uppercase">
          &copy; {new Date().getFullYear()} JahitFlow &mdash; Crafted for Artisan Tailors
        </footer>
      </div>

      {/* =====================================================================
          MODAL 1: TAMBAH PELANGGAN & UKURAN
          ===================================================================== */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
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
                  <div className="p-2 bg-indigo-700 rounded-xl">
                    <UserPlus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg">Tambah Pelanggan Baru</h3>
                    <p className="text-xs text-slate-400">Input informasi kontak dan catatan ukuran badan</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-900 placeholder:text-slate-400"
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
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Alamat Lengkap</label>
                    <input
                      type="text"
                      placeholder="Jl. Merdeka No. 45"
                      value={customerForm.address}
                      onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-900 placeholder:text-slate-400"
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
                            className="w-full pl-3 pr-7 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-extrabold text-slate-900 placeholder:text-slate-400/70"
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
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-stone-100 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-700 hover:bg-indigo-800 text-white shadow-md shadow-indigo-700/20 transition"
                  >
                    Simpan Pelanggan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          MODAL 2: DETAIL UKURAN PELANGGAN
          ===================================================================== */}
      <AnimatePresence>
        {isDetailModalOpen && selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 flex flex-col"
            >
              <div className="p-6 bg-amber-500 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-600 rounded-xl">
                    <Ruler className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg">{selectedCustomer.name}</h3>
                    <p className="text-xs text-amber-100">{selectedCustomer.phone}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-1.5 text-amber-100 hover:text-white rounded-lg hover:bg-amber-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase">Terakhir Diukur</span>
                  <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {selectedCustomer.lastMeasurementDate}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "Lingkar Dada", val: selectedCustomer.measurements.lingkarDada },
                    { name: "Lingkar Pinggang", val: selectedCustomer.measurements.lingkarPinggang },
                    { name: "Lebar Bahu", val: selectedCustomer.measurements.lebarBahu },
                    { name: "Panjang Baju", val: selectedCustomer.measurements.panjangBaju },
                    { name: "Panjang Lengan", val: selectedCustomer.measurements.panjangLengan },
                    { name: "Panjang Celana", val: selectedCustomer.measurements.panjangCelana },
                    { name: "Lingkar Pinggul", val: selectedCustomer.measurements.lingkarPinggul },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                      <p className="text-[11px] font-bold text-slate-500 uppercase truncate">{item.name}</p>
                      <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                        {item.val} <span className="text-xs font-semibold text-slate-500">cm</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#FAF9F6] border-t border-stone-100 flex justify-end">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}