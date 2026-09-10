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
  Scissors
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
    <div className="relative min-h-screen flex bg-gray-50">
      
      {/* TOMBOL KEMBALI */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 md:top-8 md:left-8 z-50 flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-sm transition-all hover:bg-white hover:text-blue-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Kembali ke Beranda</span>
        <span className="sm:hidden">Kembali</span>
      </Link>

      <RegisterVisual />
      
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 md:p-16 overflow-y-auto">
        <div className="w-full max-w-md pt-12 lg:pt-0">
          
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Scissors size={20} />
            </div>
            <span className="text-xl font-bold text-gray-900">JahitFlow</span>
          </div>

          {step < 3 && <ProgressIndicator step={step} />}

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
    <div className="hidden lg:flex lg:w-1/2 bg-blue-700 relative overflow-hidden flex-col justify-between p-12 text-white">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-600/50 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-800/50 blur-3xl" />

      <div className="relative z-10 flex items-center gap-3 mt-16">
        <div className="bg-white text-blue-700 p-2.5 rounded-xl">
          <Scissors size={24} />
        </div>
        <span className="text-2xl font-bold tracking-tight">JahitFlow</span>
      </div>

      <div className="relative z-10 max-w-lg mt-12 mb-auto">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
          Bawa usaha jahit Anda ke langkah berikutnya.
        </h1>
        <p className="text-blue-100 text-lg sm:text-xl mb-10 leading-relaxed">
          Kelola pelanggan, ukuran, pesanan, dan pembayaran dalam satu sistem yang sederhana.
        </p>

        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <Check size={18} className="text-white" />
            </div>
            <p className="text-blue-50 text-lg">Data pelanggan tersimpan lebih rapi</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <Check size={18} className="text-white" />
            </div>
            <p className="text-blue-50 text-lg">Ukuran pelanggan mudah ditemukan</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <Check size={18} className="text-white" />
            </div>
            <p className="text-blue-50 text-lg">Pesanan lebih mudah dipantau</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 text-blue-200 text-sm">
        © {new Date().getFullYear()} JahitFlow. Sistem Manajemen Operasional Usaha Jahit.
      </div>
    </div>
  );
};

const ProgressIndicator = ({ step }: { step: Step }) => {
  return (
    <div className="w-full">
      <p className="text-sm font-medium text-blue-600 mb-4">Langkah {step} dari 2</p>
      <div className="flex items-center w-full">
        <div className="flex items-center text-blue-600">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-sm">
            {step > 1 ? <Check size={16} /> : 1}
          </div>
          <span className="ml-3 font-medium">Akun</span>
        </div>
        
        <div className="flex-1 px-4">
          <div className={`h-[2px] w-full rounded-full transition-colors duration-300 ${step > 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
        </div>

        <div className={`flex items-center ${step === 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors duration-300
            ${step === 2 ? 'border-blue-600 bg-white text-blue-600' : 'border-gray-200 bg-white text-gray-400'}
          `}>
            2
          </div>
          <span className="ml-3 font-medium">Usaha</span>
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

    // Front-end saja: langsung lanjut ke step berikutnya, tanpa menyimpan data apa pun
    onNext();
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Mulai Bersama JahitFlow 🧵</h2>
        <p className="text-gray-500">Buat akun untuk mulai mengelola usaha jahit Anda.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pemilik</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <User size={20} />
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`block w-full pl-10 pr-3 py-3 border ${errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white`}
              placeholder="Masukkan nama lengkap"
            />
          </div>
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Mail size={20} />
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white`}
              placeholder="Masukkan email Anda"
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock size={20} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`block w-full pl-10 pr-12 py-3 border ${errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white`}
              placeholder="Buat kata sandi"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Kata Sandi</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock size={20} />
            </div>
            <input
              type={showConfirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className={`block w-full pl-10 pr-12 py-3 border ${errors.confirmPassword ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white`}
              placeholder="Ulangi kata sandi"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
        </div>

        <div className="flex items-start mt-4">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              checked={formData.agree}
              onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="font-medium text-gray-700 cursor-pointer">
              Saya menyetujui ketentuan penggunaan
            </label>
            {errors.agree && <p className="mt-1 text-sm text-red-500">{errors.agree}</p>}
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium text-lg transition-colors mt-6"
        >
          Buat Akun
          <ArrowRight size={20} />
        </button>

        <p className="text-center text-sm text-gray-600 mt-8">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
            Masuk →
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
    if (!phoneRegex.test(formData.whatsapp.replace(/\s+/g, ''))) {
      newErrors.whatsapp = "Masukkan nomor WhatsApp yang valid.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // Front-end saja: langsung lanjut ke step berikutnya, tanpa menyimpan data apa pun
    onNext();
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Ceritakan Tentang Usaha Anda</h2>
        <p className="text-gray-500">Informasi ini digunakan untuk menyiapkan ruang kerja khusus untuk usaha Anda.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Usaha</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Building2 size={20} />
            </div>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className={`block w-full pl-10 pr-3 py-3 border ${errors.businessName ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white`}
              placeholder="Contoh: Satria Tailor"
            />
          </div>
          {errors.businessName && <p className="mt-1 text-sm text-red-500">{errors.businessName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Phone size={20} />
            </div>
            <input
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className={`block w-full pl-10 pr-3 py-3 border ${errors.whatsapp ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white`}
              placeholder="Contoh: 0812xxxxxxxx"
            />
          </div>
          {errors.whatsapp && <p className="mt-1 text-sm text-red-500">{errors.whatsapp}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Usaha</label>
          <select
            value={formData.businessType}
            onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          >
            <option value="Usaha Jahit">Usaha Jahit</option>
            <option value="Konveksi">Konveksi</option>
            <option value="Butik">Butik</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        <div>
          <label className="flex justify-between items-center text-sm font-medium text-gray-700 mb-1">
            <span>Alamat Usaha</span>
            <span className="text-gray-400 font-normal">Opsional</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none text-gray-400">
              <MapPin size={20} />
            </div>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white resize-none"
              placeholder="Masukkan alamat usaha"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium text-lg transition-colors"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
          
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium text-lg transition-colors"
          >
            Lanjutkan
            <ArrowRight size={20} />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const SuccessState = ({ formData }: { formData: FormData }) => {
  const router = useRouter();
  
  // STATE LOADING DITAMBAHKAN
  const [isLoading, setIsLoading] = useState(false);

  const handleGoToDashboard = () => {
    setIsLoading(true);
    router.push("/dashboard");
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check size={40} className="text-green-600" />
      </div>
      
      <h2 className="text-3xl font-bold text-gray-900 mb-3">Usaha Anda Siap! 🎉</h2>
      <p className="text-gray-500 mb-8 text-lg">
        Selamat datang di JahitFlow.<br/>Ruang kerja usaha Anda berhasil dibuat.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 text-left shadow-sm mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Scissors size={20} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{formData.businessName}</h3>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <User size={18} className="text-gray-400" />
          <span>Pemilik: <strong>{formData.name}</strong></span>
        </div>
      </div>

      <button
        onClick={handleGoToDashboard}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium text-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
          />
        ) : (
          <>
            Masuk ke Dashboard
            <ArrowRight size={20} />
          </>
        )}
      </button>
    </motion.div>
  );
};