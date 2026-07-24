import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ConfigBanner } from "../components/ConfigBanner";
import { AnnouncementBar } from "../components/AnnouncementBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopNest — Premium Shopping Experience",
  description:
    "Discover curated collections, top-rated products, and a seamless shopping experience. Built with Next.js + Firebase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ConfigBanner />
          <CartProvider>
            <AnnouncementBar />
            <Navbar />
            <main className="min-h-screen pb-14">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
