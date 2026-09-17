"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  ArrowRight,
  ArrowLeft,
  Building2,
  Phone,
  MapPin,
  Scissors,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================
type Step = 1 | 2 | 3;

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
  businessName: string;
  whatsapp: string;
  businessType: string;
  address: string;
}

// ============================================================================
// MAIN COMPONENT: Register Page
// ============================================================================
export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
    businessName: "",
    whatsapp: "",
    businessType: "Usaha Jahit",
    address: "",
  });

  const handleNextStep = (newStep: Step) => setStep(newStep);
  const handleBackStep = (newStep: Step) => setStep(newStep);

  return (
    <div className="relative min-h-screen flex bg-[#FBF9F5] text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
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
      <RegisterVisual />
      
      {/* PANEL KANAN: FORMULIR MULTI-STEP */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 md:p-16 overflow-y-auto relative">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="w-full max-w-md pt-16 lg:pt-0">
          
          {/* Mobile Logo Brand */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-indigo-700 text-white flex items-center justify-center shadow-xs">
              <Scissors size={18} className="transform -rotate-45" />
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              Jahit<span className="text-indigo-700">Flow</span>
            </span>
          </div>

          {/* Step Progress Indicator */}
          {step < 3 && <ProgressIndicator step={step} />}

          {/* Form Content Steps */}
          <div className="relative mt-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <AccountStep
                  key="step1"
                  formData={formData}
                  setFormData={setFormData}
                  onNext={() => handleNextStep(2)}
                />
              )}
              {step === 2 && (
                <BusinessStep
                  key="step2"
                  formData={formData}
                  setFormData={setFormData}
                  onBack={() => handleBackStep(1)}
                  onNext={() => handleNextStep(3)}
                />
              )}
              {step === 3 && (
                <SuccessState key="step3" formData={formData} />
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const RegisterVisual = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 relative overflow-hidden flex-col justify-between p-12 text-white shadow-2xl">
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
            Sistem Operasional Digital Usaha Jahit
          </span>
        </div>
      </div>

      {/* Main Copy */}
      <div className="relative z-10 max-w-lg mt-10 mb-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/60 border border-indigo-700/80 text-amber-300 text-xs font-bold shadow-xs">
          <Sparkles size={13} className="text-amber-300" />
          <span>Registrasi Khusus Penjahit & Modiste</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-white">
          Bawa usaha jahit Anda ke langkah digital berikutnya.
        </h1>
        
        <p className="text-indigo-200 text-base leading-relaxed font-normal">
          Kelola pelanggan, parameter ukuran badan, pesanan, dan pembayaran dalam satu sistem yang sederhana dan teratur.
        </p>

        {/* Feature Highlights */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-3.5 bg-indigo-900/40 p-3 rounded-2xl border border-indigo-800/60">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Check size={16} strokeWidth={3} />
            </div>
            <div>
              <p className="text-white text-sm font-bold">Data pelanggan & ukuran tersimpan rapi</p>
              <p className="text-indigo-300 text-xs">Cari ukuran lama dalam 2 detik tanpa bongkar buku</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-indigo-900/40 p-3 rounded-2xl border border-indigo-800/60">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Check size={16} strokeWidth={3} />
            </div>
            <div>
              <p className="text-white text-sm font-bold">Status pesanan transparan</p>
              <p className="text-indigo-300 text-xs">Tahu persis mana yang sedang dipotong, dijahit, & siap diambil</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-indigo-900/40 p-3 rounded-2xl border border-indigo-800/60">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Check size={16} strokeWidth={3} />
            </div>
            <div>
              <p className="text-white text-sm font-bold">Pencatatan DP & sisa pelunasan otomatis</p>
              <p className="text-indigo-300 text-xs">Tidak ada lagi catatan keuangan yang tercecer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="relative z-10 text-indigo-300/80 text-xs pt-6 border-t border-indigo-800/60 flex items-center justify-between">
        <span>© {new Date().getFullYear()} JahitFlow.</span>
        <span className="flex items-center gap-1.5 text-amber-300/90 font-medium">
          <ShieldCheck size={14} /> Terpercaya & Aman
        </span>
      </div>
    </div>
  );
};

const ProgressIndicator = ({ step }: { step: Step }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
          Langkah {step} dari 2
        </p>
        <span className="text-xs font-semibold text-slate-500">
          {step === 1 ? "Informasi Akun" : "Profil Usaha"}
        </span>
      </div>

      <div className="flex items-center w-full">
        {/* Step 1 Circle */}
        <div className="flex items-center text-indigo-700">
          <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-indigo-700 text-white font-extrabold text-xs shadow-xs">
            {step > 1 ? <Check size={15} strokeWidth={3} /> : "1"}
          </div>
          <span className="ml-2.5 text-xs font-bold text-slate-800">Akun</span>
        </div>
        
        {/* Connecting Stitched Line */}
        <div className="flex-1 px-3">
          <div className={`h-1 w-full rounded-full transition-all duration-300 ${
            step > 1 ? "bg-indigo-700" : "bg-stone-200"
          }`} />
        </div>

        {/* Step 2 Circle */}
        <div className={`flex items-center ${step === 2 ? "text-indigo-700" : "text-stone-400"}`}>
          <div className={`w-8 h-8 flex items-center justify-center rounded-xl border-2 text-xs font-extrabold transition-all duration-300 ${
            step === 2 
              ? "border-indigo-700 bg-white text-indigo-700 shadow-xs ring-4 ring-indigo-100" 
              : "border-stone-200 bg-white text-stone-400"
          }`}>
            2
          </div>
          <span className="ml-2.5 text-xs font-bold">Usaha</span>
        </div>
      </div>
    </div>
  );
};

const AccountStep = ({
  formData,
  setFormData,
  onNext,
}: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nama wajib diisi.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Masukkan alamat email yang valid.";
    if (formData.password.length < 8) newErrors.password = "Kata sandi minimal 8 karakter.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Kata sandi belum sama.";
    if (!formData.agree) newErrors.agree = "Anda harus menyetujui ketentuan penggunaan.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onNext();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 15 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -15 }} 
      transition={{ duration: 0.25 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1.5">
          Mulai Bersama JahitFlow 🧵
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Buat akun untuk mulai mengelola meja kerja digital usaha jahit Anda.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Nama Pemilik */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Pemilik</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User size={18} />
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`block w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm border ${
                errors.name ? "border-rose-400 ring-2 ring-rose-100 bg-rose-50/20" : "border-stone-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10"
              } rounded-xl text-slate-900 placeholder-stone-400 outline-none transition-all bg-white shadow-2xs`}
              placeholder="Masukkan nama lengkap pemilik"
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail size={18} />
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`block w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm border ${
                errors.email ? "border-rose-400 ring-2 ring-rose-100 bg-rose-50/20" : "border-stone-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10"
              } rounded-xl text-slate-900 placeholder-stone-400 outline-none transition-all bg-white shadow-2xs`}
              placeholder="nama@email.com"
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email}</p>}
        </div>

        {/* Kata Sandi */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Kata Sandi</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`block w-full pl-10 pr-11 py-2.5 text-xs sm:text-sm border ${
                errors.password ? "border-rose-400 ring-2 ring-rose-100 bg-rose-50/20" : "border-stone-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10"
              } rounded-xl text-slate-900 placeholder-stone-400 outline-none transition-all bg-white shadow-2xs`}
              placeholder="Minimal 8 karakter"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.password}</p>}
        </div>

        {/* Konfirmasi Kata Sandi */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Konfirmasi Kata Sandi</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock size={18} />
            </div>
            <input
              type={showConfirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className={`block w-full pl-10 pr-11 py-2.5 text-xs sm:text-sm border ${
                errors.confirmPassword ? "border-rose-400 ring-2 ring-rose-100 bg-rose-50/20" : "border-stone-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10"
              } rounded-xl text-slate-900 placeholder-stone-400 outline-none transition-all bg-white shadow-2xs`}
              placeholder="Ulangi kata sandi"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
              aria-label={showConfirm ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.confirmPassword}</p>}
        </div>

        {/* Checkbox Ketentuan */}
        <div className="flex items-start pt-1">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              checked={formData.agree}
              onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
              className="w-4 h-4 text-indigo-700 border-stone-300 rounded focus:ring-indigo-600 accent-indigo-700"
            />
          </div>
          <div className="ml-2.5 text-xs">
            <label htmlFor="terms" className="font-medium text-slate-600 cursor-pointer">
              Saya menyetujui ketentuan penggunaan & privasi JahitFlow
            </label>
            {errors.agree && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.agree}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white bg-indigo-700 hover:bg-indigo-800 shadow-md shadow-indigo-700/25 active:scale-95 font-bold text-sm transition-all mt-4"
        >
          <span>Lanjutkan ke Profil Usaha</span>
          <ArrowRight size={16} />
        </button>

        <p className="text-center text-xs text-slate-500 pt-2">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-bold text-indigo-700 hover:text-indigo-800 hover:underline">
            Masuk di sini →
          </Link>
        </p>
      </form>
    </motion.div>
  );
};

const BusinessStep = ({
  formData,
  setFormData,
  onBack,
  onNext,
}: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onBack: () => void;
  onNext: () => void;
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.businessName.trim()) newErrors.businessName = "Nama usaha wajib diisi.";
    
    const phoneRegex = /^(\+62|62|0)[0-9]{8,14}$/;
    if (!phoneRegex.test(formData.whatsapp.replace(/\s+/g, ""))) {
      newErrors.whatsapp = "Masukkan nomor WhatsApp yang valid.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onNext();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 15 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -15 }} 
      transition={{ duration: 0.25 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1.5">
          Profil Usaha Jahit Anda ✂️
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Informasi ini digunakan untuk menyiapkan meja kerja khusus untuk usaha jahit Anda.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Nama Usaha */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Usaha Jahit / Tailor</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Building2 size={18} />
            </div>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className={`block w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm border ${
                errors.businessName ? "border-rose-400 ring-2 ring-rose-100 bg-rose-50/20" : "border-stone-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10"
              } rounded-xl text-slate-900 placeholder-stone-400 outline-none transition-all bg-white shadow-2xs`}
              placeholder="Contoh: Satria Tailor / Butik Melati"
            />
          </div>
          {errors.businessName && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.businessName}</p>}
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Nomor WhatsApp Usaha</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone size={18} />
            </div>
            <input
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className={`block w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm border ${
                errors.whatsapp ? "border-rose-400 ring-2 ring-rose-100 bg-rose-50/20" : "border-stone-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10"
              } rounded-xl text-slate-900 placeholder-stone-400 outline-none transition-all bg-white shadow-2xs`}
              placeholder="Contoh: 081234567890"
            />
          </div>
          {errors.whatsapp && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.whatsapp}</p>}
        </div>

        {/* Jenis Usaha Dropdown */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Kategori Usaha</label>
          <select
            value={formData.businessType}
            onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
            className="block w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-200 rounded-xl text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all bg-white shadow-2xs"
          >
            <option value="Usaha Jahit">Usaha Jahit Perorangan / Rumahan</option>
            <option value="Konveksi">Konveksi / Bengkel Jahit</option>
            <option value="Butik">Butik & Custom Dress</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        {/* Alamat Usaha */}
        <div>
          <label className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
            <span>Alamat Usaha</span>
            <span className="text-slate-400 font-normal text-[11px]">Opsional</span>
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
              <MapPin size={18} />
            </div>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="block w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm border border-stone-200 rounded-xl text-slate-900 placeholder-stone-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all bg-white resize-none shadow-2xs"
              placeholder="Masukkan alamat toko atau tempat jahit Anda"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 border border-stone-200 rounded-xl text-slate-700 bg-white hover:bg-stone-50 font-bold text-xs transition active:scale-95"
          >
            <ArrowLeft size={16} />
            <span>Kembali</span>
          </button>
          
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-white bg-indigo-700 hover:bg-indigo-800 font-bold text-xs shadow-md shadow-indigo-700/25 transition active:scale-95"
          >
            <span>Selesaikan Pendaftaran</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const SuccessState = ({ formData }: { formData: FormData }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoToDashboard = () => {
    setIsLoading(true);
    router.push("/dashboard");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.35, ease: "easeOut" }} 
      className="text-center"
    >
      <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xs border border-emerald-200/80">
        <Check size={32} strokeWidth={3} />
      </div>
      
      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
        Usaha Anda Siap! 🎉
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-sm mx-auto leading-relaxed">
        Selamat datang di JahitFlow. Ruang kerja digital untuk usaha jahit Anda telah berhasil disiapkan.
      </p>

      {/* Atelier Membership Card Preview */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-5 text-left shadow-atelier mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-3 border-b border-stone-100 pb-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-700 text-white flex items-center justify-center shadow-xs">
            <Scissors size={20} className="transform -rotate-45" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Meja Kerja Digital Terdaftar</span>
            <h3 className="text-base font-extrabold text-slate-900">{formData.businessName || "Usaha Jahit"}</h3>
          </div>
        </div>

        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <User size={15} className="text-slate-400" />
            <span>Pemilik: <strong className="text-slate-900 font-bold">{formData.name}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-600" />
            <span>Kategori: <strong>{formData.businessType}</strong></span>
          </div>
        </div>
      </div>

      {/* Button to Dashboard */}
      <button
        onClick={handleGoToDashboard}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-white bg-indigo-700 hover:bg-indigo-800 shadow-md shadow-indigo-700/30 font-bold text-sm transition-all active:scale-95 disabled:bg-indigo-400 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
          />
        ) : (
          <>
            <span>Masuk ke Dashboard Penjahit</span>
            <ArrowRight size={16} />
          </>
        )}
      </button>
    </motion.div>
  );
};