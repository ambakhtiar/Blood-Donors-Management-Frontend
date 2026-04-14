import { ReactNode } from "react";
import Navbar from "@/components/shared/Navbar";
import { RoleGuard } from "@/components/shared/RoleGuard";

export default function HospitalLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["HOSPITAL", "ADMIN", "SUPER_ADMIN"]}>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1">{children}</div>
      </div>
    </RoleGuard>
  );
}
