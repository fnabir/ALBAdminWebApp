'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css"
import { AuthProvider, useAuth } from "@/context/AuthContext";
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
