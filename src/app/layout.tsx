"use client";
import "./globals.css";
import { SessionProvider } from 'next-auth/react';
import 'react-international-phone/style.css';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="min-h-screen bg-[#f7f7f7]">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

