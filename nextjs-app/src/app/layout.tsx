import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/components.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HealthAdmin | Gestión Hospitalaria",
  description: "Sistema de gestión de tipos de eventos y reservas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-theme="light" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
