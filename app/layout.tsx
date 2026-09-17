import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "JahitFlow • Sistem Operasional Usaha Jahit & Tailor",
  description: "Digitalisasi pelanggan, ukuran, pesanan, pembayaran, dan proses pengerjaan dalam satu sistem yang sederhana.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧵</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className="font-sans antialiased text-slate-800 bg-[#FBF9F5] selection:bg-indigo-100 selection:text-indigo-900">
        {children}
      </body>
    </html>
  );
}