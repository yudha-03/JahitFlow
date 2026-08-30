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
  Search
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
  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);

    // Ambil akun yang tersimpan dari localStorage
    setTimeout(() => {
      const users = JSON.parse(
        localStorage.getItem("jahitflow_users") || "[]"
      );

      const user = users.find(
        (item: any) =>
          item.email.toLowerCase() === email.trim().toLowerCase() &&
          item.password === password
      );

      if (!user) {
        setErrors({
          general: "Email atau kata sandi belum benar. Silakan coba lagi.",
        });
        setIsLoading(false);
        return;
      }

      // Simpan informasi user yang sedang login
      localStorage.setItem(
        "jahitflow_current_user",
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          businessName: user.businessName,
          whatsapp: user.whatsapp,
          businessType: user.businessType,
          address: user.address,
        })
      );

      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="relative min-h-screen bg-slate-50 flex font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* TOMBOL KEMBALI */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 md:top-8 md:left-8 z-50 flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full shadow-sm transition-all hover:bg-white hover:text-indigo-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Kembali ke Beranda</span>
        <span className="sm:hidden">Kembali</span>
      </Link>

      {/* KIRI: MARKETING */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-50 flex-col justify-center p-12 xl:p-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-indigo-100/40 rounded-full blur-3xl" />
          <div className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 text-indigo-700 font-extrabold text-2xl tracking-tight mb-12">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-sm">
              <Scissors className="w-6 h-6" />
            </div>
            <span>JahitFlow</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-slate-900 leading-[1.15] tracking-tight mb-6">
              Kelola usaha jahit dengan lebih rapi dan mudah.
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-md leading-relaxed">
              Kelola pelanggan, ukuran, pesanan, dan pembayaran dalam satu sistem sederhana yang dirancang khusus untuk UMKM.
            </p>

            <div className="space-y-4">
              {[
                "Data pelanggan tersimpan rapi",
                "Ukuran pelanggan mudah ditemukan",
                "Pesanan lebih mudah dipantau"
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3 text-slate-700 font-medium text-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* KANAN: FORM LOGIN */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-6 py-12 sm:px-12 md:px-20 lg:px-24 shadow-[-20px_0_40px_-15px_rgba(0,0,0,0.03)] z-10 min-h-screen lg:min-h-0 relative">
        <div className="lg:hidden flex items-center gap-2 text-indigo-600 font-extrabold text-xl tracking-tight mt-8 mb-12">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Scissors className="w-5 h-5" />
          </div>
          <span>JahitFlow</span>
        </div>

        <div className="w-full max-w-md mx-auto lg:mx-0">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Selamat datang kembali 👋</h2>
            <p className="text-slate-500 text-lg mb-8">Masuk untuk melanjutkan pengelolaan usaha Anda.</p>

            <AnimatePresence>
              {errors.general && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-2.5 overflow-hidden"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{errors.general}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-5" noValidate>
              {/* Input Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <div className="relative flex items-center group">
                  <Mail className={`absolute left-4 w-5 h-5 transition-colors ${errors.email ? 'text-red-400' : 'text-slate-400 group-focus-within:text-indigo-500'}`} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email Anda"
                    // PENAMBAHAN CLASS: text-slate-900 placeholder-slate-400
                    className={`w-full h-14 pl-11 pr-4 bg-slate-50 border rounded-xl text-base text-slate-900 placeholder-slate-400 outline-none transition-all ${
                      errors.email 
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
                        : 'border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-300'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm font-medium flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="w-4 h-4" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Input Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  Kata Sandi
                </label>
                <div className="relative flex items-center group">
                  <Lock className={`absolute left-4 w-5 h-5 transition-colors ${errors.password ? 'text-red-400' : 'text-slate-400 group-focus-within:text-indigo-500'}`} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    // PENAMBAHAN CLASS: text-slate-900 placeholder-slate-400
                    className={`w-full h-14 pl-11 pr-12 bg-slate-50 border rounded-xl text-base text-slate-900 placeholder-slate-400 outline-none transition-all ${
                      errors.password 
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
                        : 'border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    className="absolute right-4 p-1 text-slate-400 hover:text-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm font-medium flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="w-4 h-4" /> {errors.password}
                  </p>
                )}
              </div>

              {/* Remember & Lupa Password */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded bg-white checked:bg-indigo-600 checked:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-1 transition-all cursor-pointer"
                    />
                    <CheckCircle2 className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                  </div>
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                    Ingat saya
                  </span>
                </label>
                <Link href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-all">
                  Lupa kata sandi?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 mt-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-lg rounded-xl transition-all shadow-sm shadow-indigo-600/20 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    Masuk <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 mb-8 border-t border-slate-200" />

            <p className="text-center text-slate-600 font-medium mb-6">
              Belum punya akun?{" "}
              <Link href="/register" className="text-indigo-600 font-bold hover:underline">
                Daftar sebagai Penjahit &rarr;
              </Link>
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center transition-colors hover:border-slate-300 hover:bg-slate-100">
              <div className="w-10 h-10 bg-white border border-slate-200 text-slate-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-slate-900 font-bold mb-1">Anda Pelanggan?</p>
              <p className="text-sm text-slate-500 mb-3">Tidak perlu login untuk mengecek status pakaian Anda.</p>
              <Link 
                href="/tracking" 
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-semibold rounded-xl transition-all text-sm"
              >
                Lacak Pesanan Saya &rarr;
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}