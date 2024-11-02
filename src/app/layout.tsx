'use client';

import { Inter } from "next/font/google";
import "@/styles/globals.css"
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
