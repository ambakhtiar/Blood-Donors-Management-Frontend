import { ReactNode } from "react";
import Navbar from "@/components/shared/Navbar";

export default function HospitalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
