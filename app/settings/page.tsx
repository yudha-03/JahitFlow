"use client";

import React, { useState } from "react";
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
  ShieldAlert,
  Home // <-- Tambahan icon Home
} from "lucide-react"; //[cite: 9]

// ============================================================================
// MAIN SETTINGS COMPONENT
// ============================================================================

export default function SettingsPage() {
  const pathname = "/settings";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"profil" | "notifikasi" | "rekening" | "keamanan">("profil");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State Dummy
  const [storeName, setStoreName] = useState("Satria Tailor");
  const [ownerName, setOwnerName] = useState("Satria Pratama");
  const [phone, setPhone] = useState("081234567890");
  const [address, setAddress] = useState("Jl. Merdeka No. 45, Balikpapan, Kalimantan Timur");
  
  // Toggle States
  const [waInvoice, setWaInvoice] = useState(true);
  const [waReminder, setWaReminder] = useState(true);

  // Bank Info
  const [bankName, setBankName] = useState("BCA");
  const [accountNumber, setAccountNumber] = useState("1234567890");
  const [accountHolder, setAccountHolder] = useState("Satria Pratama");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }; //[cite: 9]

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Pengaturan berhasil disimpan!");
  }; //[cite: 9]

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
  ]; //[cite: 9]

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
              <button type="button" className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Header Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-4 flex items-center justify-between gap-2 sm:gap-4 overflow-hidden">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden focus:outline-none shrink-0">
              <Menu className="w-6 h-6" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight truncate">Pengaturan</h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium hidden sm:block truncate">Kelola profil usaha, integrasi notifikasi, dan keamanan akun.</p>
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
            <div className="flex items-center gap-2 sm:gap-2.5 pl-2 sm:pl-3 border-l border-slate-200 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">S</div>
              <span className="text-sm font-bold text-slate-800 hidden md:inline-block">Satria Tailor</span>
            </div>
          </div>
        </header>

        {/* Settings Content */}
        <main className="p-4 sm:p-8 space-y-6 max-w-5xl w-full mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Sidebar Tabs */}
            <div className="md:col-span-1 space-y-1">
              <button
                onClick={() => setActiveTab("profil")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === "profil" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Store className="w-4 h-4" /> Profil Usaha
              </button>

              <button
                onClick={() => setActiveTab("notifikasi")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === "notifikasi" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp / Notifikasi
              </button>

              <button
                onClick={() => setActiveTab("rekening")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === "rekening" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Landmark className="w-4 h-4" /> Rekening Bank
              </button>

              <button
                onClick={() => setActiveTab("keamanan")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === "keamanan" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Lock className="w-4 h-4" /> Keamanan
              </button>
            </div>

            {/* Tab Form Panels */}
            <div className="md:col-span-3">
              <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                
                {/* TAB 1: PROFIL USAHA */}
                {activeTab === "profil" && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">Profil Usaha Jahitan</h3>
                      <p className="text-xs text-slate-500 font-medium">Informasi ini akan dicetak pada nota/kwitansi pelanggan.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Usaha / Toko</label>
                        <input
                          type="text"
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Pemilik</label>
                        <input
                          type="text"
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nomor WhatsApp Resmi Toko</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Alamat Toko</label>
                      <textarea
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold text-slate-900 resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 2: NOTIFIKASI WHATSAPP */}
                {activeTab === "notifikasi" && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">Pengaturan Notifikasi WhatsApp</h3>
                      <p className="text-xs text-slate-500 font-medium">Atur pengiriman pesan otomatis ke nomor HP pelanggan.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                          <p className="text-sm font-bold text-slate-800">Kirim Nota Otomatis via WA</p>
                          <p className="text-xs text-slate-500">Pelanggan akan menerima bukti bayar/DP langsung ke WA setelah transaksi dicatat.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={waInvoice}
                          onChange={(e) => setWaInvoice(e.target.checked)}
                          className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                          <p className="text-sm font-bold text-slate-800">Pengingat Jahitan Selesai</p>
                          <p className="text-xs text-slate-500">Kirim pesan otomatis saat status pesanan diubah menjadi "Selesai Siap Ambil".</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={waReminder}
                          onChange={(e) => setWaReminder(e.target.checked)}
                          className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: REKENING BANK */}
                {activeTab === "rekening" && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">Rekening Pembayaran DP / Transfer</h3>
                      <p className="text-xs text-slate-500 font-medium">Rekening ini digunakan saat pelanggan meminta pilihan pembayaran transfer.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Bank</label>
                        <select 
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold text-slate-900 bg-white"
                        >
                          <option>BCA</option>
                          <option>Mandiri</option>
                          <option>BRI</option>
                          <option>BNI</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nomor Rekening</label>
                        <input
                          type="text"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Atas Nama (A/N)</label>
                      <input
                        type="text"
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold text-slate-900"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 4: KEAMANAN */}
                {activeTab === "keamanan" && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">Ubah Kata Sandi</h3>
                      <p className="text-xs text-slate-500 font-medium">Amankan akun usaha Anda dengan kombinasi kata sandi yang kuat.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kata Sandi Saat Ini</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kata Sandi Baru</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all"
                  >
                    <Save className="w-4 h-4" /> Simpan Perubahan
                  </button>
                </div>

              </form>
            </div>

          </div>

        </main>

        <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 px-4 sm:px-8 text-center text-xs font-medium text-slate-400">
          &copy; {new Date().getFullYear()} JahitFlow. Hak Cipta Dilindungi.
        </footer>
      </div>
    </div>
  );
}