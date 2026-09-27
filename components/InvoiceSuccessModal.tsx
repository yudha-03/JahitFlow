"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Phone, 
  Printer, 
  Copy, 
  Check, 
  X, 
  Calendar, 
  Scissors, 
  Receipt,
  ExternalLink
} from "lucide-react";
import { openWhatsAppInvoice, InvoiceOrderData, StoreInfoData } from "@/lib/whatsapp";

interface InvoiceSuccessModalProps {
  order: InvoiceOrderData | null;
  storeInfo?: StoreInfoData;
  onClose: () => void;
  onViewReceipt?: (order: InvoiceOrderData) => void;
}

export default function InvoiceSuccessModal({
  order,
  storeInfo,
  onClose,
  onViewReceipt,
}: InvoiceSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const price = Number(order.price) || 0;
  const paid = Number(order.paid) || 0;
  const sisa = Math.max(0, price - paid);
  const isLunas = sisa === 0 && price > 0;
  const formatRp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

  const handleCopyCode = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(order.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendWhatsApp = () => {
    const success = openWhatsAppInvoice(order, storeInfo);
    if (!success) {
      alert("Nomor WhatsApp pelanggan belum valid atau belum diisi.");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-100 z-10 max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-950 to-indigo-950 text-white relative">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-white rounded-xl hover:bg-white/10 transition"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-300 font-bold">
                  Sukses Tersimpan
                </span>
                <h3 className="font-extrabold text-lg sm:text-xl text-white">
                  Nota Jahitan Siap Dikirim!
                </h3>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
            {/* Nota Code Card */}
            <div className="flex items-center justify-between p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider block">
                  Nomor Nota Pesanan
                </span>
                <span className="text-base font-black text-indigo-950 font-mono tracking-wide">
                  {order.code}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition border border-indigo-200/60 shadow-2xs active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Tersalin!" : "Salin Kode"}</span>
              </button>
            </div>

            {/* Summary Details */}
            <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200/90 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 pb-2.5 border-b border-stone-200/80">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Pelanggan</span>
                  <p className="font-extrabold text-slate-900 text-sm mt-0.5">{order.customerName}</p>
                  <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400" /> {order.phone || "Tidak ada nomor"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Target Selesai</span>
                  <p className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center justify-end gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {order.dueDate || "Sesuai Jadwal"}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Jenis Busana</span>
                <p className="font-bold text-slate-800 bg-white p-2.5 rounded-xl border border-stone-200/70 mt-1 flex items-center gap-2">
                  <Scissors className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>{order.itemName}</span>
                </p>
              </div>

              {/* Breakdown Finance */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between font-medium text-slate-600">
                  <span>Total Ongkos Jahit:</span>
                  <span className="font-bold text-slate-900">{formatRp(price)}</span>
                </div>
                <div className="flex justify-between font-medium text-emerald-700">
                  <span>Pembayaran Awal ({isLunas ? "LUNAS" : "DP"}):</span>
                  <span className="font-bold">{formatRp(paid)}</span>
                </div>
                <div className="flex justify-between font-black text-slate-900 border-t border-stone-200/80 pt-2 text-sm">
                  <span>Sisa Tagihan:</span>
                  <span className={isLunas ? "text-emerald-700" : "text-rose-600"}>
                    {isLunas ? "Rp 0 (LUNAS)" : formatRp(sisa)}
                  </span>
                </div>
              </div>
            </div>

            {/* Hint Notice */}
            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              💡 Kirimkan nota ini langsung ke WhatsApp pelanggan agar mereka dapat memantau status jahitan secara mandiri.
            </p>
          </div>

          {/* Action Footer */}
          <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
            {onViewReceipt && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewReceipt(order);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-stone-100 text-slate-700 border border-stone-200 rounded-xl text-xs font-bold transition shadow-2xs"
              >
                <Receipt className="w-4 h-4 text-indigo-600" />
                <span>Lihat / Cetak Nota</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-md shadow-emerald-600/25 active:scale-95 transition-all"
            >
              <Phone className="w-4 h-4 fill-white" />
              <span>Kirim Nota via WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition"
            >
              Nanti Saja
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
