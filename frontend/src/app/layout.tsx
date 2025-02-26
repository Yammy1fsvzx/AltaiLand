import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import VisitTracker from '@/components/VisitTracker';
import "./globals.css";
import { AdminProvider } from '@/contexts/AdminContext'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AltaiLand - Земельные участки в Алтае",
  description: "Продажа земельных участков в живописных местах Алтая",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${plusJakartaSans.variable} ${inter.variable} font-sans antialiased` }>
        <AdminProvider>
          <VisitTracker />
          {children}
        </AdminProvider>
      </body>
    </html>
  );
}
