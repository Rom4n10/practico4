import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/ics/index.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgendaYa | Gestión de Agenda",
  description: "Sistema de gestión de tipos de eventos y reservas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body style={{ fontFamily: 'var(--font-family)' }}>{children}</body>
    </html>
  );
}
