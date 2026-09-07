"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Trash2,
  Home // <-- Tambahan icon Home
} from "lucide-react"; //[cite: 6]

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
} //[cite: 6]

const INITIAL_CUSTOMERS: Customer[] = []; //[cite: 6]

// ============================================================================
// MAIN CUSTOMERS COMPONENT
// ============================================================================

export default function CustomersPage() {
  const pathname = "/customers";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // States
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
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
  }); //[cite: 6]

  // Ambil data dari localStorage saat halaman pertama kali dimuat
  useEffect(() => {
    const savedCustomers = localStorage.getItem("jahitflow_customers");
    if (savedCustomers) {
      try {
        setCustomers(JSON.parse(savedCustomers));
      } catch (error) {
        console.error("Gagal membaca data dari localStorage", error);
      }
    }
  }, []); //[cite: 6]

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }; //[cite: 6]

  // Filter Pelanggan
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase())
  ); //[cite: 6]

  // Menghitung pelanggan setia (misal: order lebih dari 1)
  const loyalCustomersCount = customers.filter(c => c.totalOrders > 1).length; //[cite: 6]

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerForm.name || !customerForm.phone) return;

    const newCust: Customer = {
      id: `CUST-00${customers.length + 1}`,
      name: customerForm.name,
      phone: customerForm.phone,
      address: customerForm.address || "Belum ada alamat",
      lastMeasurementDate: "Hari ini",
      totalOrders: 0,
      measurements: {
        lingkarDada: Number(customerForm.lingkarDada) || 0,
        lingkarPinggang: Number(customerForm.lingkarPinggang) || 0,
        lebarBahu: Number(customerForm.lebarBahu) || 0,
        panjangBaju: Number(customerForm.panjangBaju) || 0,
        panjangLengan: Number(customerForm.panjangLengan) || 0,
        panjangCelana: Number(customerForm.panjangCelana) || 0,
        lingkarPinggul: Number(customerForm.lingkarPinggul) || 0,
      },
    }; //[cite: 6]

    const updatedCustomers = [newCust, ...customers];
    setCustomers(updatedCustomers);
    localStorage.setItem("jahitflow_customers", JSON.stringify(updatedCustomers));

    setIsAddModalOpen(false);
    setCustomerForm({
      name: "", phone: "", address: "", lingkarDada: "", lingkarPinggang: "",
      lebarBahu: "", panjangBaju: "", panjangLengan: "", panjangCelana: "", lingkarPinggul: ""
    });
    showToast(`Pelanggan ${newCust.name} berhasil ditambahkan!`);
  }; //[cite: 6]

  // Fungsi Hapus Pelanggan
  const handleDeleteCustomer = (id: string, name: string) => {
    // Validasi pencegahan penghapusan tidak sengaja
    if (window.confirm(`Apakah Anda yakin ingin menghapus data pelanggan "${name}"?`)) {
      const updatedCustomers = customers.filter((c) => c.id !== id);
      setCustomers(updatedCustomers);
      localStorage.setItem("jahitflow_customers", JSON.stringify(updatedCustomers));
      showToast(`Data ${name} berhasil dihapus!`);
    }
  }; //[cite: 6]

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
  ]; //[cite: 6]

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Toast Feedback Notification */}
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
              <button type="button" title="Keluar" className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0">
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
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden focus:outline-none">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">Data Pelanggan</h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium hidden sm:block">Kelola kontak pelanggan dan riwayat ukuran badan.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* DITAMBAHKAN: Tombol Kembali ke Beranda */}
            <Link
              href="/"
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 hover:border-indigo-200 transition-all text-xs sm:text-sm font-bold shadow-sm"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali ke Beranda</span>
              <span className="sm:hidden">Beranda</span>
            </Link>

            <button type="button" className="relative p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors focus:outline-none">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">S</div>
              <span className="text-sm font-bold text-slate-800 hidden md:inline-block">Satria Tailor</span>
            </div>
          </div>
        </header>

        {/* Customers Page Content */}
        <main className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Total Pelanggan</p>
                <p className="text-2xl font-extrabold text-slate-900">{customers.length}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <Ruler className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Ukuran Terdaftar</p>
                <p className="text-2xl font-extrabold text-slate-900">{customers.length} Orang</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Langganan Setia</p>
                <p className="text-2xl font-extrabold text-slate-900">{loyalCustomersCount} Pelanggan</p>
              </div>
            </div>
          </div>

          {/* Search & Add Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama, No. WA, atau alamat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium transition-all shadow-sm text-slate-900 placeholder:text-slate-400"
              />
            </div>
            
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/20 transition-all w-full sm:w-auto justify-center"
            >
              <UserPlus className="w-4 h-4" /> Tambah Pelanggan
            </button>
          </div>

          {/* Customer Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((cust) => (
                <div
                  key={cust.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 font-extrabold flex items-center justify-center text-lg shrink-0 border border-indigo-100">
                          {cust.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-base leading-tight">{cust.name}</h3>
                          <span className="text-xs font-bold text-indigo-600">{cust.id}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <button 
                          onClick={() => handleDeleteCustomer(cust.id, cust.name)}
                          className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                          title="Hapus Pelanggan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                          {cust.totalOrders} Pesanan
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-800">{cust.phone}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate text-slate-800">{cust.address}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-800">Diukur: {cust.lastMeasurementDate}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setSelectedCustomer(cust);
                        setIsDetailModalOpen(true);
                      }}
                      className="flex-1 py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-amber-200/60"
                    >
                      <Ruler className="w-3.5 h-3.5 text-amber-600" /> Lihat Ukuran
                    </button>
                    <Link
                      href="/orders"
                      className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-sm"
                    >
                      + Pesanan
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="font-medium text-sm text-slate-600">Tidak ada pelanggan yang ditemukan.</p>
              </div>
            )}
          </div>

        </main>

        <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 px-4 sm:px-8 text-center text-xs font-medium text-slate-400">
          &copy; {new Date().getFullYear()} JahitFlow. Hak Cipta Dilindungi.
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
                  <div className="p-2 bg-indigo-600 rounded-xl">
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
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
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

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
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