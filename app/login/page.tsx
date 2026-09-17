"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scissors,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Search,
  Sparkles,
  ShieldCheck,
  Check
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  
  // State form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // State interaksi
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    
    // Front-end validation sederhana
    let hasError = false;
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      newErrors.email = "Email wajib diisi.";
      hasError = true;
    }
    if (!password) {
      newErrors.password = "Kata sandi wajib diisi.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // Front-end saja: langsung masuk ke dashboard, tanpa pengecekan data apa pun
    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen bg-[#FBF9F5] flex font-sans selection:bg-indigo-100 selection:text-indigo-900 text-slate-800">
      
      {/* FLOATING TOMBOL KEMBALI (ADAPTIF: GELAP DI DESKTOP, TERANG DI MOBILE) */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 md:top-8 md:left-8 z-50 flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all active:scale-95 group rounded-full backdrop-blur-md shadow-atelier focus:outline-none
        bg-white/90 text-slate-700 border border-stone-200/90 hover:bg-white hover:text-indigo-700 hover:border-indigo-300
        lg:bg-white/10 lg:text-white lg:border-white/20 lg:hover:bg-white/20 lg:hover:text-amber-300 lg:hover:border-amber-300/40"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        <span className="hidden sm:inline">Kembali ke Beranda</span>
        <span className="sm:hidden">Kembali</span>
      </Link>

      {/* PANEL KIRI: ATELIER SHOWCASE VISUAL */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 relative overflow-hidden flex-col justify-between p-12 xl:p-16 text-white shadow-2xl">
        {/* Ambient Lighting Orbs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Logo Header */}
        <div className="relative z-10 flex items-center gap-3 mt-12">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 border border-indigo-400/40 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Scissors size={22} className="transform -rotate-45" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold tracking-tight text-white leading-tight">
              Jahit<span className="text-indigo-400">Flow</span>
            </span>
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
              Meja Kerja Digital Penjahit
            </span>
          </div>
        </div>

        {/* Main Copy */}
        <div className="relative z-10 max-w-lg mt-10 mb-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/60 border border-indigo-700/80 text-amber-300 text-xs font-bold shadow-xs">
            <Sparkles size={13} className="text-amber-300" />
            <span>Portal Masuk Pemilik & Karyawan Jahit</span>
          </div>

          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold leading-[1.15] tracking-tight text-white">
            Kelola usaha jahit dengan lebih rapi dan mudah.
          </h1>
          
          <p className="text-indigo-200 text-base leading-relaxed font-normal">
            Buka meja kerja digital Anda. Pantau antrean pesanan, data ukuran pelanggan, dan pencatatan pembayaran dalam satu sistem praktis.
          </p>

          {/* Benefit Cards */}
          <div className="space-y-3.5 pt-2">
            {[
              { title: "Data pelanggan & ukuran tersimpan rapi", desc: "Temukan riwayat ukuran lama pelanggan dalam 2 detik" },
              { title: "Status pesanan berjalan terpantau", desc: "Ketahui baju mana yang dipotong, dijahit, dan siap diambil" },
              { title: "Pencatatan DP & sisa tagihan otomatis", desc: "Tidak ada lagi resiko salah hitung atau nota kertas terselip" }
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3.5 bg-indigo-900/40 p-3.5 rounded-2xl border border-indigo-800/60">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <Check size={16} strokeWidth={3} />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">{benefit.title}</p>
                  <p className="text-indigo-300 text-xs">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Copyright */}
        <div className="relative z-10 text-indigo-300/80 text-xs pt-6 border-t border-indigo-800/60 flex items-center justify-between">
          <span>© {new Date().getFullYear()} JahitFlow.</span>
          <span className="flex items-center gap-1.5 text-amber-300/90 font-medium">
            <ShieldCheck size={14} /> Terpercaya & Aman
          </span>
        </div>
      </div>

      {/* PANEL KANAN: FORM LOGIN */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 sm:px-12 md:px-20 lg:px-20 min-h-screen relative overflow-y-auto">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Mobile Brand Header */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8 pt-12">
          <div className="w-8 h-8 rounded-xl bg-indigo-700 text-white flex items-center justify-center shadow-xs">
            <Scissors size={18} className="transform -rotate-45" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            Jahit<span className="text-indigo-700">Flow</span>
          </span>
        </div>

        <div className="w-full max-w-md mx-auto lg:mx-0">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1.5">
                Selamat datang kembali 👋
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Masuk untuk melanjutkan pengelolaan meja kerja usaha jahit Anda.
              </p>
            </div>

            {/* General Error Alert */}
            <AnimatePresence>
              {errors.general && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-bold flex items-start gap-2.5 overflow-hidden shadow-2xs"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <p>{errors.general}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-4" noValidate>
              
              {/* Input Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className={`block w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm border ${
                      errors.email ? "border-rose-400 ring-2 ring-rose-100 bg-rose-50/20" : "border-stone-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10"
                    } rounded-xl text-slate-900 placeholder-stone-400 outline-none transition-all bg-white shadow-2xs`}
                  />
                </div>
                {errors.email && (
                  <p className="text-rose-600 text-xs font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Input Password */}
              <div>
                <label htmlFor="password" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className={`block w-full pl-10 pr-11 py-2.5 text-xs sm:text-sm border ${
                      errors.password ? "border-rose-400 ring-2 ring-rose-100 bg-rose-50/20" : "border-stone-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10"
                    } rounded-xl text-slate-900 placeholder-stone-400 outline-none transition-all bg-white shadow-2xs`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-rose-600 text-xs font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.password}
                  </p>
                )}
              </div>

              {/* Remember & Lupa Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-indigo-700 border-stone-300 rounded focus:ring-indigo-600 accent-indigo-700 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition">
                    Ingat saya
                  </span>
                </label>
                <Link href="#" className="text-xs font-bold text-indigo-700 hover:text-indigo-800 hover:underline transition">
                  Lupa kata sandi?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white bg-indigo-700 hover:bg-indigo-800 shadow-md shadow-indigo-700/25 active:scale-95 font-bold text-sm transition-all mt-4 group"
              >
                <span>Masuk ke Dashboard</span>
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>

            <div className="my-6 border-t border-stone-200/80" />

            <p className="text-center text-xs text-slate-500 mb-6">
              Belum punya akun?{" "}
              <Link href="/register" className="font-bold text-indigo-700 hover:text-indigo-800 hover:underline">
                Daftar sebagai Penjahit &rarr;
              </Link>
            </p>

            {/* CUSTOMER SELF-TRACKING NOTICE CARD */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 text-center shadow-atelier relative overflow-hidden">
              <div className="w-9 h-9 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center mx-auto mb-2.5 border border-indigo-100 shadow-2xs">
                <Search size={16} />
              </div>
              <p className="text-slate-900 font-extrabold text-xs sm:text-sm mb-1">Anda Pelanggan Jahit?</p>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Tidak perlu login untuk mengecek perkembangan jahitan pakaian Anda. Cukup gunakan nomor nota.
              </p>
              <Link 
                href="/tracking" 
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-[#FAF9F6] hover:bg-indigo-50 hover:text-indigo-700 border border-stone-200 hover:border-indigo-200 text-slate-700 font-bold rounded-xl transition text-xs shadow-2xs active:scale-95"
              >
                <span>Lacak Pesanan Saya Tanpa Login</span>
                <ArrowRight size={13} />
              </Link>
            </div>

          </motion.div>
        </div>
      </div>

    </div>
  );
}