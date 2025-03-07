"use client";
import "./globals.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Redirect to login if no token
    }
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
