# Folder Komponen Reusable (JahitFlow)

Folder ini berisi komponen-komponen React/Next.js yang dapat digunakan kembali di berbagai halaman (`/dashboard`, `/orders`, `/customers`, `/payments`, `/reports`, `/settings`) agar kode tidak perlu ditulis berulang-ulang.

---

## 📁 Daftar Komponen

### 1. `Sidebar.tsx`
Komponen sidebar navigasi JahitFlow lengkap dengan:
- Logo brand Satria Tailor
- Menu navigasi aktif otomatis (`usePathname()`)
- Drawer responsif & backdrop overlay untuk layar mobile
- Profil akun & tombol keluar (logout)

**Cara Pakai:**
```tsx
import { useState } from "react";
import { Sidebar } from "@/components"; // atau import Sidebar from "@/components/Sidebar";

export default function MyPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div>
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      {/* Konten Halaman */}
    </div>
  );
}
```

---

### 2. `Header.tsx`
Komponen header bar bagian atas yang menyediakan tombol hamburger menu mobile, judul halaman, subjudul, dan slot aksi (tombol filter, search, tambah data, dll).

**Cara Pakai:**
```tsx
import { Header } from "@/components";

<Header
  title="Pelanggan"
  subtitle="Kelola data pelanggan dan ukuran jahit"
  onOpenMenu={() => setIsMobileMenuOpen(true)}
>
  <button className="btn-primary">+ Tambah Pelanggan</button>
</Header>
```

---

### 3. `DashboardLayout.tsx` (Solusi Paling Praktis)
Komponen pembungkus serbaguna yang otomatis menggabungkan **Sidebar** + **Header** + penanganan menu mobile ke dalam satu wrapper, sehingga halaman kamu tinggal mengisi konten saja!

**Cara Pakai:**
```tsx
import { DashboardLayout } from "@/components";

export default function CustomersPage() {
  return (
    <DashboardLayout
      title="Data Pelanggan"
      subtitle="Kelola data pelanggan dan catatan ukuran"
      headerActions={
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl">
          + Tambah Pelanggan
        </button>
      }
    >
      {/* Isi konten halaman di sini tanpa perlu pusing mikir sidebar & header lagi */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        Konten Halaman Pelanggan
      </div>
    </DashboardLayout>
  );
}
```

---

### 4. `StatusBadge.tsx`
Menghilangkan fungsi `getStatusBadge` yang berulang di setiap tabel pesanan atau pembayaran.

**Cara Pakai:**
```tsx
import { OrderStatusBadge, PaymentStatusBadge } from "@/components";

// Untuk pesanan: "Belum Dikerjakan" | "Dipotong" | "Dijahit" | "Siap Diambil" | "Selesai"
<OrderStatusBadge status={order.status} />

// Untuk pembayaran: "Lunas" | "DP" | "Belum Lunas"
<PaymentStatusBadge status={trx.status} />
```

---

### 5. `Toast.tsx`
Notifikasi pop-up feedback sukses/error saat simpan atau ubah data.

**Cara Pakai:**
```tsx
import { Toast } from "@/components";

<Toast message={toastMessage} />
```
