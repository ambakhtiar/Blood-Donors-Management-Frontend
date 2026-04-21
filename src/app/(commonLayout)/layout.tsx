"use client";

import { ReactNode } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { usePathname } from "next/navigation";

export default function CommonLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <>
      <Navbar />
      <div className="flex-1">{children}</div>
      {(isHomePage || pathname === "/about") && <Footer />}
    </>
  );
}
