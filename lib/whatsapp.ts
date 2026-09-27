// ============================================================================
// JahitFlow WhatsApp Notification & Digital Invoice Helper
// ============================================================================

export function formatPhoneNumber(phone?: string | null): string {
  if (!phone) return "";
  let cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  } else if (cleaned.startsWith("+62")) {
    cleaned = cleaned.slice(1);
  } else if (!cleaned.startsWith("62") && cleaned.length > 0) {
    cleaned = "62" + cleaned;
  }
  return cleaned;
}

export interface InvoiceOrderData {
  code: string;
  customerName: string;
  phone?: string;
  itemName: string;
  dueDate?: string;
  price?: number;
  paid?: number;
  notes?: string;
  status?: string;
}

export interface StoreInfoData {
  name?: string;
  whatsapp?: string;
  address?: string;
}

export function buildWhatsAppInvoiceMessage(
  order: InvoiceOrderData,
  storeInfo?: StoreInfoData
): string {
  const storeName = storeInfo?.name || "Satria Tailor";
  const price = Number(order.price) || 0;
  const paid = Number(order.paid) || 0;
  const sisa = Math.max(0, price - paid);
  const isLunas = sisa === 0 && price > 0;
  const origin = typeof window !== "undefined" ? window.location.origin : "https://jahitflow.com";
  const trackingUrl = `${origin}/tracking?code=${encodeURIComponent(order.code)}`;

  const formatRp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

  return `Halo Kak *${order.customerName}*, terima kasih telah mempercayakan jahitan pakaian Anda di *${storeName}*! ✂️✨

Berikut rincian nota pesanan resmi Anda:
━━━━━━━━━━━━━━━━━━━━
📄 *No. Nota* : *${order.code}*
👗 *Busana*   : ${order.itemName}
📅 *Target Selesai* : ${order.dueDate || "Sesuai Jadwal"}
💰 *Total Biaya*   : ${formatRp(price)}
💵 *Telah Dibayar* : ${formatRp(paid)} ${isLunas ? "*(LUNAS)*" : "*(DP / Titipan)*"}
💳 *Sisa Tagihan*  : *${isLunas ? "Rp 0 (LUNAS)" : formatRp(sisa)}*
━━━━━━━━━━━━━━━━━━━━

🔍 Pantau progres tahapan pengerjaan jahitan secara real-time di tautan resmi kami:
👉 ${trackingUrl}

${order.notes ? `📝 *Catatan Khusus:* ${order.notes}\n\n` : ""}Kami akan mengabari kembali setelah busana Anda selesai dan siap diambil di bengkel jahit kami. Semoga harinya menyenangkan! 🙏`;
}

export function openWhatsAppInvoice(
  order: InvoiceOrderData,
  storeInfo?: StoreInfoData
): boolean {
  if (!order.phone || order.phone === "-" || order.phone.length < 5) {
    return false;
  }
  const targetPhone = formatPhoneNumber(order.phone);
  const text = buildWhatsAppInvoiceMessage(order, storeInfo);
  const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
  if (typeof window !== "undefined") {
    window.open(url, "_blank");
  }
  return true;
}

export function buildWhatsAppPickupReminderMessage(
  order: InvoiceOrderData,
  storeInfo?: StoreInfoData
): string {
  const storeName = storeInfo?.name || "Satria Tailor";
  const price = Number(order.price) || 0;
  const paid = Number(order.paid) || 0;
  const sisa = Math.max(0, price - paid);
  const isLunas = sisa === 0 && price > 0;
  const origin = typeof window !== "undefined" ? window.location.origin : "https://jahitflow.com";
  const trackingUrl = `${origin}/tracking?code=${encodeURIComponent(order.code)}`;
  const formatRp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

  return `Halo Kak *${order.customerName}* kabar gembira! 👗✨

Pesanan jahitan Anda di *${storeName}* dengan No. Nota *${order.code}* (${order.itemName}) telah *SELESAI & SIAP DIAMBIL* di bengkel kami.

━━━━━━━━━━━━━━━━━━━━
📄 *No. Nota*    : ${order.code}
👗 *Pakaian*     : ${order.itemName}
💳 *Sisa Tagihan*: *${isLunas ? "Rp 0 (LUNAS)" : formatRp(sisa)}*
━━━━━━━━━━━━━━━━━━━━

Cek status final di:
👉 ${trackingUrl}

Silakan datang untuk proses serah terima dan fitting akhir. Terima kasih! 🙏`;
}

export function openWhatsAppPickupReminder(
  order: InvoiceOrderData,
  storeInfo?: StoreInfoData
): boolean {
  if (!order.phone || order.phone === "-" || order.phone.length < 5) {
    return false;
  }
  const targetPhone = formatPhoneNumber(order.phone);
  const text = buildWhatsAppPickupReminderMessage(order, storeInfo);
  const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
  if (typeof window !== "undefined") {
    window.open(url, "_blank");
  }
  return true;
}

export interface ReceiptData {
  id: string;
  orderCode: string;
  customerName: string;
  totalAmount: number;
  paidAmount: number;
  paymentMethod: string;
  status: string;
  date: string;
  phone?: string;
}

export function buildWhatsAppReceiptMessage(
  receipt: ReceiptData,
  storeInfo?: StoreInfoData
): string {
  const storeName = storeInfo?.name || "Satria Tailor";
  const formatRp = (n: number) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;
  const sisa = Math.max(0, receipt.totalAmount - receipt.paidAmount);

  return `Halo Kak *${receipt.customerName}*, terima kasih! 🙏

Berikut bukti kwitansi transaksi pembayaran resmi Anda di *${storeName}*:
━━━━━━━━━━━━━━━━━━━━
🧾 *No. Kwitansi* : ${receipt.id}
📄 *No. Nota Pesanan* : ${receipt.orderCode}
📅 *Tanggal*      : ${receipt.date}
💳 *Metode*       : ${receipt.paymentMethod}
💵 *Nominal Bayar*: *${formatRp(receipt.paidAmount)}* (${receipt.status})
💰 *Total Tagihan*: ${formatRp(receipt.totalAmount)}
✨ *Sisa Tagihan* : *${sisa === 0 ? "Rp 0 (LUNAS)" : formatRp(sisa)}*
━━━━━━━━━━━━━━━━━━━━

Pembayaran telah tercatat aman di sistem kami. Terima kasih atas kepercayaan Anda! ✨`;
}

export function openWhatsAppReceipt(
  receipt: ReceiptData,
  storeInfo?: StoreInfoData
): boolean {
  const text = buildWhatsAppReceiptMessage(receipt, storeInfo);
  const targetPhone = formatPhoneNumber(receipt.phone || "");
  const url = targetPhone
    ? `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`
    : `https://wa.me/?text=${encodeURIComponent(text)}`;
  if (typeof window !== "undefined") {
    window.open(url, "_blank");
  }
  return true;
}

