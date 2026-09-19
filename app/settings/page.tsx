"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api, getAuthUser, clearAuthSession } from "@/lib/api";
import NotificationBell from "@/components/NotificationBell";
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
  CheckCircle2,
  Store,
  Lock,
  Landmark,
  Save,
  MessageSquare,
  Home,
  ShieldCheck,
  Check,
  Camera,
  Upload,
  Trash2
} from "lucide-react";

// ============================================================================
// MAIN SETTINGS COMPONENT
// ============================================================================

export default function SettingsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"profil" | "notifikasi" | "rekening" | "keamanan">("profil");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [storeName, setStoreName] = useState("Satria Tailor");
  const [ownerName, setOwnerName] = useState("Satria Pratama");
  const [phone, setPhone] = useState("081234567890");
  const [address, setAddress] = useState("Jl. Merdeka No. 45, Balikpapan, Kalimantan Timur");
  
  // Avatar Profile Photo State
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toggle States
  const [waInvoice, setWaInvoice] = useState(true);
  const [waReminder, setWaReminder] = useState(true);

  // Bank Info
  const [bankName, setBankName] = useState("BCA");
  const [accountNumber, setAccountNumber] = useState("1234567890");
  const [accountHolder, setAccountHolder] = useState("Satria Pratama");

  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      if (user.name) {
        setOwnerName(user.name);
        setAccountHolder(user.name);
      }
      if (user.business?.name) setStoreName(user.business.name);
      if (user.business?.whatsapp) setPhone(user.business.whatsapp);
      if (user.business?.address) setAddress(user.business.address);
      if (user.avatar) setAvatarUrl(user.avatar);
    }

    if (typeof window !== "undefined") {
      const savedAvatar = localStorage.getItem("jahitflow_avatar");
      if (savedAvatar) setAvatarUrl(savedAvatar);
    }

    api.auth.getProfile().then((profile) => {
      if (profile?.name) {
        setOwnerName(profile.name);
        setAccountHolder(profile.name);
      }
      if (profile?.business?.name) setStoreName(profile.business.name);
      if (profile?.business?.whatsapp) setPhone(profile.business.whatsapp);
      if (profile?.business?.address) setAddress(profile.business.address);
      if (profile?.avatar) setAvatarUrl(profile.avatar);
    }).catch(() => {});
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Maksimal 2MB
    if (file.size > 2 * 1024 * 1024) {
      showToast("Ukuran foto maksimal 2MB!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setAvatarUrl(base64);
      if (typeof window !== "undefined") {
        localStorage.setItem("jahitflow_avatar", base64);
        const user = getAuthUser();
        if (user) {
          user.avatar = base64;
          localStorage.setItem("jahitflow_user", JSON.stringify(user));
        }
      }
      showToast("Foto profil berhasil diperbarui!");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("jahitflow_avatar");
      const user = getAuthUser();
      if (user) {
        delete user.avatar;
        localStorage.setItem("jahitflow_user", JSON.stringify(user));
      }
    }
    showToast("Foto profil dihapus.");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const user = getAuthUser() || {};
      user.name = ownerName;
      if (!user.business) user.business = {};
      user.business.name = storeName;
      user.business.whatsapp = phone;
      user.business.address = address;
      if (avatarUrl) {
        user.avatar = avatarUrl;
        localStorage.setItem("jahitflow_avatar", avatarUrl);
      }
      localStorage.setItem("jahitflow_user", JSON.stringify(user));
    }
    showToast("Pengaturan profil berhasil disimpan!");
  };

  const handleLogout = () => {
    clearAuthSession();
    router.push("/login");
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
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-xs shrink-0 overflow-hidden border border-indigo-200">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    ownerName ? ownerName.charAt(0).toUpperCase() : "S"
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                    {ownerName || "Satria"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium truncate">
                    Pemilik Usaha
                  </p>
                </div>
              </div>
              <button
                type="button"
                title="Keluar"
                onClick={handleLogout}
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
          className="sticky top-0 z-30 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-stone-200/80 px-3 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-2.5 sm:gap-3 shadow-2xs"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-slate-600 hover:bg-stone-100 rounded-xl lg:hidden focus:outline-none shrink-0"
              aria-label="Buka Menu Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight truncate">
                Pengaturan
              </h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block truncate">
                Kelola profil atelier, integrasi notifikasi WhatsApp, dan data rekening toko.
              </p>
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
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  ownerName ? ownerName.charAt(0).toUpperCase() : "S"
                )}
              </div>
              <span className="text-xs font-extrabold text-slate-800 hidden md:inline-block">
                {storeName || "Satria Tailor"}
              </span>
            </div>
          </div>
        </motion.header>

        {/* Settings Content */}
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="p-3.5 sm:p-8 space-y-5 sm:space-y-6 max-w-5xl w-full mx-auto"
        >
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Sidebar Tabs (Horizontal Scroll di Mobile, Sidebar di Desktop) */}
            <div className="md:col-span-1 flex md:flex-col gap-2 overflow-x-auto hide-scrollbar pb-1 md:pb-0">
              <button
                type="button"
                onClick={() => setActiveTab("profil")}
                className={`whitespace-nowrap flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl text-xs font-bold transition-all shadow-2xs shrink-0 md:w-full ${
                  activeTab === "profil" 
                    ? "bg-indigo-700 text-white shadow-md shadow-indigo-700/20" 
                    : "bg-white text-slate-600 hover:bg-stone-100 border border-stone-200/80"
                }`}
              >
                <Store className="w-4 h-4 shrink-0" />
                <span>Profil Usaha</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("notifikasi")}
                className={`whitespace-nowrap flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl text-xs font-bold transition-all shadow-2xs shrink-0 md:w-full ${
                  activeTab === "notifikasi" 
                    ? "bg-indigo-700 text-white shadow-md shadow-indigo-700/20" 
                    : "bg-white text-slate-600 hover:bg-stone-100 border border-stone-200/80"
                }`}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>Notifikasi WA</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("rekening")}
                className={`whitespace-nowrap flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl text-xs font-bold transition-all shadow-2xs shrink-0 md:w-full ${
                  activeTab === "rekening" 
                    ? "bg-indigo-700 text-white shadow-md shadow-indigo-700/20" 
                    : "bg-white text-slate-600 hover:bg-stone-100 border border-stone-200/80"
                }`}
              >
                <Landmark className="w-4 h-4 shrink-0" />
                <span>Rekening Bank</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("keamanan")}
                className={`whitespace-nowrap flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl text-xs font-bold transition-all shadow-2xs shrink-0 md:w-full ${
                  activeTab === "keamanan" 
                    ? "bg-indigo-700 text-white shadow-md shadow-indigo-700/20" 
                    : "bg-white text-slate-600 hover:bg-stone-100 border border-stone-200/80"
                }`}
              >
                <Lock className="w-4 h-4 shrink-0" />
                <span>Keamanan</span>
              </button>
            </div>

            {/* Tab Form Panels */}
            <div className="md:col-span-3">
              <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-2xs space-y-6">
                
                {/* TAB 1: PROFIL USAHA */}
                {activeTab === "profil" && (
                  <div className="space-y-5">
                    <div className="border-b border-stone-100 pb-4">
                      <h2 className="text-base font-extrabold text-slate-900">Profil Usaha Jahitan</h2>
                      <p className="text-xs text-slate-400 font-medium">Informasi ini akan dicetak pada nota resi dan kwitansi pelanggan.</p>
                    </div>

                    {/* Avatar Upload Section */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-[#FAF9F6] border border-stone-200/90">
                      <div className="relative group shrink-0">
                        <div className="w-20 h-20 rounded-2xl bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-2xl overflow-hidden border-2 border-indigo-200 shadow-xs">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={ownerName || "Foto Profil"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>{ownerName ? ownerName.charAt(0).toUpperCase() : "S"}</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 bg-slate-950/40 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Ubah Foto"
                        >
                          <Camera className="w-6 h-6" />
                        </button>
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-bold text-slate-900">Foto Profil Penjahit</h3>
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                            Opsional
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Format JPG, PNG, atau WebP (maks. 2MB). Foto ini akan ditampilkan pada avatar meja kerja dan sidebar Anda.
                        </p>

                        <div className="flex items-center gap-2 pt-1">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition flex items-center gap-1.5"
                          >
                            <Upload className="w-3.5 h-3.5" /> Pilih Foto
                          </button>

                          {avatarUrl && (
                            <button
                              type="button"
                              onClick={handleRemoveAvatar}
                              className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-stone-200 hover:border-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Hapus
                            </button>
                          )}
                        </div>
                      </div>
                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Nama Usaha / Toko</label>
                        <input
                          type="text"
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 outline-none text-xs font-bold text-slate-900 transition bg-[#FAF9F6]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Nama Pemilik</label>
                        <input
                          type="text"
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 outline-none text-xs font-bold text-slate-900 transition bg-[#FAF9F6]/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Nomor WhatsApp Resmi Toko</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 outline-none text-xs font-bold text-slate-900 transition bg-[#FAF9F6]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Alamat Lengkap Workshop / Toko</label>
                      <textarea
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 outline-none text-xs font-bold text-slate-900 transition bg-[#FAF9F6]/50 resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 2: NOTIFIKASI WHATSAPP */}
                {activeTab === "notifikasi" && (
                  <div className="space-y-5">
                    <div className="border-b border-stone-100 pb-4">
                      <h2 className="text-base font-extrabold text-slate-900">Pengaturan Notifikasi WhatsApp</h2>
                      <p className="text-xs text-slate-400 font-medium">Atur pesan otomatis untuk konfirmasi pesanan dan informasi pengerjaan busana.</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-[#FAF9F6] rounded-2xl border border-stone-200/80 gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900">Kirim Nota Otomatis via WA</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Pelanggan akan menerima bukti nota/DP langsung ke WA setelah transaksi dicatat.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={waInvoice}
                          onChange={(e) => setWaInvoice(e.target.checked)}
                          className="w-4 h-4 text-indigo-700 rounded focus:ring-indigo-600 cursor-pointer accent-indigo-700"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-[#FAF9F6] rounded-2xl border border-stone-200/80 gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900">Pengingat Jahitan Selesai</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Kirim pesan pemberitahuan otomatis saat status pesanan diubah menjadi "Siap Diambil".</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={waReminder}
                          onChange={(e) => setWaReminder(e.target.checked)}
                          className="w-4 h-4 text-indigo-700 rounded focus:ring-indigo-600 cursor-pointer accent-indigo-700"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: REKENING BANK */}
                {activeTab === "rekening" && (
                  <div className="space-y-5">
                    <div className="border-b border-stone-100 pb-4">
                      <h2 className="text-base font-extrabold text-slate-900">Rekening Pembayaran DP & Pelunasan</h2>
                      <p className="text-xs text-slate-400 font-medium">Rekening ini tertera saat pelanggan memilih metode transfer bank atau QRIS.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Pilihan Bank</label>
                        <select 
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 outline-none text-xs font-bold text-slate-900 transition bg-[#FAF9F6]/50"
                        >
                          <option>BCA</option>
                          <option>Mandiri</option>
                          <option>BRI</option>
                          <option>BNI</option>
                          <option>BSI</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Nomor Rekening</label>
                        <input
                          type="text"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 outline-none text-xs font-bold text-slate-900 transition bg-[#FAF9F6]/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Atas Nama Pemilik Rekening</label>
                      <input
                        type="text"
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 outline-none text-xs font-bold text-slate-900 transition bg-[#FAF9F6]/50"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 4: KEAMANAN */}
                {activeTab === "keamanan" && (
                  <div className="space-y-5">
                    <div className="border-b border-stone-100 pb-4">
                      <h2 className="text-base font-extrabold text-slate-900">Keamanan & Kata Sandi</h2>
                      <p className="text-xs text-slate-400 font-medium">Amankan akun usaha Anda dengan kombinasi kata sandi terenkripsi.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Kata Sandi Saat Ini</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 outline-none text-xs font-bold text-slate-900 transition bg-[#FAF9F6]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Kata Sandi Baru</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 outline-none text-xs font-bold text-slate-900 transition bg-[#FAF9F6]/50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Action Button */}
                <div className="pt-4 border-t border-stone-100 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-700/20 transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>

              </form>
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